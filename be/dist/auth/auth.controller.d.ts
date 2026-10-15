import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: import("../users/entities/user.entity.js").UserRole;
        isActive: boolean;
        currency: string;
    }>;
}
