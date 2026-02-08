import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @MessagePattern('employee.create')
  create(@Payload() payload: CreateEmployeeDto) {
    return this.employeeService.create(payload);
  }

  @MessagePattern('employee.findAll')
  findAll() {
    return this.employeeService.findAll();
  }

  @MessagePattern('employee.findOne')
  findOne(@Payload() payload: { id: string }) {
    return this.employeeService.findOne(payload.id);
  }

  @MessagePattern('employee.update')
  update(
    @Payload()
    payload: { id: string; data: UpdateEmployeeDto },
  ) {
    return this.employeeService.update(payload.id, payload.data);
  }

  @MessagePattern('employee.remove')
  remove(@Payload() payload: { id: string }) {
    return this.employeeService.remove(payload.id);
  }
}
