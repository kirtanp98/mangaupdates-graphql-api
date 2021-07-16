import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Starting api:');
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
