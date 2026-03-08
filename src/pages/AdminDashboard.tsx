import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, Users, CheckCircle2, Clock, AlertCircle,
  Search, Eye, Check, X, Download, Filter, ArrowLeft,
  Plus, Pencil, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { exportStudentPdf } from "@/lib/exportPdf";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Student = Tables<"students">;
type StudentStatus = "incomplete" | "pending" | "validated" | "rejected";

const statusMap: Record<StudentStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  incomplete: { label: "Incomplet", className: "bg-muted text-muted-foreground border border-border", icon: AlertCircle },
  pending: { label: "En attente", className: "bg-warning/10 text-warning border border-warning/20", icon: Clock },
  validated: { label: "Validé", className: "bg-success/10 text-success border border-success/20", icon: CheckCircle2 },
  rejected: { label: "Rejeté", className: "bg-destructive/10 text-destructive border border-destructive/20", icon: X },
};

const emptyForm = {
  first_name: "", last_name: "", email: "", phone: "", program: "",
  birth_date: "", birth_place: "", gender: "", nationality: "",
  address: "", education_level: "", student_id: "", institution: "",
  guardian_name: "", guardian_phone: "",
};

const AdminDashboard = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Student | null>(null);

  // Add/Edit form
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  const fetchStudents = async () => {
    const { data, error } = await supabase.from("students").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Erreur lors du chargement des apprenants");
      console.error(error);
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const filtered = students.filter((s) => {
    const name = `${s.first_name} ${s.last_name}`.toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase()) || (s.email || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: students.length,
    pending: students.filter((s) => s.status === "pending").length,
    validated: students.filter((s) => s.status === "validated").length,
    incomplete: students.filter((s) => s.status === "incomplete").length,
  };

  const updateStatus = async (id: string, status: StudentStatus) => {
    const { error } = await supabase.from("students").update({ status }).eq("id", id);
    if (error) { toast.error("Erreur"); return; }
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    setSelected(null);
    toast.success(status === "validated" ? "Dossier validé !" : "Dossier rejeté");
  };

  const openAddForm = () => {
    setEditingStudent(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEditForm = (student: Student) => {
    setEditingStudent(student);
    setForm({
      first_name: student.first_name, last_name: student.last_name,
      email: student.email || "", phone: student.phone || "",
      program: student.program || "", birth_date: student.birth_date || "",
      birth_place: student.birth_place || "", gender: student.gender || "",
      nationality: student.nationality || "", address: student.address || "",
      education_level: student.education_level || "", student_id: student.student_id || "",
      institution: student.institution || "", guardian_name: student.guardian_name || "",
      guardian_phone: student.guardian_phone || "",
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.first_name || !form.last_name) {
      toast.error("Nom et prénom obligatoires");
      return;
    }
    setSaving(true);
    if (editingStudent) {
      const { error } = await supabase.from("students").update(form).eq("id", editingStudent.id);
      if (error) { toast.error("Erreur de mise à jour"); setSaving(false); return; }
      toast.success("Apprenant modifié !");
    } else {
      const { error } = await supabase.from("students").insert({ ...form, status: "incomplete", progress: 0 });
      if (error) { toast.error("Erreur d'ajout"); setSaving(false); return; }
      toast.success("Apprenant ajouté !");
    }
    setSaving(false);
    setFormOpen(false);
    fetchStudents();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("students").delete().eq("id", deleteTarget.id);
    if (error) { toast.error("Erreur de suppression"); return; }
    setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Apprenant supprimé !");
  };

  const handleExportPdf = (student: Student) => {
    exportStudentPdf({
      firstName: student.first_name, lastName: student.last_name,
      birthDate: student.birth_date || "", birthPlace: student.birth_place || "",
      gender: student.gender || "", nationality: student.nationality || "",
      address: student.address || "", phone: student.phone || "",
      email: student.email || "", educationLevel: student.education_level || "",
      studentId: student.student_id || "", institution: student.institution || "",
      program: student.program || "", birthCertNumber: "",
      guardianName: student.guardian_name || "", guardianPhone: student.guardian_phone || "",
      status: student.status, submittedAt: student.submitted_at || "",
    });
    toast.success("PDF téléchargé !");
  };

  const statCards = [
    { label: "Total apprenants", value: stats.total, icon: Users, iconBg: "bg-primary/8 text-primary" },
    { label: "En attente", value: stats.pending, icon: Clock, iconBg: "bg-warning/10 text-warning" },
    { label: "Validés", value: stats.validated, icon: CheckCircle2, iconBg: "bg-success/10 text-success" },
    { label: "Incomplets", value: stats.incomplete, icon: AlertCircle, iconBg: "bg-muted text-muted-foreground" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 glass-strong">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="font-display text-base sm:text-lg font-bold text-foreground tracking-tight">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl text-muted-foreground">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Retour</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Tableau de bord administrateur
            </h1>
            <Button onClick={openAddForm} className="gap-1.5 rounded-xl gradient-primary btn-shine">
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Ajouter</span>
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border/60 bg-card p-4 sm:p-5 shadow-card card-hover"
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold font-display text-card-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Search & filter */}
          <div className="rounded-2xl border border-border/60 bg-card shadow-card overflow-hidden">
            <div className="border-b border-border/60 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un apprenant..."
                    className="pl-11 h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl border-border/80">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="validated">Validé</SelectItem>
                    <SelectItem value="incomplete">Incomplet</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-border/60">
              {filtered.map((student) => {
                const st = statusMap[student.status as StudentStatus] || statusMap.incomplete;
                const StIcon = st.icon;
                return (
                  <div key={student.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-card-foreground">{student.first_name} {student.last_name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{student.program}</p>
                      </div>
                      <Badge variant="secondary" className={`${st.className} rounded-lg`}>
                        <StIcon className="mr-1 h-3 w-3" />
                        {st.label}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 rounded-xl" onClick={() => setSelected(student)}>
                        <Eye className="h-4 w-4 mr-1" /> Voir
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl" onClick={() => openEditForm(student)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(student)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="p-10 text-center text-sm text-muted-foreground">Aucun résultat trouvé</div>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                    <th className="px-5 py-3.5 font-medium">Nom</th>
                    <th className="px-5 py-3.5 font-medium">Filière</th>
                    <th className="px-5 py-3.5 font-medium">Statut</th>
                    <th className="px-5 py-3.5 font-medium hidden md:table-cell">Créé le</th>
                    <th className="px-5 py-3.5 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student) => {
                    const st = statusMap[student.status as StudentStatus] || statusMap.incomplete;
                    const StIcon = st.icon;
                    return (
                      <tr key={student.id} className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/8 text-primary font-display font-bold text-sm">
                              {student.first_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-card-foreground">{student.first_name} {student.last_name}</p>
                              <p className="text-xs text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">{student.program}</td>
                        <td className="px-5 py-4">
                          <Badge variant="secondary" className={`${st.className} rounded-lg`}>
                            <StIcon className="mr-1 h-3 w-3" />
                            {st.label}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell text-muted-foreground">
                          {new Date(student.created_at).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setSelected(student)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => openEditForm(student)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => handleExportPdf(student)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-xl text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(student)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                        Aucun résultat trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">{selected?.first_name} {selected?.last_name}</DialogTitle>
            <DialogDescription>{selected?.email} — {selected?.program}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 pt-2">
              <div className="rounded-xl bg-muted/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progression</span>
                  <span className="text-sm font-semibold text-card-foreground">{selected.progress}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Statut actuel</span>
                  <Badge variant="secondary" className={`${(statusMap[selected.status as StudentStatus] || statusMap.incomplete).className} rounded-lg`}>
                    {(statusMap[selected.status as StudentStatus] || statusMap.incomplete).label}
                  </Badge>
                </div>
              </div>

              <Button variant="outline" className="w-full gap-2 rounded-xl" onClick={() => handleExportPdf(selected)}>
                <Download className="h-4 w-4" /> Exporter en PDF
              </Button>

              <div className="flex gap-2 pt-1">
                <Button className="flex-1 rounded-xl gradient-accent text-accent-foreground btn-shine" onClick={() => updateStatus(selected.id, "validated")}>
                  <Check className="h-4 w-4 mr-1" /> Valider
                </Button>
                <Button variant="destructive" className="flex-1 rounded-xl" onClick={() => updateStatus(selected.id, "rejected")}>
                  <X className="h-4 w-4 mr-1" /> Rejeter
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg mx-4 rounded-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {editingStudent ? "Modifier l'apprenant" : "Ajouter un apprenant"}
            </DialogTitle>
            <DialogDescription>
              {editingStudent ? "Modifiez les informations ci-dessous" : "Cas d'exception — ajout manuel"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Prénom *</Label>
              <Input className="h-10 rounded-xl" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Nom *</Label>
              <Input className="h-10 rounded-xl" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Email</Label>
              <Input className="h-10 rounded-xl" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Téléphone</Label>
              <Input className="h-10 rounded-xl" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Filière</Label>
              <Input className="h-10 rounded-xl" value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Établissement</Label>
              <Input className="h-10 rounded-xl" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Date de naissance</Label>
              <Input type="date" className="h-10 rounded-xl" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Lieu de naissance</Label>
              <Input className="h-10 rounded-xl" value={form.birth_place} onChange={(e) => setForm({ ...form, birth_place: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Nationalité</Label>
              <Input className="h-10 rounded-xl" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Genre</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculin</SelectItem>
                  <SelectItem value="F">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setFormOpen(false)} className="rounded-xl">Annuler</Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-xl gradient-primary btn-shine">
              {saving ? "Enregistrement..." : editingStudent ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Supprimer cet apprenant ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'apprenant <strong>{deleteTarget?.first_name} {deleteTarget?.last_name}</strong> sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
