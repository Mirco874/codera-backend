import {ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { JWTPayload } from './JWTPayload.model';
import { AuthService } from './auth.service';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService: AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        })
    }

    async validate(payload: JWTPayload) {
        console.log('+++++++++++++++++++++++++++++++++++')
        console.log(payload)
        const user = await this.authService.verifyToken(payload);
        console.log(user)
        console.log('+++++++++++++++++++++++++++++++++++')
        if (!user) {
          return;
        }
        return user;
      }

}


