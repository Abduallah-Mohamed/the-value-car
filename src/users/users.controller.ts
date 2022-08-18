import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  Session, // <-- Add Session to use session variables that coming from the browser
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import {
  Serilaize,
  // SerilaizeInterceptor,
} from '../interceptors/serilaize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serilaize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.singup(body.email, body.password);

    session.userId = user.id;

    return user;
  }

  @Post('login')
  async login(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);

    session.userId = user.id;

    return user;
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoami(@CurrentUser() user: UserDto) {
    console.log(user);
    return user;
  }

  @Post('logout')
  async logout(@Session() session: any) {
    session.userId = null;
  }

  /**
   *
   *
   * *@UseInterceptors(new SerilaizeInterceptor(UserDto))
   * *@Serilaize(UserDto); // that line is abbreviated as @UseInterceptors(SerilaizeInterceptor)
   */
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
