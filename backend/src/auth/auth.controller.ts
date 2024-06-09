import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, UpdateUserDto } from './dto';
import { GetUser } from './decorator/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  @Patch('update')
  @UseGuards(AuthGuard('jwt'))
  updateUser(@GetUser('id') userId: number, @Body() dto: UpdateUserDto) {
    return this.authService.updateUser(userId, dto);
  }
}
