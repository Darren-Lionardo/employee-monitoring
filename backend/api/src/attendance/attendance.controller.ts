import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AttendanceResponseDto } from './dto/attendance-response.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(
    @Inject('ATTENDANCE_SERVICE')
    private readonly attendanceClient: ClientProxy,
  ) {}

  @Post('clock-in')
  @Roles(Role.EMPLOYEE)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async clockIn(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    const employeeId = req.user.userId;
    const photoUrl = file ? file.path : null;

    try {
      return this.attendanceClient.send('attendance.clockIn', {
        employeeId,
        photoUrl,
      });
    } catch (error) {
      const message =
        error instanceof RpcException ? error.getError() : error?.message;

      if (error?.status && error.status < 500) {
        throw new BadRequestException(message);
      }

      throw new InternalServerErrorException(message || 'Something went wrong');
    }
  }

  @Post('clock-out')
  @Roles(Role.EMPLOYEE)
  async clockOut(@Req() req: any) {
    const employeeId = req.user.userId;

    try {
      return await firstValueFrom(
        this.attendanceClient.send('attendance.clockOut', {
          employeeId,
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

  @Get(':id')
  @Roles(Role.HRD, Role.EMPLOYEE)
  async findAllByEmployeeId(@Param('id') employeeId: string) {
    try {
      return (await firstValueFrom(
        this.attendanceClient.send('attendance.findAllByEmployeeId', {
          employeeId,
        }),
      )) as AttendanceResponseDto[];
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
