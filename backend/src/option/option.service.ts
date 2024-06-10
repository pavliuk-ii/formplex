import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOptionDto, UpdateOptionDto } from './dto';

@Injectable()
export class OptionService {
  constructor(private prisma: PrismaService) { }

  async addOptionToQuestion(userId: number, formId: number, questionId: number, dto: CreateOptionDto) {
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

    return this.prisma.option.create({
      data: {
        ...dto,
        questionId,
      },
    });
  }

  async updateOption(userId: number, formId: number, questionId: number, optionId: number, dto: UpdateOptionDto) {
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

    const option = await this.prisma.option.findUnique({
      where: { id: optionId },
    });

    if (!option || option.questionId !== questionId) {
      throw new ForbiddenException('Access to this option is denied');
    }

    return this.prisma.option.update({
      where: { id: optionId },
      data: { ...dto },
    });
  }

  async deleteOption(userId: number, formId: number, questionId: number, optionId: number) {
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

    const option = await this.prisma.option.findUnique({
      where: { id: optionId },
    });

    if (!option || option.questionId !== questionId) {
      throw new ForbiddenException('Access to this option is denied');
    }

    return this.prisma.option.delete({
      where: { id: optionId },
    });
  }
}
