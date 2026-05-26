import { apiClient } from '@/core/api/apiClient';

/**
 * Repository handling Ticket Price configuration API calls.
 */
export class TicketPriceApiRepository {
  getTicketPrices() {
    return apiClient.get('/tickets/prices');
  }

  /** @param {{ prices: Array<{ roomType: string, dayType: string, price: number }> }} payload */
  bulkUpsertPrices(payload) {
    return apiClient.post('/tickets/prices/bulk', payload);
  }
}

