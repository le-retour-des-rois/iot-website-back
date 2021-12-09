import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { SectionModule } from './section/section.module';
import { OrganizationModule } from './organization/organization.module';
import { DoorModule } from './door/door.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PGHOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    // --- CORE ---
    DatabaseModule,

    // --- APIs ---
    UserModule,
    SectionModule,
    OrganizationModule,
    DoorModule,
    AdminModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
