import { UsersService } from './users.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt); // <-- Promisify scrypt to use in async functions and prevent callback hell

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async singup(email: string, password: string) {
    // see if email is already in use
    const users = await this.userService.find(email);
    if (users.length > 0) {
      throw new BadRequestException('Email already in use');
    }

    // hash the password
    // generate a salt
    const salt = randomBytes(8).toString('hex'); // <-- 8 bytes of random hex, each byte is 2 hex chars

    // hash the salt + password
    const hash = (await scrypt(password, salt, 32)) as Buffer; // <-- as Buffer is what actually gets returned from scrypt

    // join hash and salt together
    const result = salt + '.' + hash.toString('hex');

    // create the user and save the salt + hashed password to the database
    const user = await this.userService.create(email, result);

    // return the new user
    return user;
  }

  async login(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, hashedPassword] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (!hash.equals(Buffer.from(hashedPassword, 'hex'))) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }
}
