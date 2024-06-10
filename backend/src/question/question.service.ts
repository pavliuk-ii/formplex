import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto, UpdateQuestionDto } from './dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) { }

  async addQuestionToForm(userId: number, formId: number, dto: CreateQuestionDto) {
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form || form.userId !== userId) {
      throw new ForbiddenException('Access to this form is denied');
    }

    return this.prisma.question.create({
      data: {
        ...dto,
        formId,
      },
    });
  }

  async updateQuestion(userId: number, formId: number, questionId: number, dto: UpdateQuestionDto) {
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form || form.userId !== userId) {
      throw new ForbiddenException('Access to this form is denied');
    }

    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question || question.formId !== formId) {
      throw new ForbiddenException('Access to this question is denied');
    }

    return this.prisma.question.update({
      where: { id: questionId },
      data: { ...dto },
    });
  }

  async deleteQuestion(userId: number, formId: number, questionId: number) {
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form || form.userId !== userId) {
      throw new ForbiddenException('Access to this form is denied');
    }

    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question || question.formId !== formId) {
      throw new ForbiddenException('Access to this question is denied');
    }

    return this.prisma.question.delete({
      where: { id: questionId },
    });
  }
}
