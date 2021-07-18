import { OnModuleDestroy } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import * as redis from 'redis';
import { ClientOpts, RedisClient } from 'redis';
import { Types } from 'src/shared/ObjectType';
import { promisify } from 'util';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private redisClient: RedisClient;
  private getAsync: (key: string) => Promise<string>;
  private setAsync: (
    key: string,
    value: string,
    command: string,
    time: number,
  ) => Promise<string>;

  constructor() {
    const redisOptions: ClientOpts = {
      host: process.env.REDISHOST || '127.0.0.1',
      port: Number(process.env.REDISPORT) || 6379,
    };

    if (process.env.REDISHOST) {
      redisOptions.password = process.env.REDISPASSWORD;
    }

    this.redisClient = redis.createClient(redisOptions);

    this.redisClient.on('connect', () => {
      console.log('Redis client connected');
    });

    this.redisClient.on('error', (error) => {
      console.error(error);
    });

    this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
    this.setAsync = promisify(this.redisClient.set).bind(this.redisClient);
  }

  async onModuleDestroy() {
    this.redisClient.quit();
  }

  async setCache(key: number | string, type: Types, value: string) {
    try {
      console.log('Setting cache');
      await this.setAsync(type + key, value, 'EX', 60 * 60 * 24); //set the cache to expire in 24 hours
    } catch (e) {}
  }

  async getCache(key: number | string, type: Types): Promise<string | null> {
    try {
      return await this.getAsync(type + key);
    } catch (e) {}
    return null;
  }
}
