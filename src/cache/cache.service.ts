import { Injectable } from '@nestjs/common';
import * as redis from 'redis';
import { RedisClient } from 'redis';
import { promisify } from 'util';

@Injectable()
export class CacheService {
  private redisClient: RedisClient;
  private getAsync: (key: string) => Promise<string>;
  private setAsync: (
    key: string,
    value: string,
    command: string,
    time: number,
  ) => Promise<string>;

  constructor() {
    this.redisClient = redis.createClient();
    this.redisClient.on('connect', () => {
      console.log('Redis client connected');
    });

    this.redisClient.on('error', (error) => {
      console.error(error);
    });

    this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
    this.setAsync = promisify(this.redisClient.set).bind(this.redisClient);
  }

  async setCache(key: string, value: string) {
    try {
      await this.setAsync(key, value, 'EX', 60 * 60 * 24);
    } catch (e) {
      console.log(e);
    }
  }

  async getCache(key: string): Promise<string | null> {
    try {
      return await this.getAsync(key);
    } catch (e) {
      console.log(e);
    }
    return null;
  }
}
