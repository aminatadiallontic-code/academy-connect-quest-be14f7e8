import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Connexion réussie !");
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden gradient-hero lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:p-12 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-20 right-10 h-40 w-40 rounded-full bg-accent/10 blur-[80px]" />
        <div className="absolute bottom-20 left-10 h-56 w-56 rounded-full bg-primary-foreground/5 blur-[60px]" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative text-center text-primary-foreground"
        >
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/10">
            <GraduationCap className="h-10 w-10" />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight">GestApprenants</h1>
          <p className="mt-4 max-w-sm text-primary-foreground/60 text-lg leading-relaxed">
            Gérez vos apprenants de manière simple, sécurisée et efficace.
          </p>

          {/* Floating feature badges */}
          <div className="mt-10 space-y-3">
            {["Gestion simplifiée", "Conforme RGPD", "Support 24/7"].map((text, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/8 border border-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground/70 mr-2"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                {text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">GestApprenants</span>
            </div>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" /> Retour
              </Button>
            </Link>
          </div>

          <div className="mb-1 inline-flex items-center gap-1.5 text-sm text-accent font-medium">
            <Sparkles className="h-3.5 w-3.5" /> Bienvenue
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Connexion</h2>
          <p className="mt-2 text-muted-foreground">Accédez à votre espace personnel</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email ou téléphone</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="votre@email.com"
                  className="pl-11 h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 rounded-xl gradient-primary btn-shine text-base font-semibold shadow-primary-glow" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                S'inscrire
              </Link>
            </p>
            <Link to="/" className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
