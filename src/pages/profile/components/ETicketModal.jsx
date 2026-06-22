import Modal from '@/components/ui/Modal/Modal';
import Button from '@/components/ui/Button';
import useLanguage from '@/features/i18n/hooks/useLanguage';
import { getConcessions } from '@/features/booking/services/bookingService';
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

function formatCurrency(amount) {
  if (typeof amount !== 'number') return amount;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

function ETicketModal({ isOpen, booking, onClose }) {
  const { tx } = useLanguage();
  const [concessions, setConcessions] = useState([]);

  useEffect(() => {
    if (isOpen) {
      getConcessions()
        .then((res) => setConcessions(res?.data || []))
        .catch((err) => console.error("Failed to load concessions:", err));
    }
  }, [isOpen]);

  if (!isOpen || !booking) {
    return null;
  }

  const {
    bookingCode,
    totalAmount,
    showtime,
    tickets = [],
    bookingConcessions = [],
    seatHolds = [], // Backend might return seatHolds instead of tickets depending on relation structure
  } = booking;

  const movie = showtime?.movie;
  const room = showtime?.room;
  const startTime = showtime?.publicStartTime ? new Date(showtime.publicStartTime) : null;

  // Xử lý ds ghế
  let seatLabels = [];
  if (tickets && tickets.length > 0) {
    seatLabels = tickets.map(t => t.seat?.label || `${t.seat?.row}${t.seat?.column}`);
  } else if (seatHolds && seatHolds.length > 0) {
    seatLabels = seatHolds.map(h => h.seat?.label || `${h.seat?.row}${h.seat?.column}`);
  }
  const seatsString = seatLabels.filter(Boolean).join(', ') || 'N/A';

  const qrTickets = tickets.filter((ticket) => ticket.qrCode);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tx('E-Ticket', 'Vé điện tử')}
      maxWidthClass="max-w-md"
    >
      <div className="flex flex-col items-center space-y-6 pb-2">
        {/* QR Code Section */}
        <div className="w-full rounded-xl bg-white p-4 shadow-sm border border-base">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-ink/50">
            {tx('Ticket QR codes', 'Mã QR từng vé')}
          </p>

          {qrTickets.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {qrTickets.map((ticket) => {
                const seatLabel = ticket.seat?.label || `${ticket.seat?.row || ''}${ticket.seat?.number || ticket.seat?.column || ''}`;

                return (
                  <div key={ticket.id} className="flex flex-col items-center rounded-lg border border-base bg-cream/40 p-3">
                    <p className="mb-2 text-xs font-semibold text-ink">
                      {tx('Seat', 'Ghế')} {seatLabel || `#${ticket.seatId}`}
                    </p>
                    <QRCodeSVG
                      value={ticket.qrCode}
                      size={150}
                      level="M"
                      className="rounded bg-white p-2"
                    />
                    <p className="mt-2 break-all font-mono text-[10px] text-stone">
                      {ticket.qrCode}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-base bg-cream px-3 py-4 text-center text-sm text-stone">
              {tx(
                'QR codes are available after payment is confirmed.',
                'Mã QR chỉ có sau khi thanh toán thành công.',
              )}
            </div>
          )}

          <p className="mt-3 text-center text-xs text-stone">
            {tx('Booking code', 'Mã đặt vé')}: {bookingCode}
          </p>
        </div>

        {/* Ticket Details */}
        <div className="w-full space-y-4 rounded-xl bg-cream p-5 text-sm text-ink/80">
          <div>
            <p className="text-xs font-semibold uppercase text-ink/50">{tx('Movie', 'Phim')}</p>
            <p className="text-base font-medium text-ink">{movie?.title || 'Unknown Movie'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-ink/50">{tx('Date', 'Ngày chiếu')}</p>
              <p className="font-medium text-ink">
                {startTime ? startTime.toLocaleDateString('vi-VN') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-ink/50">{tx('Time', 'Giờ chiếu')}</p>
              <p className="font-medium text-ink">
                {startTime ? startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-ink/50">{tx('Room', 'Phòng chiếu')}</p>
              <p className="font-medium text-ink">{room?.name || 'N/A'} - {showtime?.format || '2D'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-ink/50">{tx('Seats', 'Ghế')}</p>
              <p className="font-medium text-ink break-words">{seatsString}</p>
            </div>
          </div>

          {bookingConcessions && bookingConcessions.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase text-ink/50">{tx('Concessions', 'Bắp nước')}</p>
              <ul className="mt-1 space-y-1">
                {bookingConcessions.map((bc, idx) => {
                  const id = bc.productId || bc.concessionId;
                  const found = concessions.find((c) => c.id === id);
                  const name = bc.product?.name || bc.concession?.name || found?.name || `Combo #${id}`;
                  return (
                    <li key={idx} className="flex justify-between font-medium text-ink">
                      <span>{name} x{bc.quantity}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mt-4 border-t border-base/50 pt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold uppercase text-ink/50">{tx('Total', 'Tổng cộng')}</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="w-full">
          <Button className="w-full" onClick={onClose}>
            {tx('Done', 'Xong')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ETicketModal;
