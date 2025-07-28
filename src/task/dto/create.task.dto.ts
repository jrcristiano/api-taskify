import { IsString, IsOptional, IsInt, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Estudar NestJS',
    description: 'Título da tarefa',
  })
  @IsString()
	@MinLength(2)
  title: string;

  @ApiProperty({
    example: 'Revisar decorators e guards',
    description: 'Descrição opcional da tarefa',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'ID do status da tarefa',
  })
  @IsInt()
  statusId: number;
}
