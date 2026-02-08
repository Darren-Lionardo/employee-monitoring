import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ClockInDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}