import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
	Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { IAuthenticatedRequest } from 'src/common/interfaces/authenticated.request.interface';
import { HttpStatusCode } from 'src/common/enums/http.status.code.enum';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TaskStatus } from 'src/common/enums/task.status.enum';
import { SortOrder } from 'src/common/enums/sort.order.enum';

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova tarefa' })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso.' })
  @ApiBody({ type: CreateTaskDto })
  create(
    @Request() req: IAuthenticatedRequest,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.create(req.user.id, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tarefas paginadas' })
	@ApiQuery({ name: 'search', required: false, example: 'Tarefa 1' })
	@ApiQuery({ name: 'status', required: false, example: 1 })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 10 })
  paginate(
    @Request() req: IAuthenticatedRequest,
		@Query('status') status = TaskStatus.All,
		@Query('order') order = SortOrder.DESC,
		@Query('sort') sort = 'createdAt',
		@Query('search') search = '',
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
  ) {
    return this.taskService.paginate(req.user.id, {
			status,
			search,
			page,
			perPage,
			order,
			sort,
		});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma tarefa por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'withTrashed', required: false, example: 'false' })
  findOne(
    @Request() req: IAuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.taskService.findOne(req.user.id, +id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma tarefa por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateTaskDto })
  update(
    @Request() req: IAuthenticatedRequest,
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(req.user.id, +id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatusCode.NoContent)
  @ApiOperation({ summary: 'Deletar tarefa (soft delete)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Tarefa deletada com sucesso.' })
  delete(
    @Request() req: IAuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.taskService.delete(req.user.id, +id);
  }
}
