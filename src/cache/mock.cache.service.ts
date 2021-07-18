import { OnModuleDestroy } from '@nestjs/common';
import { Types } from 'src/shared/ObjectType';

export class MockCacheService implements OnModuleDestroy {
  private redisClient: Map<string, string>;

  constructor() {
    this.redisClient = new Map();
  }

  async onModuleDestroy() {
    this.redisClient = new Map();
  }

  async setCache(key: number | string, type: Types, value: string) {
    this.redisClient.set(type + key, value);
  }

  async getCache(key: number | string, type: Types): Promise<string | null> {
    return this.redisClient.get(type + key);
  }
}
