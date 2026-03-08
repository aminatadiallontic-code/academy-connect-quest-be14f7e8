import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRef } from "react";

interface StudentQRCodeProps {
  studentId: string;
  studentName: string;
  size?: number;
}

export const StudentQRCode = ({ studentId, studentName, size = 200 }: StudentQRCodeProps) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const qrData = JSON.stringify({
    type: "monparcours_student",
    id: studentId,
    name: studentName,
    generatedAt: new Date().toISOString(),
  });

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = size + 40;
      canvas.height = size + 80;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20, size, size);

      ctx.fillStyle = "#1a1a2e";
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(studentName, canvas.width / 2, size + 45);
      ctx.font = "10px Inter, sans-serif";
      ctx.fillStyle = "#666";
      ctx.fillText(`ID: ${studentId}`, canvas.width / 2, size + 62);

      const link = document.createElement("a");
      link.download = `qr_${studentName.replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={qrRef} className="rounded-xl border border-border bg-white p-4 shadow-card">
        <QRCodeSVG
          value={qrData}
          size={size}
          level="H"
          includeMargin={false}
          fgColor="#143064"
          bgColor="#ffffff"
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-card-foreground">{studentName}</p>
        <p className="text-xs text-muted-foreground">ID: {studentId}</p>
      </div>
      <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5">
        <Download className="h-3.5 w-3.5" /> Télécharger QR
      </Button>
    </div>
  );
};
