import { AuthService } from './auth.service';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CurrentUserMiddleware } from 'src/middlewares/current-user.middleware';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  // the typeormmodule.forFeature() method will create a repository for the User entity
  imports: [TypeOrmModule.forFeature([User])], // forFeature is used to register the entity with the typeorm module
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
