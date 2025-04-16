import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRetailStrategy } from './strategies/jwt.retail.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'this-will-be-overide',
    }),
  ],
  providers: [JwtStrategy, JwtRetailStrategy],
})
export class AuthenticationModule {}
