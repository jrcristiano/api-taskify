import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { paginate } from 'src/common/pagination';
import { IPaginationOptions } from 'src/common/interfaces/pagination.options.interface';

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

	async paginate(userId: number, page = 1, perPage = 10, withTrashed = 'false') {
		const paginationOptions: IPaginationOptions = {
			page,
			perPage,
		};

		const clausule = {
			...this.getRelations(),
			where: {
				userId,
			},
		}

		if (withTrashed === 'false') {
			return paginate(this.prisma.task, paginationOptions, {
				...clausule,
				where: {
					...clausule.where,
					deletedAt: null,
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
					deletedAt: null,
				},
				orderBy: { createdAt: 'desc' },
			});
		}

		return this.prisma.task.findMany({
			...clausule,
			orderBy: { createdAt: 'desc' },
		});
	}

	async findOne(userId: number, id: number, withTrashed = 'false') {
		const whereClause = {
			id,
			userId,
			...(withTrashed === 'false' ? { deletedAt: null } : {}),
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

	async update(userId: number, id: number, updateTaskDto: UpdateTaskDto, withTrashed = 'false') {
		await this.findOne(userId, id, withTrashed);

		return this.prisma.task.update({
			where: {
				id,
				userId,
			},
			data: updateTaskDto,
		});
	}

	async delete(userId: number, id: number, withTrashed = 'false') {
		await this.findOne(userId, id, withTrashed);

		await this.prisma.task.update({
			where: {
				id,
				userId,
			},
			data: {
				deletedAt: new Date(),
			},
		});
	}

	async forceDelete(userId: number, id: number, withTrashed = 'false') {
		await this.findOne(userId, id, withTrashed);

		await this.prisma.task.delete({
			where: { id },
		});
	}

	async restore(userId: number, id: number) {
		const task = await this.prisma.task.findFirst({
			where: {
				id,
				userId,
				deletedAt: { not: null },
			},
		});

		if (!task) {
			throw new NotFoundException('Task not found or not deleted');
		}

		return this.prisma.task.update({
			where: { id },
			data: {
				deletedAt: null,
			},
		});
	}

	async restoreAll(userId: number) {
		const result = await this.prisma.task.updateMany({
			where: {
				userId,
				deletedAt: { not: null },
			},
			data: {
				deletedAt: null,
			},
		});

		if (result.count === 0) {
			throw new NotFoundException('No deleted tasks found to restore');
		}

		return {
			message: `${result.count} tasks restored successfully`,
			count: result.count,
		};
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
