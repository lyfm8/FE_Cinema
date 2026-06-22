import { useCallback, useEffect, useRef, useState } from "react";
import {
  Html5Qrcode,
  Html5QrcodeScannerState,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import Button from "@/components/ui/Button";
import useLanguage from "@/features/i18n/hooks/useLanguage";

const READER_ID = "ticket-check-in-qr-reader";

function isRunningState(state) {
  return (
    state === Html5QrcodeScannerState.SCANNING ||
    state === Html5QrcodeScannerState.PAUSED
  );
}

function isBackCamera(camera) {
  return /back|rear|environment|sau/i.test(camera?.label || "");
}

function QrScanner({ onScan, disabled = false }) {
  const { tx } = useLanguage();
  const scannerRef = useRef(null);
  const handledRef = useRef(false);
  const mountedRef = useRef(true);

  const [mode, setMode] = useState("idle");
  const [cameraError, setCameraError] = useState("");

  const cleanupScanner = useCallback(async (scanner) => {
    if (!scanner) return;

    try {
      const state = scanner.getState();
      if (isRunningState(state)) {
        await scanner.stop();
      }
    } catch {
      // Stop can fail if the browser already closed the stream.
    }

    try {
      scanner.clear();
    } catch {
      // Clear can fail when the reader element was already reset.
    }
  }, []);

  const releaseScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    handledRef.current = false;

    if (mountedRef.current) {
      setMode(scanner ? "stopping" : "idle");
      setCameraError("");
    }

    await cleanupScanner(scanner);

    if (mountedRef.current) {
      setMode("idle");
    }
  }, [cleanupScanner]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      const scanner = scannerRef.current;
      scannerRef.current = null;
      void cleanupScanner(scanner);
    };
  }, [cleanupScanner]);

  const getCameraConfig = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("MEDIA_DEVICES_UNAVAILABLE");
    }

    const cameras = await Html5Qrcode.getCameras();

    if (!cameras.length) {
      throw new Error("NO_CAMERA_FOUND");
    }

    const preferredCamera = cameras.find(isBackCamera) || cameras[0];
    return preferredCamera.id;
  }, []);

  const startScanner = useCallback(async () => {
    if (disabled || scannerRef.current || mode !== "idle") return;

    const readerElement = document.getElementById(READER_ID);
    if (!readerElement) {
      setCameraError(tx("Scanner area is not ready.", "Khu vực quét chưa sẵn sàng."));
      return;
    }

    setCameraError("");
    setMode("starting");
    handledRef.current = false;
    readerElement.innerHTML = "";

    const scanner = new Html5Qrcode(READER_ID, {
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true,
      },
      verbose: false,
    });

    scannerRef.current = scanner;

    try {
      const cameraConfig = await getCameraConfig();

      if (!mountedRef.current || scannerRef.current !== scanner) {
        await cleanupScanner(scanner);
        return;
      }

      await scanner.start(
        cameraConfig,
        {
          fps: 15,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const size = Math.floor(Math.max(120, Math.min(280, minEdge * 0.75)));
            return { width: size, height: size };
          },
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
        await cleanupScanner(scanner);
        return;
      }

      setMode("scanning");
    } catch (error) {
      if (scannerRef.current === scanner) {
        scannerRef.current = null;
      }

      await cleanupScanner(scanner);

      if (mountedRef.current) {
        setMode("idle");
        setCameraError(
          error?.name === "NotAllowedError"
            ? tx(
                "Camera permission was denied. Please allow camera access in the browser.",
                "Bạn đã từ chối quyền camera. Hãy cho phép camera trong trình duyệt.",
              )
            : tx(
                "Camera is unavailable. Try another browser, check camera permission, or enter the QR code manually.",
                "Không mở được camera. Hãy thử trình duyệt khác, kiểm tra quyền camera, hoặc nhập mã QR thủ công.",
              ),
        );
      }
    }
  }, [cleanupScanner, disabled, getCameraConfig, mode, onScan, releaseScanner, tx]);

  const isStarting = mode === "starting";
  const isScanning = mode === "scanning";
  const isStopping = mode === "stopping";
  const canStop = !disabled && (isStarting || isScanning || isStopping);

  return (
    <div className="space-y-3">
      <div
        id={READER_ID}
        className="min-h-64 overflow-hidden rounded-xl border-base bg-cream"
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={disabled || mode !== "idle"}
          onClick={startScanner}
        >
          {isStarting
            ? tx("Starting camera...", "Đang mở camera...")
            : tx("Start camera", "Mở camera")}
        </Button>

        <Button
          type="button"
          variant="ghost"
          disabled={!canStop}
          onClick={releaseScanner}
        >
          {isStopping
            ? tx("Stopping camera...", "Đang dừng camera...")
            : tx("Stop camera", "Dừng camera")}
        </Button>
      </div>

      {cameraError ? (
        <p className="rounded-md border-base bg-rose/10 px-3 py-2 text-sm text-rose">
          {cameraError}
        </p>
      ) : null}

      <p className="text-xs text-stone">
        {tx(
          "The camera stops automatically after reading one QR code. Camera works only on localhost or HTTPS.",
          "Camera sẽ tự động dừng sau khi đọc được một mã QR. Camera chỉ hoạt động trên localhost hoặc HTTPS.",
        )}
      </p>
    </div>
  );
}

export default QrScanner;
