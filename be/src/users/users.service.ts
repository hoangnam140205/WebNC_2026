import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { CategoriesService } from '../categories/categories.service.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private categoriesService: CategoriesService,
  ) {}

  async findAll() {
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.expenses', 'expense')
      .select([
        'user.id',
        'user.fullName',
        'user.email',
        'user.role',
        'user.isActive',
        'user.currency',
        'user.createdAt',
        'user.updatedAt',
      ])
      .loadRelationCountAndMap('user.expenseCount', 'user.expenses')
      .orderBy('user.createdAt', 'DESC')
      .getMany();

    return users;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['expenses', 'categories'],
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    const { password, ...result } = user;
    return result;
  }

  async create(createUserDto: CreateUserDto) {
    const existing = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
    if (existing) {
      throw new ConflictException('Email này đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || 'user',
      isActive: true,
      currency: createUserDto.currency || 'VND',
    });

    const saved = await this.usersRepository.save(user);

    // Seed danh mục mặc định (thu/chi) cho tài khoản mới tạo
    await this.categoriesService.seedDefaults(saved.id);

    const { password, ...result } = saved;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.usersRepository.findOne({ where: { email: updateUserDto.email } });
      if (emailExists) {
        throw new ConflictException('Email này đã được sử dụng');
      }
      user.email = updateUserDto.email;
    }

    if (updateUserDto.fullName) {
      user.fullName = updateUserDto.fullName;
    }

    if (updateUserDto.role) {
      user.role = updateUserDto.role;
    }

    if (updateUserDto.isActive !== undefined) {
      user.isActive = updateUserDto.isActive;
    }

    if (updateUserDto.currency) {
      user.currency = updateUserDto.currency;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updated = await this.usersRepository.save(user);
    const { password, ...result } = updated;
    return result;
  }

  async toggleActive(id: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new BadRequestException('Bạn không thể khóa tài khoản của chính mình');
    }

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    user.isActive = !user.isActive;
    const updated = await this.usersRepository.save(user);
    const { password, ...result } = updated;
    return result;
  }

  async remove(id: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new BadRequestException('Bạn không thể xóa tài khoản của chính mình');
    }

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    await this.usersRepository.remove(user);
    return { message: 'Đã xóa người dùng thành công' };
  }
}
