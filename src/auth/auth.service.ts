import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/User/service/User.service';
import { User } from '../User/entities/User.entity';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/User/dto/CreateUser.dto';
import { LoginUserDTO } from './dto/loginUser.dto';
import { JWTPayload } from './JWTPayload.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const findUser = await this.userService.findByEmail(email);

    if (findUser === null) {
      return null;
    }

    const samePassword = await compare(password, findUser.password);
    if (samePassword) {
      const { password, ...result } = findUser;
      return result;
    }

    return null;
  }

  async registerUser(createUserDTO: CreateUserDTO): Promise<User> {
    const hashedPassword = await hash(createUserDTO.password, 10);
    createUserDTO.password = hashedPassword; 
    return this.userService.persist(createUserDTO);
  }

  async login(loginUserDTO: LoginUserDTO) {
    const { email, password } = loginUserDTO;
    const findUser = await this.validateUser(email, password);

    if (!findUser) {
      throw new UnauthorizedException('check your email and password');
    }

    const payload: JWTPayload = {
      id: findUser.id,
      email: findUser.email,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async verifyToken(payload: JWTPayload) {
    return this.userService.validateJWTPayload(payload);
  }
}
