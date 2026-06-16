import { useEffect, useRef, useState } from "react";
import {
  Html5Qrcode,
  Html5QrcodeScannerState,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import Button from "@/components/ui/Button";
import useLanguage from "@/features/i18n/hooks/useLanguage";

const READER_ID = "ticket-check-in-qr-reader";

function QrScanner({ onScan, disabled = false }) {
  const { tx } = useLanguage();
  const scannerRef = useRef(null);
  const handledRef = useRef(false);
  const mountedRef = useRef(true);

  const [mode, setMode] = useState("idle");
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    return () => {
      mountedRef.current = false;

      const scanner = scannerRef.current;
      scannerRef.current = null;

      if (!scanner) return;

      try {
        const state = scanner.getState();

        if (
          state === Html5QrcodeScannerState.SCANNING ||
          state === Html5QrcodeScannerState.PAUSED
        ) {
          void scanner
            .stop()
            .then(() => scanner.clear())
            .catch(() => undefined);
        } else {
          scanner.clear();
        }
      } catch {
        // Camera cleanup should not block unmount.
      }
    };
  }, []);

  async function releaseScanner() {
    const scanner = scannerRef.current;
    scannerRef.current = null;

    if (!scanner) {
      if (mountedRef.current) setMode("idle");
      return;
    }

    try {
      const state = scanner.getState();

      if (
        state === Html5QrcodeScannerState.SCANNING ||
        state === Html5QrcodeScannerState.PAUSED
      ) {
        await scanner.stop();
      }

      scanner.clear();
    } catch {
      if (mountedRef.current) {
        setCameraError(
          tx(
            "Unable to stop the camera cleanly.",
            "Không thể dừng camera hoàn toàn.",
          ),
        );
      }
    } finally {
      handledRef.current = false;
      if (mountedRef.current) setMode("idle");
    }
  }

  async function startScanner() {
    if (disabled || scannerRef.current || mode !== "idle") return;

    setCameraError("");
    setMode("starting");
    handledRef.current = false;

    const scanner = new Html5Qrcode(READER_ID, {
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      verbose: false,
    });

    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
        },
        (decodedText) => {
          if (handledRef.current) return;

          handledRef.current = true;
          onScan(decodedText);
          void releaseScanner();
        },
        () => undefined,
      );

      if (!mountedRef.current || scannerRef.current !== scanner) {
        await scanner.stop();
        scanner.clear();
        return;
      }

      setMode("scanning");
    } catch {
      if (scannerRef.current === scanner) {
        scannerRef.current = null;
      }

      try {
        scanner.clear();
      } catch {
        // Scanner may already have cleared itself.
      }

      if (mountedRef.current) {
        setMode("idle");
        setCameraError(
          tx(
            "Camera is unavailable or permission was denied. You can still enter the code manually.",
            "Camera không khả dụng hoặc quyền truy cập bị từ chối. Bạn vẫn có thể nhập mã thủ công.",
          ),
        );
      }
    }
  }

  return (
    <div className="space-y-3">
      <div
        id={READER_ID}
        className="min-h-20 overflow-hidden rounded-xl border-base bg-cream"
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={disabled || mode !== "idle"}
          onClick={startScanner}
        >
          {mode === "starting"
            ? tx("Starting camera...", "Đang mở camera...")
            : tx("Start camera", "Mở camera")}
        </Button>

        <Button
          type="button"
          variant="ghost"
          disabled={disabled || mode === "idle"}
          onClick={releaseScanner}
        >
          {tx("Stop camera", "Dừng camera")}
        </Button>
      </div>

      {cameraError ? (
        <p className="rounded-md border-base bg-rose/10 px-3 py-2 text-sm text-rose">
          {cameraError}
        </p>
      ) : null}

      <p className="text-xs text-stone">
        {tx(
          "The camera stops automatically after reading one QR code.",
          "Camera sẽ tự động dừng sau khi đọc được một mã QR.",
        )}
      </p>
    </div>
  );
}

export default QrScanner;
