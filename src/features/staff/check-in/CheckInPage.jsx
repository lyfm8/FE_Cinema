import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toast from "@/components/ui/Toast";
import useLanguage from "@/features/i18n/hooks/useLanguage";
import useTicketCheckIn from "@/features/staff/check-in/hooks/useTicketCheckIn";
import QrScanner from "@/features/staff/check-in/components/QrScanner";

function formatDateTime(value, locale) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function TicketInfoItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 py-3 last:border-b-0 sm:flex-row sm:justify-between">
      <span className="text-sm text-stone">{label}</span>
      <span className="text-sm font-semibold text-ink sm:text-right">
        {value || "-"}
      </span>
    </div>
  );
}

function CheckInPage() {
  const { tx, isVietnamese } = useLanguage();
  const locale = isVietnamese ? "vi-VN" : "en-US";

  const {
    qrCode,
    ticket,
    submitting,
    error,
    toast,
    handleQrCodeChange,
    handleScannedCode,
    handleCheckIn,
  } = useTicketCheckIn(tx);

  const fallbackSeat = ticket
    ? [ticket.seat?.row, ticket.seat?.number]
        .filter((value) => value !== undefined && value !== null)
        .join("")
    : "";

  const seatName = ticket?.seat?.label || fallbackSeat || "-";

  return (
    <div className="page-container space-y-6">
      <header className="space-y-2">
        <p className="section-label">
          {tx("Staff operations", "Nghiệp vụ nhân viên")}
        </p>
        <h1 className="text-2xl font-bold text-ink">
          {tx("Ticket check-in", "Soát vé")}
        </h1>
        <p className="max-w-2xl text-sm text-stone">
          {tx(
            "Enter a QR code manually or scan it using the camera.",
            "Nhập mã QR thủ công hoặc quét bằng camera.",
          )}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-6 p-5">
          <form onSubmit={handleCheckIn} className="space-y-3">
            <fieldset disabled={submitting} className="space-y-3">
              <Input
                id="ticket-qr-code"
                name="qrCode"
                label={tx("QR code", "Mã QR")}
                value={qrCode}
                placeholder="TKT-..."
                error={error}
                onChange={handleQrCodeChange}
              />

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting
                  ? tx("Checking in...", "Đang soát vé...")
                  : tx("Confirm check-in", "Xác nhận soát vé")}
              </Button>
            </fieldset>
          </form>

          <div className="border-t border-gray-100 pt-5">
            <p className="section-label mb-3">
              {tx("Camera scanner", "Quét bằng camera")}
            </p>

            <QrScanner onScan={handleScannedCode} disabled={submitting} />
          </div>
        </section>

        <section className="surface-card p-5">
          <p className="section-label mb-3">
            {tx("Ticket information", "Thông tin vé")}
          </p>

          {ticket ? (
            <div>
              <div className="mb-4 rounded-xl border border-success-green/30 bg-success-green/10 p-4">
                <p className="font-bold text-success-green">
                  {tx("Ticket checked in successfully", "Soát vé thành công")}
                </p>
                <p className="mt-1 text-sm text-stone">{ticket.qrCode}</p>
              </div>

              <TicketInfoItem
                label={tx("Movie", "Phim")}
                value={ticket.showtime?.movie?.title}
              />
              <TicketInfoItem
                label={tx("Cinema", "Rạp")}
                value={ticket.showtime?.room?.cinema?.name}
              />
              <TicketInfoItem
                label={tx("Room", "Phòng")}
                value={ticket.showtime?.room?.name}
              />
              <TicketInfoItem label={tx("Seat", "Ghế")} value={seatName} />
              <TicketInfoItem
                label={tx("Showtime", "Giờ chiếu")}
                value={formatDateTime(ticket.showtime?.publicStartTime, locale)}
              />
              <TicketInfoItem
                label={tx("Check-in time", "Thời gian check-in")}
                value={formatDateTime(ticket.checkedInAt, locale)}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-cream px-5 py-12 text-center">
              <p className="text-sm font-medium text-ink">
                {tx("No ticket checked in yet.", "Chưa có vé được soát.")}
              </p>
              <p className="mt-1 text-xs text-stone">
                {tx(
                  "Ticket information will appear here after a successful check-in.",
                  "Thông tin vé sẽ hiển thị tại đây sau khi soát thành công.",
                )}
              </p>
            </div>
          )}
        </section>
      </div>

      <Toast
        visible={toast.visible}
        message={toast.message}
        tone={toast.tone}
      />
    </div>
  );
}

export default CheckInPage;
