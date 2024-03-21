import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDTO);
  }

  getTasks(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDTO);
  }

  getTask(id: string): Promise<Task> {
    return this.tasksRepository.getTask(id);
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.tasksRepository.delete(id);

    if (task.affected === 0) throw new NotFoundException();
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTask(id);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }
}
