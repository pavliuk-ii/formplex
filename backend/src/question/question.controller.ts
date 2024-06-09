import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto, UpdateQuestionDto } from './dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('forms/:formId/questions')
export class QuestionController {
  constructor(private questionService: QuestionService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  addQuestionToForm(@GetUser('id') userId: number, @Param('formId') formId: number, @Body() dto: CreateQuestionDto) {
    return this.questionService.addQuestionToForm(userId, formId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':questionId')
  updateQuestion(@GetUser('id') userId: number, @Param('formId') formId: number, @Param('questionId') questionId: number, @Body() dto: UpdateQuestionDto) {
    return this.questionService.updateQuestion(userId, formId, questionId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':questionId')
  deleteQuestion(@GetUser('id') userId: number, @Param('formId') formId: number, @Param('questionId') questionId: number) {
    return this.questionService.deleteQuestion(userId, formId, questionId);
  }
}
