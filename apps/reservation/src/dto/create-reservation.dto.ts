import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  endDate: Date;
  placeId: string;
  invoiceId: string;
}
