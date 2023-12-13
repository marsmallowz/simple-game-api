import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from './decorators/auth.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/resfresh-token.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('profile')
  getProfile(@Req() request) {
    return this.authService.getProfile(request.user.sub);
  }

  @Public()
  @Get('verify')
  emailVerification(@Query('token') token: string) {
    return this.authService.emailVerification(token);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('request-forget-password')
  requestForgetPassword(@Body() body: { email: string }) {
    return this.authService.requestForgetPassword(body.email);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('request-verify')
  requestVerify(@Body() body: { usernameOrEmail: string }) {
    return this.authService.requestVerify(body.usernameOrEmail);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @Public()
  @Get('forget-password')
  forgetPassword(
    @Query('token') token: string,
    @Query('password') password: string,
  ) {
    return this.authService.forgetPassword(token, password);
  }
}
