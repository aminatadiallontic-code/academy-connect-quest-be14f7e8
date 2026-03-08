import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, QrCode, ScanLine, ArrowLeft, CheckCircle2, AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentQRCode } from "@/components/StudentQRCode";
import { QRScanner } from "@/components/QRScanner";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ScannedStudent {
  type: string;
  id: string;
  name: string;
  generatedAt: string;
}

const mockStudentLookup: Record<string, { program: string; status: string; email: string }> = {
  "STU-001": { program: "Informatique L3", status: "validated", email: "amadou@email.com" },
  "STU-002": { program: "Médecine M1", status: "pending", email: "marie@email.com" },
  "STU-003": { program: "Droit L2", status: "incomplete", email: "paul@email.com" },
};

const QRCodePage = () => {
  const [scannedResult, setScannedResult] = useState<ScannedStudent | null>(null);
  const [scanError, setScanError] = useState(false);

  const handleScan = (data: string) => {
    try {
      const parsed = JSON.parse(data) as ScannedStudent;
      if (parsed.type === "monparcours_student") {
        setScannedResult(parsed);
        setScanError(false);
        toast.success(`Apprenant trouvé : ${parsed.name}`);
      } else {
        setScanError(true);
        toast.error("QR code non reconnu");
      }
    } catch {
      setScanError(true);
      toast.error("QR code invalide");
    }
  };

  const studentInfo = scannedResult ? mockStudentLookup[scannedResult.id] : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2 text-primary">
            <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7" />
            <span className="font-display text-base sm:text-lg font-bold">Mon Parcours</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-xl px-4 py-6 sm:py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary" /> QR Code Apprenant
          </h1>
          <p className="text-sm text-muted-foreground mb-6">Générez ou scannez un QR code étudiant</p>

          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate" className="gap-1.5">
                <QrCode className="h-4 w-4" /> Générer
              </TabsTrigger>
              <TabsTrigger value="scan" className="gap-1.5">
                <ScanLine className="h-4 w-4" /> Scanner
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="mt-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h2 className="font-display text-base font-semibold text-card-foreground mb-6 text-center">
                  Mon QR Code unique
                </h2>
                <StudentQRCode studentId="STU-001" studentName="Amadou Diallo" size={220} />
                <p className="mt-6 text-xs text-muted-foreground text-center max-w-xs mx-auto">
                  Ce QR code contient votre identifiant unique. Présentez-le lors de vos démarches administratives.
                </p>
              </div>

              {/* Sample other students for admin preview */}
              <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-display text-sm font-semibold text-card-foreground mb-4">
                  Exemples (vue admin)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <StudentQRCode studentId="STU-002" studentName="Marie Ngono" size={120} />
                  <StudentQRCode studentId="STU-003" studentName="Paul Biya Jr" size={120} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scan" className="mt-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h2 className="font-display text-base font-semibold text-card-foreground mb-4 text-center">
                  Scanner un QR Code
                </h2>
                <QRScanner onScan={handleScan} />

                {scanError && (
                  <div className="mt-4 rounded-lg bg-destructive/10 p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                    <p className="text-sm text-destructive">Ce QR code n'est pas un code Mon Parcours valide.</p>
                  </div>
                )}

                {scannedResult && !scanError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-xl border border-success/30 bg-success/5 p-5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <span className="font-display font-semibold text-card-foreground">Apprenant identifié</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-card-foreground font-medium">{scannedResult.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">ID</span>
                        <span className="font-mono text-card-foreground">{scannedResult.id}</span>
                      </div>
                      {studentInfo && (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Filière</span>
                            <span className="text-card-foreground">{studentInfo.program}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Email</span>
                            <span className="text-card-foreground">{studentInfo.email}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Statut</span>
                            <Badge
                              variant="secondary"
                              className={
                                studentInfo.status === "validated"
                                  ? "bg-success/10 text-success"
                                  : studentInfo.status === "pending"
                                  ? "bg-warning/10 text-warning"
                                  : "bg-muted text-muted-foreground"
                              }
                            >
                              {studentInfo.status === "validated" ? "Validé" : studentInfo.status === "pending" ? "En attente" : "Incomplet"}
                            </Badge>
                          </div>
                        </>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Généré le {new Date(scannedResult.generatedAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default QRCodePage;
