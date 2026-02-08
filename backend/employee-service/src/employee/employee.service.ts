import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import type { EmployeeRepository } from './domain/employee.repository';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject('EmployeeRepository')
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  create(dto: CreateEmployeeDto) {
    return this.employeeRepository.create(dto);
  }

  findAll() {
    return this.employeeRepository.findAll();
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findById(id);

    if (!employee) {
      throw new RpcException({
        statusCode: 404,
        message: 'Employee not found',
      });
    }

    return employee;
  }

  update(id: string, dto: UpdateEmployeeDto) {
    return this.employeeRepository.update(id, dto);
  }

  async remove(id: string) {
    await this.employeeRepository.delete(id);

    return { success: true };
  }
}
