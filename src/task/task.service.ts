import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { paginate } from 'src/common/pagination';
import { IPaginationOptions } from 'src/common/interfaces/pagination.options.interface';
import { QueryParams } from 'src/common/interfaces/query.params.interface';
import { TaskStatus } from 'src/common/enums/task.status.enum';

@Injectable()
export class TaskService {
	constructor(private prisma: PrismaService) { }

	async create(userId: number, createTaskDto: CreateTaskDto) {
		return this.prisma.task.create({
			data: {
				title: createTaskDto.title,
				description: createTaskDto.description,
				statusId: createTaskDto.statusId ?? 1,
				userId,
			},
		});
	}

	async paginate(
		userId: number, {
			status,
			search,
			page,
			perPage,
			withTrashed,
			order,
			sort,
		}: QueryParams) {
		const paginationOptions: IPaginationOptions = {
			page,
			perPage,
		};

		let clausule = {
			...this.getRelations(),
			where: {
				userId,
			},
			orderBy: {
				[sort || 'createdAt']: order || 'desc',
			},
		}

		const statusId = Number(status) as TaskStatus;

		if (status != TaskStatus.All) {
			clausule = {
				...clausule,
				where: {
					...clausule.where,
					statusId,
				} as any
			}
		}

		if (search) {
			clausule = {
				...clausule,
				where: {
					...clausule.where,
					title: {
						contains: search,
						mode: 'insensitive',
					},
				} as any
			}
		}

		if (withTrashed === 'false') {
			return paginate(this.prisma.task, paginationOptions, {
				...clausule,
				where: {
					...clausule.where,
				},
			});
		}

		return paginate(this.prisma.task, paginationOptions, clausule);
	}

	async findAll(userId: number, withTrashed = 'false') {
		const clausule = {
			...this.getRelations(),
			where: {
				userId,
			},
		}

		if (withTrashed === 'false') {
			return this.prisma.task.findMany({
				...clausule,
				where: {
					...clausule.where,
				},
				orderBy: { createdAt: 'desc' },
			});
		}

		return this.prisma.task.findMany({
			...clausule,
			orderBy: { createdAt: 'desc' },
		});
	}

	async findOne(userId: number, id: number) {
		const whereClause = {
			id,
			userId,
		};

		const task = await this.prisma.task.findFirst({
			...this.getRelations(),
			where: whereClause,
		});

		if (!task) {
			throw new NotFoundException('Task not found.');
		}

		return task;
	}

	async update(userId: number, id: number, updateTaskDto: UpdateTaskDto) {
		await this.findOne(userId, id);

		return this.prisma.task.update({
			where: {
				id,
				userId,
			},
			data: updateTaskDto,
		});
	}

	async delete(userId: number, id: number) {
		await this.findOne(userId, id);

		await this.prisma.task.delete({
			where: { id },
		});
	}

	private getRelations() {
		return {
			include: {
				status: true,
				user: {
					select: {
						id: true,
						name: true,
						lastname: true,
						email: true,
						createdAt: true,
					}
				}
			}
		}
	}
}
