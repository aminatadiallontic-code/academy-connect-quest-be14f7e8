import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      toast.success("Connexion réussie !");
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden gradient-hero lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center text-primary-foreground"
        >
          <GraduationCap className="mx-auto h-20 w-20 mb-6" />
          <h1 className="font-display text-4xl font-bold">GestApprenants</h1>
          <p className="mt-4 max-w-sm text-primary-foreground/70 text-lg">
            Gérez vos apprenants de manière simple, sécurisée et efficace.
          </p>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden flex items-center gap-2 text-primary">
            <GraduationCap className="h-8 w-8" />
            <span className="font-display text-xl font-bold">GestApprenants</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground">Connexion</h2>
          <p className="mt-1 text-muted-foreground">Accédez à votre espace personnel</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email ou téléphone</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="votre@email.com"
                  className="pl-10"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              S'inscrire
            </Link>
          </p>
          <p className="mt-2 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Retour à l'accueil
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
