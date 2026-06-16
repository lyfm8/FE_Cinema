import DataTable from "@/components/shared/DataTable";
import Button from "@/components/ui/Button";
import useLanguage from "@/features/i18n/hooks/useLanguage";
import {
  formatTime,
  formatDateTime,
  getMovieFormatLabel,
} from "@/features/admin/showtimes/utils/showtimeUtils";

const STATUS_TONE_MAP = {
  SCHEDULED: "border-gold bg-gold/20 text-charcoal",
  ACTIVE: "border-success-green bg-success-green/10 text-success-green",
  COMPLETED: "border-ash bg-cream text-stone",
  CANCELLED: "border-rose bg-rose/10 text-rose",
};

const STATUS_LABEL = {
  SCHEDULED: { en: "Scheduled", vi: "Đã lên lịch" },
  ACTIVE: { en: "Active", vi: "Đang chiếu" },
  COMPLETED: { en: "Completed", vi: "Hoàn tất" },
  CANCELLED: { en: "Cancelled", vi: "Đã hủy" },
};

/**
 * @param {{
 *  showtimes: Array<any>,
 *  deletingId?: number | null,
 *  onEdit: (showtime: any) => void,
 *  onDelete: (showtime: any) => void
 * }} props
 */
function ShowtimeTable({ showtimes, deletingId = null, onEdit, onDelete }) {
  const { tx } = useLanguage();

  const columns = [
    { key: "id", label: tx("ID", "Mã") },
    { key: "movieTitle", label: tx("Movie", "Phim") },
    { key: "cinemaName", label: tx("Cinema", "Rạp") },
    { key: "roomName", label: tx("Room", "Phòng") },
    { key: "publicStart", label: tx("Start Time", "Giờ bắt đầu") },
    { key: "movieEnd", label: tx("Movie End", "Kết thúc phim") },
    { key: "roomRelease", label: tx("Room Release", "Trả phòng") },
    { key: "format", label: tx("Format", "Định dạng") },
    { key: "status", label: tx("Status", "Trạng thái") },
    { key: "actions", label: tx("Actions", "Hành động") },
  ];

  const rows = showtimes.map((st) => ({
    id: st.id,
    movieTitle: (
      <span className="movie-title text-sm">{st.movieTitle || "-"}</span>
    ),
    cinemaName: st.cinemaName || "-",
    roomName: st.roomName || "-",
    publicStart: formatDateTime(st.publicStartTime),
    movieEnd: formatTime(st.movieEndTime),
    roomRelease: formatTime(st.roomReleaseTime),
    format: (
      <span className="rounded-full border-base bg-cream px-2.5 py-0.5 text-xs font-medium text-charcoal">
        {getMovieFormatLabel(st.format)}
      </span>
    ),
    status: (
      <span
        className={`inline-flex rounded-full border-base px-2.5 py-1 text-xs font-medium ${
          STATUS_TONE_MAP[st.status] ?? STATUS_TONE_MAP.SCHEDULED
        }`}
      >
        {tx(
          STATUS_LABEL[st.status]?.en ?? st.status,
          STATUS_LABEL[st.status]?.vi ?? st.status,
        )}
      </span>
    ),
    actions: (
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          className="px-2.5 py-1 text-xs"
          onClick={() => onEdit(st)}
        >
          {tx("Edit", "Sửa")}
        </Button>
        <Button
          variant="ghost"
          className="border-rose px-2.5 py-1 text-xs text-rose hover:bg-rose/10"
          onClick={() => onDelete(st)}
          disabled={deletingId === st.id}
        >
          {deletingId === st.id
            ? tx("Deleting...", "Đang xóa...")
            : tx("Delete", "Xóa")}
        </Button>
      </div>
    ),
  }));

  return <DataTable columns={columns} rows={rows} />;
}

export default ShowtimeTable;
