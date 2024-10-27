import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsDecimal, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateLocationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'The building of the location', example: 'A' })
  building?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'The name of the location', example: 'Headquarters' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, description: 'The number of the location', example: 'HQ-001' })
  locationNumber?: string;

  @IsOptional()
  @IsNumber({}, { message: 'The area must be a number.' })
  @Min(1, { message: 'The area must be greater than 0.' })
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, description: 'The area of the location in square meters', example: 1000 })
  area?: number;

  @IsOptional()
  @IsNumber({}, { message: 'The parent ID must be a number.' })
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, description: 'The ID of the parent location, if applicable', example: 1 })
  parentId?: number;
}