import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Mail, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Veuillez saisir votre email");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
    toast.success("Email envoyé ! Vérifiez votre boîte de réception.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">Mon Parcours</span>
          </div>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Retour
            </Button>
          </Link>
        </div>

        <div className="mb-1 inline-flex items-center gap-1.5 text-sm text-accent font-medium">
          <Sparkles className="h-3.5 w-3.5" /> Mot de passe oublié
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Réinitialisation
        </h2>
        <p className="mt-2 text-muted-foreground">
          Saisissez votre email pour recevoir un lien de réinitialisation
        </p>

        {sent ? (
          <div className="mt-8 rounded-xl border border-border bg-muted/30 p-6 text-center">
            <p className="text-sm text-foreground">
              Un email a été envoyé à <strong>{email}</strong>.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Cliquez sur le lien reçu pour définir votre nouveau mot de passe.
            </p>
            <Link to="/login">
              <Button variant="outline" className="mt-6 w-full">
                Retour à la connexion
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  className="pl-11 h-11 rounded-xl border-border/80 bg-muted/30 focus:bg-card transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl gradient-primary btn-shine text-base font-semibold shadow-primary-glow"
              disabled={loading}
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
            </Button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Vous vous souvenez de votre mot de passe ?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
