import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Shield, Users, FileCheck, ArrowRight, Sparkles, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "Gestion centralisée",
    description: "Collectez, organisez et suivez les dossiers de tous vos apprenants depuis une interface unique.",
    color: "bg-primary/8 text-primary",
  },
  {
    icon: Shield,
    title: "Sécurité renforcée",
    description: "Protection RGPD intégrée, chiffrement des données et stockage sécurisé certifié.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: FileCheck,
    title: "Validation instantanée",
    description: "Workflow de validation intelligent avec notifications et suivi en temps réel.",
    color: "bg-info/10 text-info",
  },
];

const stats = [
  { value: "2k+", label: "Apprenants gérés" },
  { value: "98%", label: "Taux de complétion" },
  { value: "15min", label: "Temps moyen d'inscription" },
  { value: "24/7", label: "Disponibilité" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-strong">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-primary-glow">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground tracking-tight">Mon Parcours</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="gradient-accent text-accent-foreground btn-shine shadow-sm">
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative gradient-hero text-primary-foreground pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* Background effects */}
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute top-20 right-[15%] h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute bottom-10 left-[10%] h-56 w-56 rounded-full bg-primary-foreground/5 blur-[80px]" />

        <div className="container relative mx-auto px-4 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/8 px-4 py-1.5 text-sm text-primary-foreground/80 backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Plateforme de gestion nouvelle génération
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-extrabold leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Gérez vos apprenants
            <br />
            <span className="text-gradient-light">avec intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-primary-foreground/65 leading-relaxed"
          >
            La solution complète pour la collecte, le suivi et la validation des dossiers étudiants. 
            Sécurisée, intuitive et conforme RGPD.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link to="/register">
              <Button size="lg" className="gradient-accent text-accent-foreground btn-shine gap-2 text-base px-8 h-12 shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-shadow">
                Commencer gratuitement <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-base px-8 h-12 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground backdrop-blur-sm">
                Se connecter
              </Button>
            </Link>
          </motion.div>

          {/* Floating cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 mx-auto max-w-3xl"
          >
            <div className="relative rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-sm p-1">
              <div className="rounded-xl bg-card/95 p-4 sm:p-6 shadow-elevated">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="text-center"
                    >
                      <p className="text-2xl sm:text-3xl font-display font-extrabold text-primary">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features */}
      <section className="container mx-auto px-4 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent mb-3">
            <Zap className="h-4 w-4" /> Fonctionnalités
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Une solution complète conçue pour simplifier la gestion des inscriptions et des dossiers.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card card-hover"
            >
              <div className="absolute inset-0 rounded-2xl gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-card-foreground">{f.title}</h3>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl gradient-primary px-6 py-14 sm:px-14 sm:py-20 text-center"
        >
          <div className="absolute inset-0 dot-pattern opacity-20" />
          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm">
              <BarChart3 className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
              Prêt à transformer votre gestion ?
            </h2>
            <p className="mx-auto max-w-md text-primary-foreground/65 mb-8">
              Rejoignez les établissements qui font confiance à Mon Parcours pour gérer leurs dossiers étudiants.
            </p>
            <Link to="/register">
              <Button size="lg" className="gradient-accent text-accent-foreground btn-shine gap-2 px-10 h-12 shadow-lg">
                Démarrer maintenant <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-sm font-bold text-foreground">Mon Parcours</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Mon Parcours. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
