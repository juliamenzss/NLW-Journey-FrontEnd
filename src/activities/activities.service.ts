import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Activity, ActivityDocument } from './schemas/actvity.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async create(dto: CreateActivityDto): Promise<Activity> {
    try {
      const activity = this.activityModel.create(dto);
      return (await activity).save();
    } catch (error) {
      if (error.name === 'ValidationError')
        throw new BadRequestException('Validation Error', error);
    }
    throw new BadRequestException('Error creating activity');
  }

  async findAll(): Promise<Activity[]> {
    return this.activityModel.find().populate('userId').exec();
  }

  async findOne(id: string): Promise<Activity> {
    const activity = await this.activityModel
      .findById(id)
      .populate('userId')
      .exec();
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }

  async update(id: string, dto: UpdateActivityDto): Promise<Activity> {
    try {
      const activity = await this.activityModel
        .findByIdAndUpdate(id, dto, { new: true })
        .populate('userId')
        .exec();
      if (!activity) throw new NotFoundException('Activity not found');
      return activity;
    } catch (error) {
      if (error.name === 'ValidationError')
        throw new BadRequestException('Validation error', error);
    }
    throw new BadRequestException('Error update activity');
  }

  async remove(id: string) {
    const activity = await this.activityModel
      .findByIdAndDelete(id)
      .populate('userId')
      .exec();
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }
}
