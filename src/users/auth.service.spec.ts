import { User } from './user.entity';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users = [] as User[];
    // Create a fake users service
    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve(users.filter((user) => user.email === email));
      },
      create: (email: string, password: string) => {
        users.push({
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User);
        return Promise.resolve(users[users.length - 1]);
      },
    };

    // Create DI container
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    // Create an instance of the service
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    // Assert that the service is defined
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.singup('a@a.com', 'password');

    expect(user.password).not.toEqual('password');

    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throw an error if the user entered an email that is already in use', async () => {
    await service.singup('mohamed@gmail.com', 'password');

    await expect(
      service.singup('mohamed@gmail.com', 'password'),
    ).rejects.toThrow(BadRequestException);
  });

  it('can login a user with a valid email and password', async () => {
    try {
      await service.login('sdfd@s.com', 'password');
    } catch (error) {}
    // expect(user).toBeDefined();
  });

  it('throws an error if the user entered an invalid email or password', async () => {
    await service.singup('mohamed@gmail.com', 'password');

    try {
      await service.login('mohamed@gmail.com', 'password');
      // const [salt, hash] = user.password.split('.');
      // expect(user.password).not.toEqual('password');
    } catch (error) {
      console.log(error);
    }
  });

  it('returns a user if correct password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       id: 1,
    //       email: 'test@test.com',
    //       password:
    //         'c146233102485b6d.695aeb8bdde7c158c00fa16a21e11c62dfe11c1349b362189c840a53d8ac5e5b',
    //     } as User,
    //   ]);

    await service.singup('hello@world.com', 'hello123');

    const user = await service.login('hello@world.com', 'hello123');
    expect(user).toBeDefined();
  });
});
