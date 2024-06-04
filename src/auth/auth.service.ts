import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Model } from 'mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './entities/refresh-token.entity';
import { Role } from 'src/constants/enum';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,

    private jwtService: JwtService,

    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,

    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };

    const refresh_token = this.createRefreshToken(payload);

    //update refresh token
    // await this.usersService.updateUserToken(_id, refresh_token);
    await this.refreshTokenModel.create({ user_id: _id, token: refresh_token });

    // set cookie
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      _id,
      name,
      email,
      role,
    };
  }

  async provider(user: any, response: Response) {
    //check email exist
    const userExist = await this.userModel.findOneAndUpdate(
      { email: user.email },
      {
        name: user.name,
        avatar: user.image,
      },
      {
        omitUndefined: true,
        upsert: true,
        new: true,
      },
    );
    if (userExist) {
      const { _id, name, email, role, avatar } = userExist;
      const payload = {
        sub: 'token login',
        iss: 'from server',
        _id,
        name,
        email,
        role,
      };
      const refresh_token = this.createRefreshToken(payload);

      //update refresh token
      // await this.usersService.updateUserToken(_id, refresh_token);
      await this.refreshTokenModel.create({
        user_id: _id,
        token: refresh_token,
      });

      // set cookie
      // response.cookie('refresh_token', refresh_token, {
      //   httpOnly: true,
      //   maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
      // });

      return {
        access_token: this.jwtService.sign(payload),
        refresh_token,
        user: {
          _id,
          name,
          email,
          avatar,
          role,
        },
      };
    } else {
      let newUser = await this.userModel.create({
        name: user.name,
        email: user.email,
        avatar: user.image,
        role: Role.User,
      });
      const { _id, name, email, role, avatar } = newUser;
      const payload = {
        sub: 'token login',
        iss: 'from server',
        _id,
        name,
        email,
        avatar,
        role,
      };
      const refresh_token = this.createRefreshToken(payload);

      //update refresh token
      // await this.usersService.updateUserToken(_id, refresh_token);
      await this.refreshTokenModel.create({
        user_id: _id,
        token: refresh_token,
      });

      // set cookie
      // response.cookie('refresh_token', refresh_token, {
      //   httpOnly: true,
      //   maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
      // });

      return {
        access_token: this.jwtService.sign(payload),
        refresh_token,
        user: {
          _id,
          name,
          email,
          role,
        },
      };
    }
  }

  async register(registerUserDto: RegisterUserDto) {
    //check email exist
    const userExist = await this.userModel.findOne({
      email: registerUserDto.email,
    });
    if (userExist) {
      throw new BadRequestException('Email already exist');
    }

    registerUserDto.password = this.usersService.getHashPassword(
      registerUserDto.password,
    );
    let user = await this.userModel.create({
      ...registerUserDto,
      role: Role.User,
    });
    return {
      _id: user?._id,
      createdAt: user?.createdAt,
    };
  }

  createRefreshToken = (payload: any, expiresIn?: number) => {
    if (expiresIn) {
      const refresh_token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn,
      });
      return refresh_token;
    }
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refresh_token;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      // let user = await this.usersService.findUserByToken(refreshToken);
      const payload = this.jwtService.decode(refreshToken) as any;
      if (payload) {
        const { _id, name, email, role, exp } = payload;
        const newPayload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          name,
          email,
          role,
        };

        const expiresIn = exp - Math.floor(Date.now() / 1000);

        const newRefreshToken = this.createRefreshToken(newPayload, expiresIn);

        //update refresh token
        // await this.usersService.updateUserToken(_id.toString(), refresh_token);
        await this.refreshTokenModel.findOneAndUpdate(
          { token: refreshToken },
          { $set: { token: newRefreshToken } },
        );

        // set cookie
        response.clearCookie('refresh_token');

        response.cookie('refresh_token', newRefreshToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        });

        return {
          access_token: this.jwtService.sign(newPayload),
          _id,
          name,
          email,
          role,
        };
      }
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  };

  logout = async (refreshToken: string, response: Response) => {
    response.clearCookie('refresh_token');
    // await this.usersService.updateUserToken(user._id, '');
    await this.refreshTokenModel.deleteOne({ token: refreshToken });
    return 'ok';
  };
}
