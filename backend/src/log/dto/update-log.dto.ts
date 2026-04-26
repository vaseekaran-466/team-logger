import {IsDateString,IsNumber,IsOptional,IsString,Max,Min,} from 'class-validator';

export class UpdateLogDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  workDescription?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(24)
  hoursWorked?: number;
}
