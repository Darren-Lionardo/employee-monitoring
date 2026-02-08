import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ClockInDto {
  @IsOptional()
  @IsString()
  photoUrl?: string;
}
