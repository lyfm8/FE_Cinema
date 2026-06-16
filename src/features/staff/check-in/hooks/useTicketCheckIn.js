import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "@/core/utils/errorUtils";
import { ticketCheckInService } from "@/features/staff/check-in/services/ticketCheckInService";

function useTicketCheckIn(tx) {
  const [qrCode, setQrCode] = useState("");
  const [ticket, setTicket] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    tone: "info",
  });

  const submittingRef = useRef(false);

  const showToast = useCallback((message, tone = "info") => {
    setToast({ visible: true, message, tone });
  }, []);

  useEffect(() => {
    if (!toast.visible) return undefined;

    const timeoutId = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [toast.visible]);

  const handleQrCodeChange = useCallback((event) => {
    setQrCode(event.target.value);
    setError("");
  }, []);

  const handleScannedCode = useCallback((decodedText) => {
    if (submittingRef.current) return;

    setQrCode(String(decodedText || "").trim());
    setError("");
  }, []);

  const handleCheckIn = async (event) => {
    event.preventDefault();

    const normalizedQrCode = qrCode.trim();

    if (!normalizedQrCode) {
      const message = tx(
        "Please enter or scan a QR code.",
        "Vui lòng nhập hoặc quét mã QR.",
      );
      setError(message);
      showToast(message, "error");
      return;
    }

    if (submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setError("");
    setTicket(null);

    try {
      const response =
        await ticketCheckInService.checkInByQrCode(normalizedQrCode);

      setTicket(response.data ?? null);
      setQrCode(normalizedQrCode);
      showToast(
        response.message || tx("Check-in successful.", "Soát vé thành công."),
        "success",
      );
    } catch (requestError) {
      const message = getErrorMessage(
        requestError,
        tx("Unable to check in ticket.", "Không thể soát vé."),
      );

      setError(message);
      showToast(message, "error");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return {
    qrCode,
    ticket,
    submitting,
    error,
    toast,
    handleQrCodeChange,
    handleScannedCode,
    handleCheckIn,
  };
}

export default useTicketCheckIn;
