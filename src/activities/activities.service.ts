import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>
  ) {}

  create(dto: CreateActivityDto) {
    const activity = this.repository.create(dto);
    return this.repository.save(activity);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: string) {
    return this.repository.findOneBy({ id });
  }

  async update(id: string, dto: UpdateActivityDto) {
    const activity = await this.repository.findOneBy({ id });
    if (!activity) return null;
    this.repository.merge(activity, dto);
    return this.repository.save(activity);
  }

  async remove(id: string) {
    const activity = await this.repository.findOneBy({ id });
    if (!activity) return null;
    return this.repository.remove(activity);
  }
}
