import { Body, Controller, Delete, Param, Patch, Post, UseGuards, ParseIntPipe } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto, UpdateQuestionDto } from './dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('forms/:formUrl/questions')
export class QuestionController {
  constructor(private questionService: QuestionService) { }

  @Post()
  addQuestionToForm(
    @GetUser('id') userId: number,
    @Param('formUrl') formUrl: string,
    @Body() dto: CreateQuestionDto
  ) {
    return this.questionService.addQuestionToForm(userId, formUrl, dto);
  }

  @Patch(':questionId')
  updateQuestion(
    @GetUser('id') userId: number,
    @Param('formUrl') formUrl: string,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() dto: UpdateQuestionDto
  ) {
    return this.questionService.updateQuestion(userId, formUrl, questionId, dto);
  }

  @Delete(':questionId')
  deleteQuestion(
    @GetUser('id') userId: number,
    @Param('formUrl') formUrl: string,
    @Param('questionId', ParseIntPipe) questionId: number
  ) {
    return this.questionService.deleteQuestion(userId, formUrl, questionId);
  }
}
