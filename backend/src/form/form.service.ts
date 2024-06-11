import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormDto, UpdateFormDto, PublishFormDto, CreateResponseDto } from './dto';

@Injectable()
export class FormService {
  constructor(private prisma: PrismaService) { }

  async createForm(userId: number, dto: CreateFormDto) {
    const { nanoid } = await import('nanoid');
    const uniqueUrl = nanoid(10);

    return this.prisma.form.create({
      data: {
        title: dto.title,
        description: dto.description,
        isAnonymous: dto.isAnonymous,
        url: uniqueUrl,
        user: {
          connect: { id: userId }
        },
      },
    });
  }

  async getFormsByUser(userId: number) {
    return this.prisma.form.findMany({
      where: { userId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async getFormByUrl(userId: number, formUrl: string) {
    const form = await this.prisma.form.findUnique({
      where: { url: formUrl },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!form || form.userId !== userId) {
      throw new ForbiddenException('Access to this form is denied');
    }

    return form;
  }

  async updateForm(userId: number, formUrl: string, dto: UpdateFormDto) {
    const form = await this.prisma.form.findUnique({
      where: { url: formUrl },
    });

    if (!form || form.userId !== userId) {
      throw new ForbiddenException('Access to this form is denied');
    }

    return this.prisma.form.update({
      where: { url: formUrl },
      data: {
        title: dto.title,
        description: dto.description,
        isAnonymous: dto.isAnonymous,
      },
    });
  }

  async deleteForm(userId: number, formUrl: string) {
    const form = await this.prisma.form.findUnique({
      where: { url: formUrl },
    });

    if (!form || form.userId !== userId) {
      throw new ForbiddenException('Access to this form is denied');
    }

    return this.prisma.form.delete({
      where: { url: formUrl },
    });
  }

  async publishForm(userId: number, formUrl: string, dto: PublishFormDto) {
    const form = await this.prisma.form.findUnique({
      where: { url: formUrl },
    });

    if (!form || form.userId !== userId) {
      throw new ForbiddenException('Access to this form is denied');
    }

    return this.prisma.form.update({
      where: { url: formUrl },
      data: { isPublished: dto.isPublished },
    });
  }

  async submitResponse(userId: number | null, formUrl: string, dto: CreateResponseDto) {
    const form = await this.prisma.form.findUnique({
      where: { url: formUrl },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!form || !form.isPublished) {
      throw new ForbiddenException('Form is not available');
    }

    if (!form.isAnonymous && !userId) {
      throw new ForbiddenException('User must be logged in to submit this form');
    }

    const requiredQuestions = form.questions.filter(q => q.isRequired);
    const answeredQuestions = new Set(dto.answers.map(a => a.questionId));
    const missingQuestions = requiredQuestions.filter(q => !answeredQuestions.has(q.id));

    if (missingQuestions.length > 0) {
      throw new BadRequestException('Not all required questions were answered');
    }

    const response = await this.prisma.formResponse.create({
      data: {
        user: userId ? { connect: { id: userId } } : undefined,
        form: { connect: { id: form.id } },
        questionResponses: {
          create: dto.answers.map(answer => ({
            question: { connect: { id: answer.questionId } },
            option: answer.optionId ? { connect: { id: answer.optionId } } : undefined,
            text: answer.text,
          })),
        },
      },
    });

    return response;
  }

  async getResponsesByFormOwner(userId: number, formUrl: string) {
    const form = await this.prisma.form.findUnique({
      where: { url: formUrl },
    });

    if (!form || form.userId !== userId) {
      throw new ForbiddenException('Access to this form is denied');
    }

    return this.prisma.formResponse.findMany({
      where: { formId: form.id },
      include: {
        questionResponses: true,
      },
    });
  }
}
