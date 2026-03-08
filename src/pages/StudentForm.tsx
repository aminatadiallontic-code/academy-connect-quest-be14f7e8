import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, User, BookOpen, FileText, ChevronLeft, ChevronRight,
  Camera, Upload, Check, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const steps = [
  { id: 1, label: "Personnel", fullLabel: "Informations personnelles", icon: User },
  { id: 2, label: "Académique", fullLabel: "Informations académiques", icon: BookOpen },
  { id: 3, label: "Documents", fullLabel: "Documents & photos", icon: FileText },
];

const StudentForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    lastName: "", firstName: "", birthDate: "", birthPlace: "",
    gender: "", nationality: "", address: "", phone: "", email: "",
    educationLevel: "", studentId: "", institution: "", program: "",
    birthCertNumber: "", guardianName: "", guardianPhone: "",
  });
  const [photos, setPhotos] = useState<{ portrait: File | null; id: File | null; proof: File | null }>({
    portrait: null, id: null, proof: null,
  });

  useEffect(() => {
    const step = searchParams.get("step");
    if (step && [1, 2, 3].includes(Number(step))) {
      setCurrentStep(Number(step));
    }
  }, [searchParams]);

  const progress = Math.round(((currentStep - 1) / steps.length) * 100 + (100 / steps.length) * 0.5);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const nextStep = () => {
    if (currentStep === 1) {
      if (!form.lastName || !form.firstName || !form.birthDate || !form.gender) {
        toast.error("Veuillez remplir les champs obligatoires");
        return;
      }
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFileChange = (type: "portrait" | "id" | "proof", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("La taille du fichier ne doit pas dépasser 2 Mo");
        return;
      }
      if (!file.type.match(/^image\/(jpeg|png)$/)) {
        toast.error("Seuls les formats JPEG et PNG sont acceptés");
        return;
      }
      setPhotos((prev) => ({ ...prev, [type]: file }));
      toast.success(`${file.name} ajouté`);
    }
  };

  const handleSubmit = () => {
    toast.success("Dossier soumis avec succès !");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 glass-strong">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="font-display text-base sm:text-lg font-bold text-foreground tracking-tight">GestApprenants</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl text-muted-foreground">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-6 sm:py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-2">Compléter mon dossier</h1>

          {/* Step indicator */}
          <div className="mb-2">
            <Progress value={progress} className="h-1.5 rounded-full" />
          </div>
          <div className="mb-8 flex justify-between">
            {steps.map((s) => {
              const StepIcon = s.icon;
              const isActive = currentStep === s.id;
              const isDone = currentStep > s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => { if (isDone) setCurrentStep(s.id); }}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-all ${
                    isDone ? "cursor-pointer" : "cursor-default"
                  } ${isActive ? "text-primary" : isDone ? "text-success" : "text-muted-foreground"}`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? "gradient-primary text-primary-foreground shadow-primary-glow" 
                      : isDone 
                        ? "bg-success/10 text-success border border-success/20" 
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {isDone ? <Check className="h-3.5 w-3.5" /> : s.id}
                  </div>
                  <span className="hidden sm:inline">{s.fullLabel}</span>
                  <span className="sm:hidden">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form sections */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 rounded-2xl border border-border/60 bg-card p-5 sm:p-7 shadow-card"
              >
                <h2 className="font-display text-base sm:text-lg font-bold text-card-foreground flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  Informations personnelles
                </h2>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Nom(s) *</Label>
                    <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="DUPONT" className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Prénom(s) *</Label>
                    <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Jean" className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Date de naissance *</Label>
                    <Input type="date" value={form.birthDate} onChange={(e) => update("birthDate", e.target.value)} className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Lieu de naissance</Label>
                    <Input value={form.birthPlace} onChange={(e) => update("birthPlace", e.target.value)} placeholder="Douala" className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Sexe *</Label>
                    <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                      <SelectTrigger className="h-11 rounded-xl border-border/80"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculin</SelectItem>
                        <SelectItem value="F">Féminin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Nationalité</Label>
                    <Input value={form.nationality} onChange={(e) => update("nationality", e.target.value)} placeholder="Camerounaise" className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Adresse complète</Label>
                  <Input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Quartier, Ville" className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors" />
                </div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Téléphone</Label>
                    <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+237 6XX XXX XXX" className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@exemple.com" className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors" />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 rounded-2xl border border-border/60 bg-card p-5 sm:p-7 shadow-card"
              >
                <h2 className="font-display text-base sm:text-lg font-bold text-card-foreground flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  Informations académiques
                </h2>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Niveau d'étude</Label>
                    <Select value={form.educationLevel} onValueChange={(v) => update("educationLevel", v)}>
                      <SelectTrigger className="h-11 rounded-xl border-border/80"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="licence1">Licence 1</SelectItem>
                        <SelectItem value="licence2">Licence 2</SelectItem>
                        <SelectItem value="licence3">Licence 3</SelectItem>
                        <SelectItem value="master1">Master 1</SelectItem>
                        <SelectItem value="master2">Master 2</SelectItem>
                        <SelectItem value="doctorat">Doctorat</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Identifiant étudiant</Label>
                    <Input value={form.studentId} onChange={(e) => update("studentId", e.target.value)} placeholder="Optionnel" className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Établissement</Label>
                    <Input value={form.institution} onChange={(e) => update("institution", e.target.value)} placeholder="Université de..." className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Filière / Classe</Label>
                    <Input value={form.program} onChange={(e) => update("program", e.target.value)} placeholder="Informatique" className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors" />
                  </div>
                </div>

                <div className="border-t border-border/40 pt-4 mt-2">
                  <h3 className="font-display font-bold text-card-foreground text-sm mb-3">Informations administratives (optionnel)</h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">N° acte de naissance</Label>
                      <Input value={form.birthCertNumber} onChange={(e) => update("birthCertNumber", e.target.value)} className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Tuteur légal</Label>
                      <Input value={form.guardianName} onChange={(e) => update("guardianName", e.target.value)} placeholder="Nom du tuteur" className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Contact tuteur</Label>
                      <Input value={form.guardianPhone} onChange={(e) => update("guardianPhone", e.target.value)} placeholder="+237..." className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 rounded-2xl border border-border/60 bg-card p-5 sm:p-7 shadow-card"
              >
                <h2 className="font-display text-base sm:text-lg font-bold text-card-foreground flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  Documents & Photos
                </h2>
                <p className="text-sm text-muted-foreground">
                  Formats acceptés : JPEG, PNG. Taille max : 2 Mo par fichier.
                </p>

                {[
                  { key: "portrait" as const, label: "Photo portrait", icon: Camera },
                  { key: "id" as const, label: "Pièce d'identité", icon: FileText },
                  { key: "proof" as const, label: "Justificatif de domicile", icon: Upload },
                ].map((doc) => (
                  <div key={doc.key} className="rounded-xl border border-dashed border-border/80 p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                          <doc.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-card-foreground">{doc.label}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {photos[doc.key] ? photos[doc.key]!.name : "Aucun fichier sélectionné"}
                          </p>
                        </div>
                      </div>
                      <label className="shrink-0">
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          className="hidden"
                          onChange={(e) => handleFileChange(doc.key, e)}
                        />
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span className="cursor-pointer rounded-xl">
                            {photos[doc.key] ? <Check className="h-4 w-4 mr-1 text-success" /> : <Upload className="h-4 w-4 mr-1" />}
                            {photos[doc.key] ? "Changer" : "Importer"}
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="rounded-xl gap-1">
              <ChevronLeft className="h-4 w-4" /> Précédent
            </Button>
            {currentStep < 3 ? (
              <Button onClick={nextStep} className="rounded-xl gradient-primary btn-shine gap-1 shadow-primary-glow">
                Suivant <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="rounded-xl gradient-accent text-accent-foreground btn-shine gap-1">
                <Check className="h-4 w-4" /> Soumettre
              </Button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentForm;
