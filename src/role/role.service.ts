// src/services/role.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
      @InjectRepository(Role)
      private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    const count = await this.roleRepository.count();
    if (count === 0) {
      // 기본 Role 데이터 삽입
      const defaultRoles = this.roleRepository.create([
        { role: 'User' },
        { role: 'Quest Provider' },
        { role: 'Protocol Provider' },
      ]);
      await this.roleRepository.save(defaultRoles);
      console.log('기본 Role 데이터가 성공적으로 삽입되었습니다.');
    } else {
      console.log('Role 데이터가 이미 존재합니다. 삽입을 건너뜁니다.');
    }
  }
}
