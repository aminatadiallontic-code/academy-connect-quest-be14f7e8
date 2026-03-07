import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Camera, StopCircle } from "lucide-react";

interface QRScannerProps {
  onScan: (data: string) => void;
}

export const QRScanner = ({ onScan }: QRScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "qr-reader";

  const startScanning = async () => {
    setError(null);
    try {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
        },
        () => {}
      );
      setScanning(true);
    } catch (err) {
      setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
      console.error(err);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        id={containerId}
        className="w-full max-w-sm rounded-xl overflow-hidden border border-border bg-muted"
        style={{ minHeight: scanning ? 300 : 0 }}
      />
      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
      {!scanning ? (
        <Button onClick={startScanning} className="gap-2">
          <Camera className="h-4 w-4" /> Lancer le scan
        </Button>
      ) : (
        <Button variant="destructive" onClick={stopScanning} className="gap-2">
          <StopCircle className="h-4 w-4" /> Arrêter
        </Button>
      )}
    </div>
  );
};
