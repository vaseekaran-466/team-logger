import { IsDateString, IsMongoId, IsOptional } from 'class-validator';

export class FilterLogDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
