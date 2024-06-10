import { Body, Controller, Delete, Param, Patch, Post, UseGuards, ParseIntPipe } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto, UpdateQuestionDto } from './dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('forms/:formId/questions')
export class QuestionController {
  constructor(private questionService: QuestionService) { }

  @Post()
  addQuestionToForm(
    @GetUser('id') userId: number,
    @Param('formId', ParseIntPipe) formId: number,
    @Body() dto: CreateQuestionDto
  ) {
    return this.questionService.addQuestionToForm(userId, formId, dto);
  }

  @Patch(':questionId')
  updateQuestion(
    @GetUser('id') userId: number,
    @Param('formId', ParseIntPipe) formId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() dto: UpdateQuestionDto
  ) {
    return this.questionService.updateQuestion(userId, formId, questionId, dto);
  }

  @Delete(':questionId')
  deleteQuestion(
    @GetUser('id') userId: number,
    @Param('formId', ParseIntPipe) formId: number,
    @Param('questionId', ParseIntPipe) questionId: number
  ) {
    return this.questionService.deleteQuestion(userId, formId, questionId);
  }
}
