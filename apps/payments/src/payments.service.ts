import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreateChargeDto } from '@app/common';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.getOrThrow('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2025-02-24.acacia',
    },
  );
  constructor(private configService: ConfigService) {}

  async createCharge({ amount }: CreateChargeDto) {
    return await this.stripe.paymentIntents.create({
      amount: amount * 100,
      confirm: true,
      payment_method_types: ['card'],
      payment_method: 'pm_card_visa',
      currency: 'usd',
    });
  }
}
