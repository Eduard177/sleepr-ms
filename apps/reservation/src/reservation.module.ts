import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import {
  AUTH_SERVICE,
  DatabaseModule,
  LoggerModule,
  PAYMENTS_SERVICE,
} from '@app/common';
import { ReservationRepository } from './reservation.repository';
import {
  ReservationDocument,
  ReservationSchema,
} from './models/reservation.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configServices: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configServices.getOrThrow('AUTH_HOST'),
            port: configServices.getOrThrow('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configServices: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configServices.getOrThrow('PAYMENTS_HOST'),
            port: configServices.getOrThrow('PAYMENTS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationRepository],
})
export class ReservationModule {}
