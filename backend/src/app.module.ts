import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FormModule } from './form/form.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { OptionModule } from './option/option.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, FormModule, QuestionModule, OptionModule],
})
export class AppModule { }
