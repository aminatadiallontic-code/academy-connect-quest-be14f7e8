import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, ArrowLeft, User as UserIcon, Bell, Palette, Shield,
  Camera, Save, Loader2, Eye, EyeOff, Check, Globe, Sun, Moon, Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Profile = {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  language: string;
  theme: string;
  notify_email: boolean;
  notify_push: boolean;
};

const sections = [
  { id: "profile", label: "Profil", icon: UserIcon },
  { id: "appearance", label: "Apparence", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Sécurité", icon: Shield },
];

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [active, setActive] = useState<string>("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    full_name: "", email: "", avatar_url: null,
    language: "fr", theme: "system", notify_email: true, notify_push: false,
  });

  const [pwd, setPwd] = useState({ next: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  // Load profile
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name,email,avatar_url,language,theme,notify_email,notify_push")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) toast.error(error.message);
      if (data) setProfile(data as Profile);
      setLoading(false);
    })();
  }, [user]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    const apply = (t: string) => {
      if (t === "dark") root.classList.add("dark");
      else if (t === "light") root.classList.remove("dark");
      else {
        const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", dark);
      }
    };
    apply(profile.theme);
  }, [profile.theme]);

  const initials = (profile.full_name || profile.email || "U")
    .split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Format invalide (JPEG/PNG uniquement)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image trop lourde (max 2 Mo)");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      setUploading(false);
      toast.error(error.message);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    setProfile((p) => ({ ...p, avatar_url: publicUrl }));
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("user_id", user.id);
    setUploading(false);
    toast.success("Photo mise à jour");
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      language: profile.language,
      theme: profile.theme,
      notify_email: profile.notify_email,
      notify_push: profile.notify_push,
    }).eq("user_id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Préférences enregistrées");
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.next.length < 8) return toast.error("Minimum 8 caractères");
    if (pwd.next !== pwd.confirm) return toast.error("Les mots de passe ne correspondent pas");
    setPwdLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwd.next });
    setPwdLoading(false);
    if (error) return toast.error(error.message);
    setPwd({ next: "", confirm: "" });
    toast.success("Mot de passe mis à jour");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

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

      <main className="container mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Paramètres</h1>
            <p className="mt-1 text-muted-foreground">Gérez votre compte et vos préférences</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            {/* Sidebar */}
            <nav className="lg:sticky lg:top-20 lg:self-start">
              <div className="flex lg:flex-col gap-1 overflow-x-auto rounded-2xl border border-border/60 bg-card p-2 shadow-card">
                {sections.map((s) => {
                  const Icon = s.icon;
                  const isActive = active === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActive(s.id)}
                      className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Content */}
            <div className="space-y-6">
              {active === "profile" && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card space-y-6">
                  <div>
                    <h2 className="font-display text-lg font-bold text-foreground">Informations personnelles</h2>
                    <p className="text-sm text-muted-foreground">Modifiez vos informations publiques</p>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <Avatar className="h-20 w-20 ring-2 ring-border">
                        <AvatarImage src={profile.avatar_url || undefined} />
                        <AvatarFallback className="gradient-primary text-primary-foreground font-bold text-lg">{initials}</AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-2 ring-card hover:scale-105 transition-transform disabled:opacity-60"
                      >
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                      </button>
                      <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleAvatar} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{profile.full_name || "Sans nom"}</p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                      <p className="mt-1 text-xs text-muted-foreground">JPEG ou PNG, max 2 Mo</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-sm font-medium">Nom complet</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name || ""}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input id="email" value={profile.email || ""} disabled className="h-11 rounded-xl bg-muted/40" />
                    </div>
                  </div>

                  <Button onClick={saveProfile} disabled={saving} className="rounded-xl gradient-primary text-primary-foreground gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Enregistrer
                  </Button>
                </motion.section>
              )}

              {active === "appearance" && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card space-y-6">
                  <div>
                    <h2 className="font-display text-lg font-bold text-foreground">Apparence</h2>
                    <p className="text-sm text-muted-foreground">Personnalisez l'affichage de l'application</p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Thème</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "light", label: "Clair", icon: Sun },
                        { id: "dark", label: "Sombre", icon: Moon },
                        { id: "system", label: "Système", icon: Monitor },
                      ].map((t) => {
                        const Icon = t.icon;
                        const isActive = profile.theme === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setProfile({ ...profile, theme: t.id })}
                            className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                              isActive
                                ? "border-primary bg-primary/5"
                                : "border-border/60 bg-muted/20 hover:border-border"
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                            <span className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{t.label}</span>
                            {isActive && (
                              <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2"><Globe className="h-4 w-4" /> Langue</Label>
                    <Select value={profile.language} onValueChange={(v) => setProfile({ ...profile, language: v })}>
                      <SelectTrigger className="h-11 rounded-xl border-border/80 bg-muted/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={saveProfile} disabled={saving} className="rounded-xl gradient-primary text-primary-foreground gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Enregistrer
                  </Button>
                </motion.section>
              )}

              {active === "notifications" && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card space-y-6">
                  <div>
                    <h2 className="font-display text-lg font-bold text-foreground">Notifications</h2>
                    <p className="text-sm text-muted-foreground">Choisissez comment être informé</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-4">
                      <div>
                        <p className="font-medium text-foreground">Notifications par email</p>
                        <p className="text-sm text-muted-foreground">Mises à jour du dossier et messages importants</p>
                      </div>
                      <Switch checked={profile.notify_email} onCheckedChange={(v) => setProfile({ ...profile, notify_email: v })} />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-4">
                      <div>
                        <p className="font-medium text-foreground">Notifications push</p>
                        <p className="text-sm text-muted-foreground">Alertes en temps réel dans le navigateur</p>
                      </div>
                      <Switch checked={profile.notify_push} onCheckedChange={(v) => setProfile({ ...profile, notify_push: v })} />
                    </div>
                  </div>

                  <Button onClick={saveProfile} disabled={saving} className="rounded-xl gradient-primary text-primary-foreground gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Enregistrer
                  </Button>
                </motion.section>
              )}

              {active === "security" && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card space-y-6">
                  <div>
                    <h2 className="font-display text-lg font-bold text-foreground">Sécurité</h2>
                    <p className="text-sm text-muted-foreground">Modifier votre mot de passe</p>
                  </div>

                  <form onSubmit={updatePassword} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="next" className="text-sm font-medium">Nouveau mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="next"
                          type={showPwd ? "text" : "password"}
                          value={pwd.next}
                          onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                          placeholder="Min. 8 caractères"
                          className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors pr-11"
                        />
                        <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm" className="text-sm font-medium">Confirmer</Label>
                      <Input
                        id="confirm"
                        type={showPwd ? "text" : "password"}
                        value={pwd.confirm}
                        onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                        placeholder="••••••••"
                        className="h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors"
                      />
                    </div>
                    <Button type="submit" disabled={pwdLoading} className="rounded-xl gradient-primary text-primary-foreground gap-2">
                      {pwdLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                      Mettre à jour
                    </Button>
                  </form>
                </motion.section>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;