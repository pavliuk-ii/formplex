import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto, UpdateFormDto, PublishFormDto } from './dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('forms')
export class FormController {
  constructor(private formService: FormService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createForm(@GetUser('id') userId: number, @Body() dto: CreateFormDto) {
    return this.formService.createForm(userId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getFormsByUser(@GetUser('id') userId: number) {
    return this.formService.getFormsByUser(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':formId')
  getFormById(@GetUser('id') userId: number, @Param('formId') formId: number) {
    return this.formService.getFormById(userId, formId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':formId')
  updateForm(@GetUser('id') userId: number, @Param('formId') formId: number, @Body() dto: UpdateFormDto) {
    return this.formService.updateForm(userId, formId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':formId/publish')
  publishForm(@GetUser('id') userId: number, @Param('formId') formId: number, @Body() dto: PublishFormDto) {
    return this.formService.publishForm(userId, formId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':formId')
  deleteForm(@GetUser('id') userId: number, @Param('formId') formId: number) {
    return this.formService.deleteForm(userId, formId);
  }
}
