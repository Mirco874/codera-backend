import { Module } from "@nestjs/common";
import { UserModule } from "src/User/User.module";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./jwt.strategy";

@Module(
{
  imports:[
    UserModule,
    PassportModule,
    JwtModule.register({
      secret:jwtConstants.secret,
      signOptions:{expiresIn:'60m'}
    }),
  ],
  providers:[AuthService,JwtStrategy ],
  exports:[AuthService]  
})

export class AuthModule{}