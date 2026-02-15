import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Shield, Users, FileCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "Gestion des apprenants",
    description: "Collectez et organisez les informations de vos apprenants efficacement.",
  },
  {
    icon: Shield,
    title: "Sécurité des données",
    description: "Protection RGPD et stockage sécurisé de toutes les données personnelles.",
  },
  {
    icon: FileCheck,
    title: "Suivi des dossiers",
    description: "Suivez la progression et le statut de chaque dossier en temps réel.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="gradient-hero text-primary-foreground">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            <span className="font-display text-xl font-bold">GestApprenants</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                S'inscrire
              </Button>
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl font-extrabold leading-tight md:text-6xl"
          >
            Système de gestion
            <br />
            <span className="text-accent">des apprenants</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80"
          >
            Plateforme moderne pour la collecte, le suivi et la validation des dossiers étudiants.
            Sécurisée, intuitive et conforme RGPD.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link to="/register">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 text-base px-8">
                Commencer <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Se connecter
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="font-display text-center text-3xl font-bold text-foreground">
          Tout ce dont vous avez besoin
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Une solution complète pour gérer les inscriptions et les dossiers de vos apprenants.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="rounded-xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-card-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 GestApprenants. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};

export default Index;
