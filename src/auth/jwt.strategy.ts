import { 
  ExtractJwt, 
  Strategy 
} from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { JWTPayload } from './JWTPayload.model';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: jwtConstants.secret,
      });
  }

  async validate(payload: JWTPayload) {
    const user = await this.authService.verifyToken(payload);
    if (!user) {
      return;
    }
    return user;
  }
}