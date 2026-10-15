import { Injectable, ConflictException, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private jwtService: JwtService,
  ) { }

  async onModuleInit() {
    // Seed / Sync default admin
    const adminEmail = 'admin@expense.com';
    const adminPassword = 'admin123';
    let adminUser = await this.usersRepository.findOne({ where: { email: adminEmail } });

    if (!adminUser) {
      const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
      adminUser = this.usersRepository.create({
        fullName: 'Hệ thống Quản Trị Viên',
        email: adminEmail,
        password: hashedAdminPassword,
        role: 'admin',
        isActive: true,
        currency: 'VND',
      });
      await this.usersRepository.save(adminUser);
      console.log('✅ Seeded Admin: admin@expense.com / admin123');
    } else {
      // Tự động đồng bộ lại mật khẩu nếu bị lệch giữa code và DB
      const isPasswordMatch = await bcrypt.compare(adminPassword, adminUser.password);
      if (!isPasswordMatch) {
        adminUser.password = await bcrypt.hash(adminPassword, 10);
        await this.usersRepository.save(adminUser);
        console.log('🔄 Đã cập nhật lại mật khẩu Admin mẫu theo code: admin123');
      }
    }

    // Seed / Sync default user
    const demoEmail = 'user@expense.com';
    const demoPassword = 'user123';
    let demoUser = await this.usersRepository.findOne({ where: { email: demoEmail } });

    if (!demoUser) {
      const hashedUserPassword = await bcrypt.hash(demoPassword, 10);
      demoUser = this.usersRepository.create({
        fullName: 'Nguyễn Văn A',
        email: demoEmail,
        password: hashedUserPassword,
        role: 'user',
        isActive: true,
        currency: 'VND',
      });
      const savedUser = await this.usersRepository.save(demoUser);
      console.log('✅ Seeded User: user@expense.com / user123');

      // Seed sample categories for demo user
      const defaultCategories = [
        { name: 'Ăn uống', icon: '🍽️', color: '#f59e0b', type: 'expense' as const },
        { name: 'Mua sắm', icon: '🛍️', color: '#ec4899', type: 'expense' as const },
        { name: 'Di chuyển', icon: '🚗', color: '#3b82f6', type: 'expense' as const },
        { name: 'Hóa đơn & Tiện ích', icon: '💡', color: '#8b5cf6', type: 'expense' as const },
        { name: 'Giải trí', icon: '🎮', color: '#10b981', type: 'expense' as const },
        { name: 'Lương thưởng', icon: '💰', color: '#10b981', type: 'income' as const },
        { name: 'Đầu tư & Tiết kiệm', icon: '📈', color: '#06b6d4', type: 'income' as const },
      ];

      for (const cat of defaultCategories) {
        await this.categoriesRepository.save(
          this.categoriesRepository.create({
            ...cat,
            user: savedUser,
            userId: savedUser.id,
          }),
        );
      }
    } else {
      // Tự động đồng bộ lại nếu sửa fullName hoặc password trong code
      let needSave = false;
      const isPasswordMatch = await bcrypt.compare(demoPassword, demoUser.password);
      if (!isPasswordMatch) {
        demoUser.password = await bcrypt.hash(demoPassword, 10);
        needSave = true;
      }
      if (demoUser.fullName !== 'Nguyễn Văn A') {
        demoUser.fullName = 'Nguyễn Văn A';
        needSave = true;
      }
      if (needSave) {
        await this.usersRepository.save(demoUser);
        console.log('🔄 Đã đồng bộ thông tin tài khoản User mẫu (fullName / password) vào Database');
      }
    }
  }

  async register(registerDto: RegisterDto) {
    const { fullName, email, password } = registerDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      fullName,
      email,
      password: hashedPassword,
      role: 'user',
      isActive: true,
      currency: 'VND',
    });

    const savedUser = await this.usersRepository.save(user);

    // Create default categories for new user
    const defaultCategories = [
      { name: 'Ăn uống', icon: '🍽️', color: '#f59e0b', type: 'expense' as const },
      { name: 'Mua sắm', icon: '🛍️', color: '#ec4899', type: 'expense' as const },
      { name: 'Di chuyển', icon: '🚗', color: '#3b82f6', type: 'expense' as const },
      { name: 'Hóa đơn & Tiện ích', icon: '💡', color: '#8b5cf6', type: 'expense' as const },
      { name: 'Lương', icon: '💰', color: '#10b981', type: 'income' as const },
    ];
    for (const cat of defaultCategories) {
      await this.categoriesRepository.save(
        this.categoriesRepository.create({
          ...cat,
          user: savedUser,
          userId: savedUser.id,
        }),
      );
    }

    const payload = { sub: savedUser.id, email: savedUser.email, role: savedUser.role };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: savedUser.id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        role: savedUser.role,
        isActive: savedUser.isActive,
        currency: savedUser.currency,
      },
      accessToken: token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa bởi Quản trị viên');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        currency: user.currency,
      },
      accessToken: token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      currency: user.currency,
    };
  }
}
