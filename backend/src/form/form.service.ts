import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormDto, UpdateFormDto, PublishFormDto } from './dto';

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

  async getFormById(userId: number, formId: number) {
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
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

  async updateForm(userId: number, formId: number, dto: UpdateFormDto) {
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form || form.userId !== userId) {
      throw new ForbiddenException('Access to this form is denied');
    }

    return this.prisma.form.update({
      where: { id: formId },
      data: {
        title: dto.title,
        description: dto.description,
        isAnonymous: dto.isAnonymous,
      },
    });
  }

  async deleteForm(userId: number, formId: number) {
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form || form.userId !== userId) {
      throw new ForbiddenException('Access to this form is denied');
    }

    return this.prisma.form.delete({
      where: { id: formId },
    });
  }

  async publishForm(userId: number, formId: number, dto: PublishFormDto) {
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form || form.userId !== userId) {
      throw new ForbiddenException('Access to this form is denied');
    }

    return this.prisma.form.update({
      where: { id: formId },
      data: { isPublished: dto.isPublished },
    });
  }
}
