import { Fragment, useMemo } from "react";

const ROOM_THEMES = {
  standard: {
    caption: "STANDARD HALL",
    wrapperClass:
      "bg-[linear-gradient(180deg,#ffffff,#f8fafc)] ring-1 ring-slate-200/70",
    screenArcClass: "bg-fuchsia-500",
    screenGlowClass: "shadow-[0_8px_18px_rgba(217,70,239,0.22)]",
    seatSizeClass: "h-8 w-8 rounded-[4px]",
    rowGapClass: "gap-2",
    aislesAfter: [5],
    aisleClass: "mx-1 block h-8 w-3 rounded bg-slate-100",
    zoneClassByRow: {
      rear: "bg-violet-100 border-violet-200 text-violet-700",
      middle: "bg-rose-100 border-rose-200 text-rose-700",
      front: "bg-pink-100 border-pink-200 text-pink-700",
    },
  },
  vip: {
    caption: "VIP LOUNGE",
    wrapperClass:
      "bg-[linear-gradient(180deg,#fffdf7,#fff8e8)] ring-1 ring-amber-200/75",
    screenArcClass: "bg-amber-500",
    screenGlowClass: "shadow-[0_8px_18px_rgba(245,158,11,0.26)]",
    seatSizeClass: "h-10 w-10 rounded-lg",
    rowGapClass: "gap-2.5",
    aislesAfter: [5],
    aisleClass: "mx-1.5 block h-10 w-3 rounded-md bg-amber-100",
    zoneClassByRow: {
      rear: "bg-amber-100 border-amber-200 text-amber-800",
      middle: "bg-orange-100 border-orange-200 text-orange-800",
      front: "bg-rose-100 border-rose-200 text-rose-700",
    },
  },
  imax: {
    caption: "IMAX",
    wrapperClass:
      "bg-[linear-gradient(180deg,#eff6ff,#f8fbff)] ring-1 ring-sky-200/80",
    screenArcClass: "bg-sky-500",
    screenGlowClass: "shadow-[0_8px_18px_rgba(14,165,233,0.24)]",
    seatSizeClass: "h-7 w-7 rounded-[4px]",
    rowGapClass: "gap-1.5",
    aislesAfter: [6],
    aisleClass: "mx-1 block h-7 w-2.5 rounded bg-sky-100",
    zoneClassByRow: {
      rear: "bg-sky-100 border-sky-200 text-sky-700",
      middle: "bg-blue-100 border-blue-200 text-blue-700",
      front: "bg-indigo-100 border-indigo-200 text-indigo-700",
    },
  },
  couple: {
    caption: "COUPLE HALL",
    wrapperClass:
      "bg-[linear-gradient(180deg,#fff1f6,#fff8fb)] ring-1 ring-rose-200/80",
    screenArcClass: "bg-rose-500",
    screenGlowClass: "shadow-[0_8px_18px_rgba(244,63,94,0.24)]",
    seatSizeClass: "h-12 w-[5.4rem] rounded-xl",
    rowGapClass: "gap-2.5",
    aislesAfter: [5],
    aisleClass: "mx-2 block h-12 w-3 rounded-md bg-rose-100",
    zoneClassByRow: {
      rear: "bg-rose-100 border-rose-200 text-rose-700",
      middle: "bg-pink-100 border-pink-200 text-pink-700",
      front: "bg-fuchsia-100 border-fuchsia-200 text-fuchsia-700",
    },
  },
};

const BOOKED_CLASS =
  "bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed shadow-none";
const SELECTED_CLASS =
  "bg-orange-500 border-orange-600 text-white ring-2 ring-orange-200 shadow-[0_3px_0_rgba(194,65,12,0.35)]";

function normalizeRoomType(value) {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized.includes("vip")) return "vip";
  if (normalized.includes("imax")) return "imax";
  if (normalized.includes("couple")) return "couple";
  return "standard";
}

function getImaxRowStyle(rowIndex, totalRows) {
  // Apply slight curvature only for non-2D IMAX formats.
  const middle = (totalRows - 1) / 2;
  const distance = Math.abs(rowIndex - middle);
  const scaleX = Math.max(0.9, 1 - distance * 0.02);
  const translateY = distance * 0.6;

  return {
    transform: `translateY(${translateY.toFixed(1)}px) scaleX(${scaleX.toFixed(3)})`,
    transformOrigin: "center",
  };
}

function getRowZone(rowIndex, totalRows) {
  if (totalRows <= 1) return "middle";
  const ratio = rowIndex / (totalRows - 1);
  if (ratio <= 0.33) return "rear";
  if (ratio <= 0.72) return "middle";
  return "front";
}

function getSeatLabel(normalizedType, seat) {
  if (normalizedType === "couple") return `${seat.row}${seat.column}`;
  return `${seat.row}${seat.column}`;
}

function renderSeatContent(normalizedType, seat, visualStatus) {
  if (visualStatus === "booked") {
    return <span className="pointer-events-none text-[11px] font-black">x</span>;
  }

  if (normalizedType === "couple") {
    return (
      <div className="pointer-events-none flex w-full items-center justify-between px-2">
        <span className="text-[9px] font-bold">2P</span>
        <span className="text-[11px] font-bold leading-none">{"\u2665"}</span>
        <span className="text-[10px] font-semibold">{getSeatLabel(normalizedType, seat)}</span>
      </div>
    );
  }

  return (
    <span
      className={
        normalizedType === "imax"
          ? "pointer-events-none text-[7px] font-semibold"
          : "pointer-events-none text-[8px] font-semibold"
      }
    >
      {getSeatLabel(normalizedType, seat)}
    </span>
  );
}

function getAvailableClass(normalizedType, theme, rowIndex, totalRows) {
  const zone = getRowZone(rowIndex, totalRows);
  const zoneClass =
    theme.zoneClassByRow[zone] || theme.zoneClassByRow.middle;
  const hoverClass =
    normalizedType === "vip"
      ? "hover:bg-amber-200"
      : normalizedType === "imax"
        ? "hover:bg-sky-200"
        : normalizedType === "couple"
          ? "hover:bg-rose-200"
          : "hover:bg-violet-200";

  return `${zoneClass} ${hoverClass} cursor-pointer shadow-[0_2px_0_rgba(148,163,184,0.2)]`;
}

/**
 * @param {{
 *   roomType: string,
 *   rows: number,
 *   columns: number,
 *   format?: string,
 *   seats: Array<{ seatId: string, row: string, column: number, status: 'available' | 'booked' | 'selected', isCouple?: boolean }>,
 *   selectedSeatIds: string[],
 *   onToggleSeat: (seat: any) => void,
 * }} props
 */
function SeatMap({
  roomType,
  rows,
  columns,
  format,
  seats,
  selectedSeatIds,
  onToggleSeat,
}) {
  const normalizedType = normalizeRoomType(roomType);
  const normalizedFormat = String(format ?? "").toUpperCase();
  const enableCurvedRows =
    normalizedType === "imax" && !normalizedFormat.includes("2D");
  const theme = ROOM_THEMES[normalizedType] || ROOM_THEMES.standard;
  const normalizedSeats = useMemo(
    () => (Array.isArray(seats) ? seats : []),
    [seats],
  );
  const derivedRows = new Set(normalizedSeats.map((seat) => seat.row).filter(Boolean)).size;
  const derivedColumns = Math.max(
    ...normalizedSeats.map((seat) => Number(seat.column) || 0),
    0,
  );

  const safeRows = Number(rows) > 0 ? Number(rows) : derivedRows;
  const safeColumns = Number(columns) > 0 ? Number(columns) : derivedColumns;

  const rowLabels = useMemo(
    () =>
      Array.from({ length: safeRows }, (_, index) =>
        String.fromCharCode(65 + index),
      ),
    [safeRows],
  );

  const columnNumbers = useMemo(
    () => Array.from({ length: safeColumns }, (_, index) => index + 1),
    [safeColumns],
  );

  const seatLookup = useMemo(() => {
    const map = new Map();
    normalizedSeats.forEach((seat) => {
      map.set(`${seat.row}-${seat.column}`, seat);
    });
    return map;
  }, [normalizedSeats]);

  const selectedSeatSet = useMemo(
    () => new Set((selectedSeatIds || []).map((seatId) => String(seatId))),
    [selectedSeatIds],
  );

  const stats = useMemo(() => {
    let available = 0;
    let selected = 0;
    let booked = 0;

    rowLabels.forEach((rowLabel) => {
      columnNumbers.forEach((column) => {
        const seatKey = `${rowLabel}-${column}`;
        const seat = seatLookup.get(seatKey) || { seatId: seatKey, status: "booked" };
        const isSelected = selectedSeatSet.has(String(seat.seatId));
        const visualStatus = isSelected ? "selected" : seat.status;

        if (visualStatus === "booked") booked += 1;
        else if (visualStatus === "selected") selected += 1;
        else available += 1;
      });
    });

    return { available, selected, booked };
  }, [columnNumbers, rowLabels, seatLookup, selectedSeatSet]);

  return (
    <div className={`rounded-2xl p-4 sm:p-5 md:p-6 ${theme.wrapperClass}`}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-500">
          {theme.caption}
        </p>
        <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-600">
          <span className="rounded-full bg-white px-2 py-1 shadow-sm">
            {safeRows} x {safeColumns}
          </span>
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">
            Free {stats.available}
          </span>
          <span className="rounded-full bg-orange-100 px-2 py-1 text-orange-700">
            Picked {stats.selected}
          </span>
          <span className="rounded-full bg-slate-200 px-2 py-1 text-slate-700">
            Booked {stats.booked}
          </span>
        </div>
      </div>

      {safeRows === 0 || safeColumns === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white/80 p-8 text-center text-sm font-medium text-slate-500">
          Seat map data is unavailable.
        </div>
      ) : null}

      <div className="mx-auto mb-16 w-full max-w-[760px] md:mb-20">
        <div className={`h-2 rounded-t-[999px] ${theme.screenArcClass} ${theme.screenGlowClass}`} />
        <div className="h-2 rounded-b-[999px] bg-white/85" />
        <p className="mt-2 text-center text-base tracking-[0.45em] text-slate-500">MÀN HÌNH</p>
      </div>

      {safeRows > 0 && safeColumns > 0 ? <div className="overflow-x-auto">
        <div className="mx-auto w-max min-w-full space-y-2">
          {rowLabels.map((rowLabel, rowIndex) => {
            const rowStyle = enableCurvedRows
              ? getImaxRowStyle(rowIndex, rowLabels.length)
              : undefined;

            return (
              <div key={rowLabel} className="flex items-center justify-center gap-2" style={rowStyle}>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-bold text-slate-600 shadow-sm">
                  {rowLabel}
                </span>

                <div className={`flex items-center ${theme.rowGapClass}`}>
                  {columnNumbers.map((column) => {
                    const seatKey = `${rowLabel}-${column}`;
                    const seat = seatLookup.get(seatKey) || {
                      seatId: seatKey,
                      row: rowLabel,
                      column,
                      status: "booked",
                      isCouple: normalizedType === "couple",
                    };

                    const isSelected = selectedSeatSet.has(String(seat.seatId));
                    const visualStatus = isSelected ? "selected" : seat.status;
                    const isBooked = visualStatus === "booked";
                    const showAisleBefore =
                      Array.isArray(theme.aislesAfter) &&
                      theme.aislesAfter.includes(column - 1);

                    const statusClass =
                      visualStatus === "booked"
                        ? BOOKED_CLASS
                        : visualStatus === "selected"
                          ? SELECTED_CLASS
                          : getAvailableClass(
                              normalizedType,
                              theme,
                              rowIndex,
                              rowLabels.length,
                            );

                    return (
                      <Fragment key={seatKey}>
                        {showAisleBefore ? <span className={theme.aisleClass} /> : null}
                        <button
                          type="button"
                          disabled={isBooked}
                          aria-pressed={isSelected}
                          onClick={() => onToggleSeat?.(seat)}
                          className={`relative flex shrink-0 items-center justify-center border transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-galaxyBlue/40 ${theme.seatSizeClass} ${statusClass}`}
                          title={`${seat.row}${seat.column}`}
                        >
                          {renderSeatContent(normalizedType, seat, visualStatus)}
                        </button>
                      </Fragment>
                    );
                  })}
                </div>

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-bold text-slate-600 shadow-sm">
                  {rowLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div> : null}
    </div>
  );
}

export default SeatMap;
