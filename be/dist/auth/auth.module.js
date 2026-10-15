var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './jwt.strategy.js';
import { User } from '../users/entities/user.entity.js';
import { Category } from '../categories/entities/category.entity.js';
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forFeature([User, Category]),
            PassportModule,
            JwtModule.registerAsync({
                imports: [ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'expense-manager-super-secret-key-2026-very-secure',
                    signOptions: {
                        expiresIn: (configService.get('JWT_EXPIRATION') || '7d'),
                    },
                }),
                inject: [ConfigService],
            }),
        ],
        controllers: [AuthController],
        providers: [AuthService, JwtStrategy],
        exports: [AuthService],
    })
], AuthModule);
export { AuthModule };
//# sourceMappingURL=auth.module.js.map