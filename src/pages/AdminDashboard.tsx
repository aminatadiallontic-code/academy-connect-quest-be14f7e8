import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, Users, CheckCircle2, Clock, AlertCircle,
  Search, Eye, Check, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";

type StudentStatus = "incomplete" | "pending" | "validated" | "rejected";

interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  progress: number;
  status: StudentStatus;
  submittedAt: string;
}

const mockStudents: Student[] = [
  { id: "1", name: "Amadou Diallo", email: "amadou@email.com", program: "Informatique L3", progress: 100, status: "pending", submittedAt: "15 Fév 2026" },
  { id: "2", name: "Marie Ngono", email: "marie@email.com", program: "Médecine M1", progress: 100, status: "validated", submittedAt: "12 Fév 2026" },
  { id: "3", name: "Paul Biya Jr", email: "paul@email.com", program: "Droit L2", progress: 60, status: "incomplete", submittedAt: "-" },
  { id: "4", name: "Fatou Sow", email: "fatou@email.com", program: "Économie M2", progress: 100, status: "rejected", submittedAt: "10 Fév 2026" },
  { id: "5", name: "Jean Kamga", email: "jean@email.com", program: "Génie Civil L1", progress: 100, status: "pending", submittedAt: "14 Fév 2026" },
];

const statusMap: Record<StudentStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  incomplete: { label: "Incomplet", className: "bg-muted text-muted-foreground", icon: AlertCircle },
  pending: { label: "En attente", className: "bg-warning/10 text-warning", icon: Clock },
  validated: { label: "Validé", className: "bg-success/10 text-success", icon: CheckCircle2 },
  rejected: { label: "Rejeté", className: "bg-destructive/10 text-destructive", icon: X },
};

const AdminDashboard = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState(mockStudents);
  const [selected, setSelected] = useState<Student | null>(null);

  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: students.length,
    pending: students.filter((s) => s.status === "pending").length,
    validated: students.filter((s) => s.status === "validated").length,
    incomplete: students.filter((s) => s.status === "incomplete").length,
  };

  const updateStatus = (id: string, status: StudentStatus) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <GraduationCap className="h-7 w-7" />
            <span className="font-display text-lg font-bold">Admin</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="sm">Espace apprenant</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-foreground mb-6">Tableau de bord administrateur</h1>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "Total apprenants", value: stats.total, icon: Users, color: "bg-primary/10 text-primary" },
              { label: "En attente", value: stats.pending, icon: Clock, color: "bg-warning/10 text-warning" },
              { label: "Validés", value: stats.validated, icon: CheckCircle2, color: "bg-success/10 text-success" },
              { label: "Incomplets", value: stats.incomplete, icon: AlertCircle, color: "bg-muted text-muted-foreground" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold font-display text-card-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Search & list */}
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="border-b border-border p-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un apprenant..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Nom</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Filière</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Soumis le</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student) => {
                    const st = statusMap[student.status];
                    const StIcon = st.icon;
                    return (
                      <tr key={student.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-card-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{student.program}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className={st.className}>
                            <StIcon className="mr-1 h-3 w-3" />
                            {st.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{student.submittedAt}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" onClick={() => setSelected(student)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{selected?.name}</DialogTitle>
            <DialogDescription>{selected?.email} — {selected?.program}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progression</span>
                <span className="text-sm font-medium text-card-foreground">{selected.progress}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Statut actuel</span>
                <Badge variant="secondary" className={statusMap[selected.status].className}>
                  {statusMap[selected.status].label}
                </Badge>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                  onClick={() => updateStatus(selected.id, "validated")}
                >
                  <Check className="h-4 w-4 mr-1" /> Valider
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => updateStatus(selected.id, "rejected")}
                >
                  <X className="h-4 w-4 mr-1" /> Rejeter
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
