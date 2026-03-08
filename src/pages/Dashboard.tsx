import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, User, FileText, Bell, LogOut, ChevronRight,
  CheckCircle2, Clock, AlertCircle, Plus, Download, QrCode, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { exportStudentPdf } from "@/lib/exportPdf";
import { useAuth } from "@/hooks/useAuth";

const statusConfig = {
  incomplete: { label: "Incomplet", color: "bg-destructive/10 text-destructive border border-destructive/20", icon: AlertCircle },
  pending: { label: "En cours de validation", color: "bg-warning/10 text-warning border border-warning/20", icon: Clock },
  validated: { label: "Validé", color: "bg-success/10 text-success border border-success/20", icon: CheckCircle2 },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const progress = 45;
  const status: keyof typeof statusConfig = "incomplete";
  const StatusIcon = statusConfig[status].icon;

  const notifications = [
    { id: 1, text: "Veuillez compléter vos informations académiques.", time: "Il y a 2h", read: false },
    { id: 2, text: "Bienvenue sur Mon Parcours !", time: "Il y a 1j", read: true },
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

  const handleLogout = async () => {
    await signOut();
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Apprenant";

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-border/60 glass-strong">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="font-display text-base sm:text-lg font-bold text-foreground tracking-tight">Mon Parcours</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-muted">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="font-display">Notifications</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-xl p-3.5 transition-colors ${n.read ? "bg-transparent hover:bg-muted/50" : "bg-primary/5 border border-primary/10"}`}
                    >
                      <div className="flex items-start gap-2.5">
                        {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                        <div>
                          <p className="text-sm text-card-foreground leading-relaxed">{n.text}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-xl hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          
          {/* Welcome + Avatar */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-primary-glow">
              <User className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight">Bonjour, {displayName} 👋</h1>
              <p className="text-sm text-muted-foreground">Voici l'état de votre dossier</p>
            </div>
          </div>

          {/* Progress card */}
          <div className="mb-6 rounded-2xl border border-border/60 bg-card p-5 sm:p-6 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="font-display font-bold text-card-foreground">Progression du dossier</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{progress}% complété</p>
              </div>
              <Badge variant="secondary" className={`${statusConfig[status].color} rounded-lg px-3 py-1`}>
                <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
                {statusConfig[status].label}
              </Badge>
            </div>
            <Progress value={progress} className="h-2.5 rounded-full" />
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={handleExportPdf} className="gap-1.5 rounded-xl">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Exporter PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            </div>
          </div>

          {/* Actions grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {[
              { to: "/student-form", icon: Plus, title: "Compléter mon dossier", desc: "Remplir les informations manquantes", iconBg: "bg-primary/8 text-primary", hoverBorder: "hover:border-primary/30" },
              { to: "/student-form", icon: User, title: "Mon profil", desc: "Gérer vos informations personnelles", iconBg: "bg-accent/10 text-accent", hoverBorder: "hover:border-accent/30" },
              { to: "/student-form?step=3", icon: FileText, title: "Mes documents", desc: "Consulter vos pièces justificatives", iconBg: "bg-info/10 text-info", hoverBorder: "hover:border-info/30", colSpan: "sm:col-span-2 lg:col-span-1" },
            ].map((action) => (
              <Link key={action.title} to={action.to} className={`block ${action.colSpan || ""}`}>
                <div className={`group rounded-2xl border border-border/60 bg-card p-5 shadow-card card-hover ${action.hoverBorder}`}>
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${action.iconBg}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-card-foreground">{action.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{action.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Accéder <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/qrcode">
              <Button variant="outline" className="w-full gap-2 h-11 rounded-xl hover:border-primary/30">
                <QrCode className="h-4 w-4 text-primary" /> Mon QR Code
              </Button>
            </Link>
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" className="w-full gap-2 h-11 rounded-xl hover:border-accent/30">
                  <Shield className="h-4 w-4 text-accent" /> Espace admin
                </Button>
              </Link>
            )}
            <Button variant="outline" className="w-full gap-2 h-11 rounded-xl hover:border-info/30" onClick={handleExportPdf}>
              <Download className="h-4 w-4 text-info" /> Dossier PDF
            </Button>
          </div>

          {/* Notifications inline */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-card-foreground">Notifications récentes</h3>
              <Badge variant="secondary" className="bg-destructive/10 text-destructive text-xs rounded-lg">
                {notifications.filter(n => !n.read).length} nouvelle(s)
              </Badge>
            </div>
            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 rounded-xl p-3.5 transition-colors ${n.read ? "hover:bg-muted/50" : "bg-primary/4 border border-primary/8"}`}
                >
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse" />}
                  <div className={n.read ? "ml-5" : ""}>
                    <p className="text-sm text-card-foreground leading-relaxed">{n.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
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
