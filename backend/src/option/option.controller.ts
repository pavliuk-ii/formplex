import { Body, Controller, Delete, Param, Patch, Post, UseGuards, ParseIntPipe } from '@nestjs/common';
import { OptionService } from './option.service';
import { CreateOptionDto, UpdateOptionDto } from './dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('forms/:formId/questions/:questionId/options')
export class OptionController {
  constructor(private optionService: OptionService) { }

  @Post()
  addOptionToQuestion(
    @GetUser('id') userId: number,
    @Param('formId', ParseIntPipe) formId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() dto: CreateOptionDto
  ) {
    return this.optionService.addOptionToQuestion(userId, formId, questionId, dto);
  }

  @Patch(':optionId')
  updateOption(
    @GetUser('id') userId: number,
    @Param('formId', ParseIntPipe) formId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Param('optionId', ParseIntPipe) optionId: number,
    @Body() dto: UpdateOptionDto
  ) {
    return this.optionService.updateOption(userId, formId, questionId, optionId, dto);
  }

  @Delete(':optionId')
  deleteOption(
    @GetUser('id') userId: number,
    @Param('formId', ParseIntPipe) formId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Param('optionId', ParseIntPipe) optionId: number
  ) {
    return this.optionService.deleteOption(userId, formId, questionId, optionId);
  }
}
