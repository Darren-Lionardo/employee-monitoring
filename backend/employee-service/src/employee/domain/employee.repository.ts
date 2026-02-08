import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { UpdateEmployeeDto } from "../dto/update-employee.dto";
import { Employee } from "./employee.entity";

export interface EmployeeRepository {
  create(data: CreateEmployeeDto): Promise<Employee>;
  findAll(): Promise<Employee[]>;
  findById(id: string): Promise<Employee | null>;
  update(id: string, data: UpdateEmployeeDto): Promise<Employee>;
  delete(id: string): Promise<void>;
}
