import { Module } from '@nestjs/common';
import { MongoModule } from './mongo/mongo.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';

@Module({
  imports: [ConfigModule.forRoot(), MongoModule, UserModule],
})
export class AppModule {}
