import {
  buildTimelineHourMarks,
  getMovieFormatLabel,
  SHOWTIME_STATUS,
} from "@/features/admin/showtimes/utils/showtimeAdapter";

const STATUS_TONE_MAP = {
  [SHOWTIME_STATUS.SCHEDULED]: "border-gold bg-gold/20 text-charcoal",
  [SHOWTIME_STATUS.ACTIVE]:
    "border-success-green bg-success-green/10 text-success-green",
  [SHOWTIME_STATUS.COMPLETED]: "border-ash bg-cream text-stone",
  [SHOWTIME_STATUS.CANCELLED]: "border-rose bg-rose/10 text-rose",
};

function toHourLabel(hour) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function getHourLeftPercent(hour, startHour, endHour) {
  const total = endHour - startHour;
  if (total <= 0) return 0;
  return ((hour - startHour) / total) * 100;
}

function ShowtimeTimeline({
  tx,
  selectedDate,
  selectedCinemaId,
  selectedRoomId,
  cinemaOptions,
  roomOptions,
  roomsLoading,
  timelineRows,
  startHour,
  endHour,
  onChangeDate,
  onChangeCinema,
  onChangeRoom,
}) {
  const hourMarks = buildTimelineHourMarks(startHour, endHour);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-stone">{tx("Date", "Ngày")}</span>
          <input
            type="date"
            value={selectedDate}
            onChange={onChangeDate}
            className="rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal focus:border-ink focus:outline-none"
          />
        </label>

        <label className="flex min-w-[220px] flex-col gap-1">
          <span className="text-xs text-stone">{tx("Cinema", "Rạp")}</span>
          <select
            value={selectedCinemaId}
            onChange={onChangeCinema}
            className="rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal focus:border-ink focus:outline-none"
          >
            <option value="">
              {tx("-- Select cinema --", "-- Chọn rạp --")}
            </option>
            {cinemaOptions.map((cinema) => (
              <option key={cinema.id} value={cinema.id}>
                {cinema.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-[220px] flex-col gap-1">
          <span className="text-xs text-stone">{tx("Room", "Phòng")}</span>
          <select
            value={selectedRoomId}
            onChange={onChangeRoom}
            disabled={!selectedCinemaId || roomsLoading}
            className="rounded-md border-base bg-paper px-3 py-2 text-sm text-charcoal focus:border-ink focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">{tx("All rooms", "Tất cả phòng")}</option>
            {roomOptions.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!selectedCinemaId ? (
        <p className="text-sm text-stone">
          {tx(
            "Please select a cinema to view room timeline.",
            "Vui lòng chọn rạp để xem timeline theo phòng.",
          )}
        </p>
      ) : null}

      {selectedCinemaId && roomsLoading ? (
        <p className="text-sm text-stone">
          {tx("Loading rooms...", "Đang tải phòng...")}
        </p>
      ) : null}

      {selectedCinemaId && !roomsLoading && timelineRows.length === 0 ? (
        <p className="text-sm text-stone">
          {tx(
            "No timeline data for this date.",
            "Không có dữ liệu timeline cho ngày này.",
          )}
        </p>
      ) : null}

      {selectedCinemaId && !roomsLoading && timelineRows.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="min-w-[980px] space-y-3">
            <div className="grid grid-cols-[190px_1fr] items-center gap-3">
              <p className="text-xs uppercase tracking-widest text-stone">
                {tx("Room", "Phòng")}
              </p>
              <div className="relative h-7 rounded-md border-base bg-paper">
                {hourMarks.map((hour) => (
                  <span
                    key={`head-${hour}`}
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-stone"
                    style={{
                      left: `${getHourLeftPercent(hour, startHour, endHour)}%`,
                    }}
                  >
                    {toHourLabel(hour)}
                  </span>
                ))}
              </div>
            </div>

            {timelineRows.map((row) => (
              <div
                key={row.roomId}
                className="grid grid-cols-[190px_1fr] gap-3"
              >
                <div className="rounded-md border-base bg-paper px-3 py-2">
                  <p className="text-sm font-medium text-ink">{row.roomName}</p>
                  <p className="text-xs text-stone">
                    {tx("Showtimes", "Suất chiếu")}: {row.blocks.length}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="relative h-16 rounded-md border-base bg-paper/70">
                    {hourMarks.map((hour) => (
                      <span
                        key={`line-${row.roomId}-${hour}`}
                        className="absolute top-0 bottom-0 w-px bg-stone/20"
                        style={{
                          left: `${getHourLeftPercent(hour, startHour, endHour)}%`,
                        }}
                      />
                    ))}

                    {row.blocks.map((block) => (
                      <div
                        key={block.id}
                        className={`absolute top-2 h-12 overflow-hidden rounded-md border px-2 py-1 text-[11px] ${STATUS_TONE_MAP[block.status] ?? STATUS_TONE_MAP[SHOWTIME_STATUS.SCHEDULED]}`}
                        style={{
                          left: `${block.leftPct}%`,
                          width: `${block.widthPct}%`,
                        }}
                        title={`${block.movieTitle} (${block.startText} - ${block.endText})`}
                      >
                        <p className="truncate font-semibold">
                          {block.movieTitle}
                        </p>
                        <p className="truncate">
                          {block.startText} - {block.endText}
                        </p>
                        <p className="truncate">
                          {getMovieFormatLabel(block.format)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-stone">
                    {tx("Free slots", "Khoảng trống")}:{" "}
                    {row.freeSlots.length === 0
                      ? tx("No free slot", "Không còn khoảng trống")
                      : row.freeSlots
                          .map((slot) => `${slot.startText} - ${slot.endText}`)
                          .join(" | ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ShowtimeTimeline;
