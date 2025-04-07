// src/json.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSupabaseClient } from '../../supabase.client';

@Injectable()
export class RideService {
  private supabase;
  private readonly logger = new Logger(RideService.name);

  constructor(private configService: ConfigService) {
    this.supabase = createSupabaseClient(configService); // Create the Supabase client using ConfigService
  }

  async loadRideData() {
    const { data, error } = await this.supabase
      .from('Ride')
      .upsert({ id: '1', ride_data: ride });

    if (error) {
      this.logger.error('[Supabase Upsert Error]', error); // Use NestJS logger
      throw new Error('Error upsert JSON into Supabase');
    }

    return data;
  }

  async cleanRideData() {
    const { data, error } = await this.supabase
      .from('Ride')
      .delete({})
      .eq('id', '1');

    if (error) {
      this.logger.error('[Supabase delete Error]', error); // Use NestJS logger
      throw new Error('Error deleting JSON into Supabase');
    }

    return data;
  }

  async patchRideData(patch: Partial<RideData>) {
    const { data, error } = await this.supabase
      .from('Ride')
      .update({ ride_data: { ...ride, ...patch }, id: 1 })
      .eq('id', '1');

    if (error) {
      this.logger.error('[Supabase update Error]', error); // Use NestJS logger
      throw new Error('Error updating JSON into Supabase');
    }
    return data;
  }
}

const ride = {
  _id: '6694e86dceccc3a5506126d0',
  core_history: [
    {
      uuid_core: 'f3764ca1-5503-44ad-9ae0-a6219ca29449',
      id_core: 43498,
      core_date: '2023-08-24T13:54:21.000Z',
      type: 'reservation',
      flag: 'cancelled_no_charge',
      cancel_reason: '',
      cancel_description: '',
    },
  ],
  id: '2fc19c5b-84b3-4680-8ea4-92e959a99ea0',
  action_logs: [],
  actions_history: [],
  actual_start_date: '',
  billing: '',
  booker: {
    id: '0d8f5a67-6869-400d-901b-2b5b420b0491',
    firstname: 'API',
    lastname: 'LeCab',
  },
  booking_feedback: '',
  booking_logs: [],
  booking_platform: 'OTHER',
  cancel_reason: '',
  cancellation_date: 1717496518,
  cancelled_by: '',
  core_booking_details: '',
  cost_center: '',
  creation_date: 1692885261,
  current_issue: '',
  deleted_at: '',
  dispatch_engine: 'LEGACY',
  driver: '',
  driver_note: '',
  driver_rating: '',
  driver_rejections: [],
  driver_tracking: '',
  encoded_route: '',
  externalRef: '',
  group: {
    uuid: '85627703-784a-0ed5-a32e-3ebf2558d5c8',
    name: 'TOTAL Navettes',
    contract: {
      uuid: '[scom->null]',
      name: '[scom->null]',
      plan: {
        type: 'CORPORATE',
      },
    },
    isPro: true,
  },
  is_asap: false,
  is_assistance: false,
  is_free_ride: false,
  nameboard_option: false,
  number: 'A29449',
  operator_logs: [],
  partner: '',
  payment_method: {
    payment_mode: 'monthly',
  },
  payment_policy: '',
  planned_start_date: 1694674800,
  price_details: {
    client_final_price: 0,
    client_pre_tax_price: '',
    base_price: 56.83,
    surge: 1,
    pricing_request_id: '150cebe4-3915-447e-bb89-76fc18ae2cbd',
    pricing_response_id: '',
    core_price_confirmation_id: 1795292,
    currency: '€',
  },
  provision: 0,
  ride_accepted_date: '',
  ride_ended_date: '',
  ride_reason: '',
  riders: [
    {
      id: '0d8f5a67-6869-400d-901b-2b5b420b0491',
      firstname: 'API',
      lastname: 'LeCab',
    },
  ],
  route: '',
  service: {
    book_for_later_allowed: true,
    selectable_by_rider: true,
    carry_settings: {
      max_passenger: 6,
      max_small_luggage: 4,
      max_large_luggage: 6,
    },
    description: 'Van',
    display: {
      display_name: '',
      display_order: 5,
      disabled: false,
    },
    type: 'PAX',
    id: 'van',
    name: 'Van',
    uuid: '0404dada-e4d9-4b10-90ab-63e9739ad6a5',
  },
  start_date: 1694674800,
  status: 'CANCELLATION_NO_CHARGE',
  stops: [
    {
      address: {
        type: 'ADDRESS',
        location: {
          lat: 48.82293,
          lng: 2.32431,
        },
        details: {
          street: "Porte d'Orléans, 3 Rue Edmond Rousse, 75014, Paris, France",
          street_number: '',
          city: '',
          country: '',
          zip_code: '',
          full_name:
            "Porte d'Orléans, 3 Rue Edmond Rousse, 75014, Paris, France",
        },
      },
      stop_type: 'PICKUP',
      stop_order: 1,
    },
    {
      address: {
        type: 'ADDRESS',
        location: {
          lat: 48.712910726259,
          lng: 2.1947622749295,
        },
        details: {
          street:
            'IPHE Playground, Boulevard Thomas Gobert, 91120, Palaiseau, France',
          street_number: '',
          city: '',
          country: '',
          zip_code: '',
          full_name:
            'IPHE Playground, Boulevard Thomas Gobert, 91120, Palaiseau, France',
        },
      },
      stop_type: 'DROP_OFF',
      stop_order: 2,
    },
  ],
  subcontract: '',
  updated_at: 1721034861,
  vehicle: '',
};

export type RideData = typeof ride;
