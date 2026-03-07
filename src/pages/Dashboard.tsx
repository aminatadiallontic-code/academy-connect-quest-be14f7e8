import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, User, FileText, Bell, LogOut, ChevronRight,
  CheckCircle2, Clock, AlertCircle, Plus, Download, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { exportStudentPdf } from "@/lib/exportPdf";

const statusConfig = {
  incomplete: { label: "Incomplet", color: "bg-destructive/10 text-destructive", icon: AlertCircle },
  pending: { label: "En cours de validation", color: "bg-warning/10 text-warning", icon: Clock },
  validated: { label: "Validé", color: "bg-success/10 text-success", icon: CheckCircle2 },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const progress = 45;
  const status: keyof typeof statusConfig = "incomplete";
  const StatusIcon = statusConfig[status].icon;

  const notifications = [
    { id: 1, text: "Veuillez compléter vos informations académiques.", time: "Il y a 2h", read: false },
    { id: 2, text: "Bienvenue sur GestApprenants !", time: "Il y a 1j", read: true },
  ];

  const handleExportPdf = () => {
    exportStudentPdf({
      lastName: "APPRENANT",
      firstName: "Nom",
      birthDate: "",
      birthPlace: "",
      gender: "",
      nationality: "",
      address: "",
      phone: "",
      email: "",
      educationLevel: "",
      studentId: "",
      institution: "",
      program: "",
      birthCertNumber: "",
      guardianName: "",
      guardianPhone: "",
      status,
    });
    toast.success("PDF téléchargé !");
  };

  const handleLogout = () => {
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7" />
            <span className="font-display text-base sm:text-lg font-bold">GestApprenants</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-3">
            <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-destructive" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="font-display">Notifications</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-lg p-3 transition-colors ${n.read ? "bg-transparent" : "bg-primary/5"}`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                        <div>
                          <p className="text-sm text-card-foreground">{n.text}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Welcome */}
          <div className="mb-6 sm:mb-8">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">Bonjour, Apprenant 👋</h1>
            <p className="mt-1 text-sm sm:text-base text-muted-foreground">Voici l'état de votre dossier</p>
          </div>

          {/* Progress card */}
          <div className="mb-6 sm:mb-8 rounded-xl border border-border bg-card p-4 sm:p-6 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <h3 className="font-display font-semibold text-card-foreground">Progression du dossier</h3>
              <Badge variant="secondary" className={statusConfig[status].color}>
                <StatusIcon className="mr-1 h-3.5 w-3.5" />
                {statusConfig[status].label}
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{progress}% complété</p>
              <Button variant="outline" size="sm" onClick={handleExportPdf} className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Exporter PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            </div>
          </div>

          {/* Actions grid */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
            <Link to="/student-form" className="block">
              <div className="group rounded-xl border border-border bg-card p-4 sm:p-5 shadow-card transition-all hover:shadow-elevated hover:border-primary/30">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-card-foreground">Compléter mon dossier</h3>
                <p className="mt-1 text-sm text-muted-foreground">Remplir les informations manquantes</p>
                <ChevronRight className="mt-3 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link to="/student-form" className="block">
              <div className="group rounded-xl border border-border bg-card p-4 sm:p-5 shadow-card transition-all hover:shadow-elevated hover:border-accent/30">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <User className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-card-foreground">Mon profil</h3>
                <p className="mt-1 text-sm text-muted-foreground">Gérer vos informations personnelles</p>
                <ChevronRight className="mt-3 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link to="/student-form?step=3" className="block sm:col-span-2 lg:col-span-1">
              <div className="group rounded-xl border border-border bg-card p-4 sm:p-5 shadow-card transition-all hover:shadow-elevated hover:border-info/30">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                  <FileText className="h-5 w-5 text-info" />
                </div>
                <h3 className="font-display font-semibold text-card-foreground">Mes documents</h3>
                <p className="mt-1 text-sm text-muted-foreground">Consulter vos pièces justificatives</p>
                <ChevronRight className="mt-3 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>

          {/* Quick actions */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3">
            <Link to="/admin" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <User className="h-4 w-4" /> Espace administrateur
              </Button>
            </Link>
            <Button variant="outline" className="flex-1 gap-2" onClick={handleExportPdf}>
              <Download className="h-4 w-4" /> Télécharger mon dossier PDF
            </Button>
          </div>

          {/* Notifications inline */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-card">
            <h3 className="font-display font-semibold text-card-foreground mb-4">Notifications récentes</h3>
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${n.read ? "bg-transparent" : "bg-primary/5"}`}
                >
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  <div className={n.read ? "ml-5" : ""}>
                    <p className="text-sm text-card-foreground">{n.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
