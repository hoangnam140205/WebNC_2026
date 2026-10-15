export declare class CreateUserDto {
    fullName: string;
    email: string;
    password: string;
    role?: 'admin' | 'user';
    currency?: string;
}
