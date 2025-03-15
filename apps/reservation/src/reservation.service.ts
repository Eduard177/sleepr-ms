import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto, UpdateReservationDto } from './dto';
import { ReservationRepository } from './reservation.repository';
import { IUserDto, PAYMENTS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepo: ReservationRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy,
  ) {}
  async create(
    createReservationDto: CreateReservationDto,
    { email, _id }: IUserDto,
  ) {
    return this.paymentService
      .send('create_charge', { ...createReservationDto.charge, email })
      .pipe(
        map((res) => {
          return this.reservationRepo.create({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId: _id,
          });
        }),
      );
  }

  async findAll() {
    return this.reservationRepo.find({});
  }

  async findOne(_id: string) {
    return this.reservationRepo.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepo.findOneAndUpdate(
      { _id },
      {
        $set: updateReservationDto,
      },
    );
  }

  async remove(_id: string) {
    return this.reservationRepo.findOneAndDelete({ _id });
  }
}
