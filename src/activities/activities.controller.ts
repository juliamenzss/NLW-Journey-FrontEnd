import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, HttpCode } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const activity = await this.activitiesService.findOne(id);
    if(!activity) throw new NotFoundException();
    return activity;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
    const activity = await this.activitiesService.update(id, updateActivityDto);
    if(!activity) throw new NotFoundException();
    return activity;
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const activity = await this.activitiesService.remove(id);
    if(!activity) throw new NotFoundException();
  }
}
