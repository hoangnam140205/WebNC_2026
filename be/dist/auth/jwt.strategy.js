var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
let JwtStrategy = class JwtStrategy extends PassportStrategy(Strategy) {
    usersRepository;
    constructor(configService, usersRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET', 'expense-manager-super-secret-key-2026-very-secure'),
        });
        this.usersRepository = usersRepository;
    }
    async validate(payload) {
        const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
        if (!user) {
            throw new UnauthorizedException('Người dùng không tồn tại');
        }
        if (!user.isActive) {
            throw new UnauthorizedException('Tài khoản của bạn đã bị khóa bởi Quản trị viên');
        }
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            isActive: user.isActive,
            currency: user.currency,
        };
    }
};
JwtStrategy = __decorate([
    Injectable(),
    __param(1, InjectRepository(User)),
    __metadata("design:paramtypes", [ConfigService,
        Repository])
], JwtStrategy);
export { JwtStrategy };
//# sourceMappingURL=jwt.strategy.js.map