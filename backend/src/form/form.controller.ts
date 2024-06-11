import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto, UpdateFormDto, PublishFormDto, CreateResponseDto } from './dto';
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
  @Get(':formUrl')
  getFormById(@GetUser('id') userId: number, @Param('formUrl') formUrl: string) {
    return this.formService.getFormByUrl(userId, formUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':formUrl')
  updateForm(@GetUser('id') userId: number, @Param('formUrl') formUrl: string, @Body() dto: UpdateFormDto) {
    return this.formService.updateForm(userId, formUrl, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':formUrl/publish')
  publishForm(@GetUser('id') userId: number, @Param('formUrl') formUrl: string, @Body() dto: PublishFormDto) {
    return this.formService.publishForm(userId, formUrl, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':formUrl')
  deleteForm(@GetUser('id') userId: number, @Param('formUrl') formUrl: string) {
    return this.formService.deleteForm(userId, formUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':formUrl/responses')
  submitResponse(
    @GetUser('id') userId: number,
    @Param('formUrl') formUrl: string,
    @Body() dto: CreateResponseDto
  ) {
    return this.formService.submitResponse(userId, formUrl, dto);
  }

  @Post(':formUrl/responses/anonymous')
  submitAnonymousResponse(
    @Param('formUrl') formUrl: string,
    @Body() dto: CreateResponseDto
  ) {
    return this.formService.submitResponse(null, formUrl, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':formUrl/responses')
  getResponsesByFormOwner(
    @GetUser('id') userId: number,
    @Param('formUrl') formUrl: string
  ) {
    return this.formService.getResponsesByFormOwner(userId, formUrl);
  }
}
