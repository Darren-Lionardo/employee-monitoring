import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { throwError, firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employees')
export class EmployeeController {
  constructor(
    @Inject('EMPLOYEE_SERVICE')
    private readonly employeeClient: ClientProxy,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Post()
  @Roles(Role.HRD)
  async create(@Body() dto: CreateEmployeeDto) {
    try {
      const user = await this.authService.registerEmployee({
        email: dto.email,
        password: dto.password,
      });

      return await firstValueFrom(
        this.employeeClient.send('employee.create', {
          id: user.id,
          name: dto.name,
          email: dto.email,
          position: dto.position,
        }),
      );
    } catch (error) {
      if (error instanceof RpcException || error?.status === 500) {
        await this.authService.deleteEmployee(dto.email).catch(() => null);
      }

      const message =
        error instanceof RpcException ? error.getError() : error?.message;

      if (error?.status && error.status < 500) {
        throw new BadRequestException(message || 'Failed to create employee');
      }

      throw new InternalServerErrorException(message || 'Something went wrong');
    }
  }

  @Get()
  @Roles(Role.HRD)
  findAll() {
    try {
      return firstValueFrom(this.employeeClient.send('employee.findAll', {}));
    } catch (error) {
      const message =
        error instanceof RpcException ? error.getError() : error?.message;

      if (error?.status && error.status < 500) {
        throw new BadRequestException(message);
      }

      throw new InternalServerErrorException(message || 'Something went wrong');
    }
  }

  @Get(':id')
  @Roles(Role.HRD)
  findOne(@Param('id') id: string) {
    try {
      return firstValueFrom(
        this.employeeClient.send('employee.findOne', { id: String(id) }).pipe(
          catchError((err) => {
            if (err?.statusCode === 404) {
              throw new NotFoundException(err.message);
            }

            return throwError(() => err);
          }),
        ),
      );
    } catch (error) {
      const message =
        error instanceof RpcException ? error.getError() : error?.message;

      if (error?.status && error.status < 500) {
        throw new BadRequestException(message);
      }

      throw new InternalServerErrorException(message || 'Something went wrong');
    }
  }

  @Patch(':id')
  @Roles(Role.HRD)
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    try {
      return firstValueFrom(
        this.employeeClient.send('employee.update', {
          id: String(id),
          data: dto,
        }),
      );
    } catch (error) {
      const message =
        error instanceof RpcException ? error.getError() : error?.message;

      if (error?.status && error.status < 500) {
        throw new BadRequestException(message);
      }

      throw new InternalServerErrorException(message || 'Something went wrong');
    }
  }

  @Delete(':id')
  @Roles(Role.HRD)
  remove(@Param('id') id: string) {
    try {
      return firstValueFrom(
        this.employeeClient.send('employee.remove', { id: String(id) }),
      );
    } catch (error) {
      const message =
        error instanceof RpcException ? error.getError() : error?.message;

      if (error?.status && error.status < 500) {
        throw new BadRequestException(message);
      }

      throw new InternalServerErrorException(message || 'Something went wrong');
    }
  }
}
