import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthService implements OnModuleInit {
    private usersRepository;
    private categoriesRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, categoriesRepository: Repository<Category>, jwtService: JwtService);
    onModuleInit(): Promise<void>;
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            fullName: string;
            email: string;
            role: import("../users/entities/user.entity.js").UserRole;
            isActive: boolean;
            currency: string;
        };
        accessToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            fullName: string;
            email: string;
            role: import("../users/entities/user.entity.js").UserRole;
            isActive: true;
            currency: string;
        };
        accessToken: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: import("../users/entities/user.entity.js").UserRole;
        isActive: boolean;
        currency: string;
    }>;
}
