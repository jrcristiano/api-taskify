import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
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
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 10 })
  @ApiQuery({ name: 'withTrashed', required: false, example: 'false' })
  paginate(
    @Request() req: IAuthenticatedRequest,
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    @Query('withTrashed') withTrashed = 'false',
  ) {
    return this.taskService.paginate(req.user.id, page, perPage, withTrashed);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma tarefa por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'withTrashed', required: false, example: 'false' })
  findOne(
    @Request() req: IAuthenticatedRequest,
    @Param('id') id: string,
    @Query('withTrashed') withTrashed = 'false',
  ) {
    return this.taskService.findOne(req.user.id, +id, withTrashed);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma tarefa por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateTaskDto })
  update(
    @Request() req: IAuthenticatedRequest,
    @Param('id') id: string,
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

  @Delete(':id/force-delete')
  @HttpCode(HttpStatusCode.NoContent)
  @ApiOperation({ summary: 'Forçar deleção definitiva da tarefa' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Tarefa deletada permanentemente.' })
  forceDelete(
    @Request() req: IAuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.taskService.forceDelete(req.user.id, +id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatusCode.OK)
  @ApiOperation({ summary: 'Restaurar uma tarefa deletada' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tarefa restaurada com sucesso.' })
  async restore(
    @Param('id') id: number,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.taskService.restore(req.user.id, id);
  }

  @Post('restore-all')
  @HttpCode(HttpStatusCode.OK)
  @ApiOperation({ summary: 'Restaurar todas as tarefas deletadas' })
  @ApiResponse({ status: 200, description: 'Todas as tarefas restauradas.' })
  async restoreAll(
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.taskService.restoreAll(req.user.id);
  }
}
