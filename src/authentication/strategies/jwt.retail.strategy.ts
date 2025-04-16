import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { jwt_retail } from '@const';
import JwtUser from '@interface/user.model';

@Injectable()
export class JwtRetailStrategy extends PassportStrategy(
  Strategy,
  'jwt-retail',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          if (!request?.headers?.authorization) {
            throw new HttpException(
              'Wrong credentials provided',
              HttpStatus.BAD_REQUEST,
            );
          }
          return request?.headers?.authorization
            .replace('Bearer ', '')
            .replace('bearer ', '');
        },
      ]),
      secretOrKey: jwt_retail.secret,
    });
  }

  async validate(payload: JwtUser) {
    return payload;
  }
}
