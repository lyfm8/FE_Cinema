import { apiClient } from "@/core/api/apiClient";

export const ticketCheckInService = {
  checkInByQrCode(qrCode) {
    const normalizedQrCode = qrCode.trim();

    return apiClient.post(
      `/tickets/${encodeURIComponent(normalizedQrCode)}/checkin`,
      {},
    );
  },
};
