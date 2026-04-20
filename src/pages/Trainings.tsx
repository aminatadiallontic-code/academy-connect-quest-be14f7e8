import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  GraduationCap, ArrowLeft, Plus, Calendar as CalendarIcon, MapPin,
  Pencil, Trash2, Loader2, BookOpen, Save, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Training = {
  id: string;
  title: string;
  training_date: string | null;
  location: string | null;
  description: string | null;
  created_at: string;
};

const emptyForm = { title: "", date: undefined as Date | undefined, location: "", description: "" };

const Trainings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Training | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Training | null>(null);

  const load = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("trainings")
      .select("id,title,training_date,location,description,created_at")
      .eq("user_id", user.id)
      .order("training_date", { ascending: false, nullsFirst: false });
    if (error) toast.error(error.message);
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (t: Training) => {
    setEditing(t);
    setForm({
      title: t.title,
      date: t.training_date ? new Date(t.training_date) : undefined,
      location: t.location ?? "",
      description: t.description ?? "",
    });
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.title.trim()) return toast.error("Le titre est requis");
    setSaving(true);
    const payload = {
      user_id: user.id,
      title: form.title.trim(),
      training_date: form.date ? format(form.date, "yyyy-MM-dd") : null,
      location: form.location.trim() || null,
      description: form.description.trim() || null,
    };
    const { error } = editing
      ? await supabase.from("trainings").update(payload).eq("id", editing.id)
      : await supabase.from("trainings").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Formation mise à jour" : "Formation ajoutée");
    setOpen(false);
    load();
  };

  const remove = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("trainings").delete().eq("id", toDelete.id);
    if (error) return toast.error(error.message);
    toast.success("Formation supprimée");
    setToDelete(null);
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 glass-strong">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-base sm:text-lg font-bold text-foreground">Mon Parcours</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-1.5 text-muted-foreground rounded-xl">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Mes formations</h1>
              <p className="mt-1 text-muted-foreground">Suivez votre parcours de formation</p>
            </div>
            <Button onClick={openNew} className="rounded-xl gradient-primary text-primary-foreground gap-2 shadow-primary-glow">
              <Plus className="h-4 w-4" /> Ajouter une formation
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">Aucune formation</h3>
              <p className="mt-1 text-sm text-muted-foreground">Commencez par ajouter votre première formation</p>
              <Button onClick={openNew} className="mt-5 rounded-xl gradient-primary text-primary-foreground gap-2">
                <Plus className="h-4 w-4" /> Ajouter
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {items.map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="group rounded-2xl border border-border/60 bg-card p-5 shadow-card hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display font-semibold text-foreground truncate">{t.title}</h3>
                          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            {t.training_date && (
                              <span className="inline-flex items-center gap-1">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                {format(new Date(t.training_date), "d MMM yyyy", { locale: fr })}
                              </span>
                            )}
                            {t.location && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {t.location}
                              </span>
                            )}
                          </div>
                          {t.description && (
                            <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed line-clamp-3">{t.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(t)} className="h-8 w-8 rounded-lg hover:bg-muted">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setToDelete(t)} className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>

      {/* Form dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Modifier la formation" : "Nouvelle formation"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Titre *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Formation React avancé"
                className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full h-11 rounded-xl justify-start text-left font-normal border-border/80 bg-muted/30",
                        !form.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.date ? format(form.date, "d MMM yyyy", { locale: fr }) : "Choisir"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.date}
                      onSelect={(d) => setForm({ ...form, date: d })}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">Lieu</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Ex: Paris"
                  className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Décrivez le contenu, les compétences acquises..."
                rows={4}
                className="rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors resize-none"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl gap-1.5">
                <X className="h-4 w-4" /> Annuler
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl gradient-primary text-primary-foreground gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editing ? "Enregistrer" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Supprimer cette formation ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {toDelete?.title} » sera définitivement supprimée. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Trainings;