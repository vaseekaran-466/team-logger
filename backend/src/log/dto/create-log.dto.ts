import {
  IsDateString,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateLogDto {
  @IsDateString()
  date: string;

  @IsString()
  workDescription: string;

  @IsNumber()
  @Min(0.5)
  @Max(24)
  hoursWorked: number;

  @IsOptional()
  @IsMongoId()
  userId?: string;
}
