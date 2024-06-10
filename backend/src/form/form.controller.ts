import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto, UpdateFormDto, PublishFormDto, CreateResponseDto } from './dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('forms')
export class FormController {
  constructor(private formService: FormService) { }

  @Post()
  createForm(@GetUser('id') userId: number, @Body() dto: CreateFormDto) {
    return this.formService.createForm(userId, dto);
  }

  @Get()
  getFormsByUser(@GetUser('id') userId: number) {
    return this.formService.getFormsByUser(userId);
  }

  @Get(':formId')
  getFormById(@GetUser('id') userId: number, @Param('formId', ParseIntPipe) formId: number) {
    return this.formService.getFormById(userId, formId);
  }

  @Patch(':formId')
  updateForm(@GetUser('id') userId: number, @Param('formId', ParseIntPipe) formId: number, @Body() dto: UpdateFormDto) {
    return this.formService.updateForm(userId, formId, dto);
  }

  @Patch(':formId/publish')
  publishForm(@GetUser('id') userId: number, @Param('formId', ParseIntPipe) formId: number, @Body() dto: PublishFormDto) {
    return this.formService.publishForm(userId, formId, dto);
  }

  @Delete(':formId')
  deleteForm(@GetUser('id') userId: number, @Param('formId', ParseIntPipe) formId: number) {
    return this.formService.deleteForm(userId, formId);
  }

  @Post(':formId/responses')
  submitResponse(
    @GetUser('id') userId: number,
    @Param('formId', ParseIntPipe) formId: number,
    @Body() dto: CreateResponseDto
  ) {
    return this.formService.submitResponse(userId, formId, dto);
  }

  @Get(':formId/responses')
  @UseGuards(AuthGuard('jwt'))
  getResponsesByFormOwner(
    @GetUser('id') userId: number,
    @Param('formId', ParseIntPipe) formId: number
  ) {
    return this.formService.getResponsesByFormOwner(userId, formId);
  }
}
