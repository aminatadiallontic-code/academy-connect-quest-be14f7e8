import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, User, BookOpen, FileText, ChevronLeft, ChevronRight,
  Camera, Upload, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const steps = [
  { id: 1, label: "Informations personnelles", icon: User },
  { id: 2, label: "Informations académiques", icon: BookOpen },
  { id: 3, label: "Documents & photos", icon: FileText },
];

const StudentForm = () => {
  const navigate = useNavigate();
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
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2 text-primary">
            <GraduationCap className="h-7 w-7" />
            <span className="font-display text-lg font-bold">GestApprenants</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Compléter mon dossier</h1>

          {/* Step indicator */}
          <div className="mb-2">
            <Progress value={progress} className="h-2" />
          </div>
          <div className="mb-8 flex justify-between">
            {steps.map((s) => {
              const StepIcon = s.icon;
              const isActive = currentStep === s.id;
              const isDone = currentStep > s.id;
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    isActive ? "text-primary" : isDone ? "text-success" : "text-muted-foreground"
                  }`}
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    isActive ? "bg-primary text-primary-foreground" : isDone ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {isDone ? <Check className="h-3.5 w-3.5" /> : s.id}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
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
                className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card"
              >
                <h2 className="font-display text-lg font-semibold text-card-foreground flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Informations personnelles
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Nom(s) *</Label>
                    <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="DUPONT" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Prénom(s) *</Label>
                    <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Jean" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Date de naissance *</Label>
                    <Input type="date" value={form.birthDate} onChange={(e) => update("birthDate", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Lieu de naissance</Label>
                    <Input value={form.birthPlace} onChange={(e) => update("birthPlace", e.target.value)} placeholder="Douala" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Sexe *</Label>
                    <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculin</SelectItem>
                        <SelectItem value="F">Féminin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Nationalité</Label>
                    <Input value={form.nationality} onChange={(e) => update("nationality", e.target.value)} placeholder="Camerounaise" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Adresse complète</Label>
                  <Input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Quartier, Ville" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Téléphone</Label>
                    <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+237 6XX XXX XXX" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@exemple.com" />
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
                className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card"
              >
                <h2 className="font-display text-lg font-semibold text-card-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" /> Informations académiques
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Niveau d'étude</Label>
                    <Select value={form.educationLevel} onValueChange={(v) => update("educationLevel", v)}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
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
                    <Label>Identifiant étudiant</Label>
                    <Input value={form.studentId} onChange={(e) => update("studentId", e.target.value)} placeholder="Optionnel" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Établissement</Label>
                    <Input value={form.institution} onChange={(e) => update("institution", e.target.value)} placeholder="Université de..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Filière / Classe</Label>
                    <Input value={form.program} onChange={(e) => update("program", e.target.value)} placeholder="Informatique" />
                  </div>
                </div>

                <h3 className="font-display font-semibold text-card-foreground mt-4">Informations administratives (optionnel)</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>N° acte de naissance</Label>
                    <Input value={form.birthCertNumber} onChange={(e) => update("birthCertNumber", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tuteur légal</Label>
                    <Input value={form.guardianName} onChange={(e) => update("guardianName", e.target.value)} placeholder="Nom du tuteur" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Contact tuteur</Label>
                    <Input value={form.guardianPhone} onChange={(e) => update("guardianPhone", e.target.value)} placeholder="+237..." />
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
                className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card"
              >
                <h2 className="font-display text-lg font-semibold text-card-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Documents & Photos
                </h2>
                <p className="text-sm text-muted-foreground">
                  Formats acceptés : JPEG, PNG. Taille max : 2 Mo par fichier.
                </p>

                {[
                  { key: "portrait" as const, label: "Photo portrait", icon: Camera },
                  { key: "id" as const, label: "Pièce d'identité", icon: FileText },
                  { key: "proof" as const, label: "Justificatif de domicile", icon: Upload },
                ].map((doc) => (
                  <div key={doc.key} className="rounded-lg border border-dashed border-border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <doc.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{doc.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {photos[doc.key] ? photos[doc.key]!.name : "Aucun fichier sélectionné"}
                          </p>
                        </div>
                      </div>
                      <label>
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          className="hidden"
                          onChange={(e) => handleFileChange(doc.key, e)}
                        />
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span className="cursor-pointer">
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
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
            </Button>
            {currentStep < 3 ? (
              <Button onClick={nextStep}>
                Suivant <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Soumettre le dossier
              </Button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentForm;
