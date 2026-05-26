import { TicketPriceApiRepository } from '../repositories/ticketPriceApi.repository';

/**
 * Ticket price service — business logic layer (admin).
 */
export class TicketPriceService {
  /** @param {InstanceType<typeof TicketPriceApiRepository>} [ticketPriceRepository] */
  constructor(ticketPriceRepository) {
    this.ticketPriceRepository = ticketPriceRepository || new TicketPriceApiRepository();
  }

  getTicketPrices() {
    return this.ticketPriceRepository.getTicketPrices();
  }

  bulkUpsertPrices(payload) {
    return this.ticketPriceRepository.bulkUpsertPrices(payload);
  }
}

export const ticketPriceService = new TicketPriceService();

