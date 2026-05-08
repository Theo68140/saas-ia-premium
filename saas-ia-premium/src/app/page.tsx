"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const features = [
  "Gestion clients augmentée par IA",
  "Chatbot IA omnicanal 24/7",
  "CRM intelligent avec scoring prédictif",
  "Suivi automatisé des leads",
  "Emails automatiques ultra personnalisés",
  "Notifications et relances en temps réel",
  "Workflows IA no-code",
  "Reporting exécutif instantané",
];

const stats = [
  { label: "Leads qualifiés", value: "+187%" },
  { label: "Temps opérationnel gagné", value: "21h/sem" },
  { label: "Taux de conversion", value: "+42%" },
  { label: "ROI moyen à 90 jours", value: "6.4x" },
];

const pricing = [
  { name: "Scale", price: "499EUR", desc: "Pour PME en forte croissance", cta: "Demander une démo", highlight: false },
  { name: "Elite", price: "1 490EUR", desc: "Pour équipes sales et ops avancées", cta: "Parler à un expert", highlight: true },
  { name: "Infinity", price: "Sur-mesure", desc: "Architecture IA dédiée entreprise", cta: "Contacter l'équipe", highlight: false },
];

const testimonials = [
  {
    quote: "En 6 semaines, nous avons multiplié notre pipeline par 2.8 avec moins d'effort commercial.",
    name: "Amelie G.",
    role: "CEO, Nova Conseil",
  },
  {
    quote: "Le niveau de finition et la puissance des workflows IA ont transformé notre organisation.",
    name: "Mehdi B.",
    role: "COO, Kinetic Group",
  },
  {
    quote: "Enfin une plateforme IA premium pensée pour les PME ambitieuses, sans compromis.",
    name: "Sophie R.",
    role: "Head of Growth, Frameo",
  },
];

const objections = [
  {
    title: "Mise en place complexe ?",
    answer: "On deploie vos premiers workflows en moins de 10 jours avec accompagnement dedie.",
  },
  {
    title: "Equipe non technique ?",
    answer: "Interface no-code + templates IA preconfigures pour vos equipes commerciales et operations.",
  },
  {
    title: "ROI incertain ?",
    answer: "Pilotage KPI temps reel, objectifs clairs et sprint d'optimisation des 30 premiers jours.",
  },
];

const faqs = [
  {
    q: "Combien de temps pour voir des resultats ?",
    a: "La plupart des PME constatent un impact mesurable entre la semaine 2 et la semaine 6.",
  },
  {
    q: "Puis-je connecter mes outils existants ?",
    a: "Oui, CRM, emailing, formulaires, support et outils de notification sont connectables rapidement.",
  },
  {
    q: "Proposez-vous un accompagnement strategique ?",
    a: "Oui, chaque client premium dispose d'un architecte IA et d'un plan de croissance trimestriel.",
  },
];

const beforeAfter = [
  { metric: "Temps de reponse lead", before: "4h12", after: "6 min" },
  { metric: "Taches manuelles / semaine", before: "37", after: "8" },
  { metric: "Conversion lead > client", before: "9.4%", after: "16.8%" },
];

const heroVariants = {
  a: {
    badge: "Automatisation IA pour PME ambitieuses",
    title: "Le moteur IA premium qui automatise vos ventes et operations.",
    subtitle:
      "Centralisez CRM, chatbot, relances emails, workflows et reporting dans une experience fluide, elegante et concue pour convertir.",
  },
  b: {
    badge: "Plateforme revenue ops augmentee",
    title: "Scalez votre croissance avec une execution IA elite, sans friction.",
    subtitle:
      "Activez des workflows intelligents sur tout le cycle client pour gagner du temps, augmenter les conversions et piloter un ROI mesurable.",
  },
} as const;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Neuraxis AI",
  url: "https://neuraxis.ai",
  description: "Automatisation IA premium pour PME ambitieuses.",
  sameAs: [],
};

type HeroVariant = keyof typeof heroVariants;

export default function Home() {
  const [variant, setVariant] = useState<HeroVariant>("a");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [leadStep, setLeadStep] = useState(1);
  const [leadForm, setLeadForm] = useState({
    fullName: "",
    email: "",
    company: "",
    employees: "",
    goals: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forcedVariant = params.get("variant");
    if (forcedVariant === "a" || forcedVariant === "b") {
      setVariant(forcedVariant);
      localStorage.setItem("hero_variant", forcedVariant);
      return;
    }

    const stored = localStorage.getItem("hero_variant");
    if (stored === "a" || stored === "b") {
      setVariant(stored);
      return;
    }

    const selected = Math.random() > 0.5 ? "a" : "b";
    setVariant(selected);
    localStorage.setItem("hero_variant", selected);
  }, []);

  const hero = useMemo(() => heroVariants[variant], [variant]);

  const trackEvent = (event: string, params: Record<string, string | number>) => {
    if (typeof window === "undefined") return;
    const maybeGtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (maybeGtag) {
      maybeGtag("event", event, params);
    }
  };

  const updateLeadField = (field: keyof typeof leadForm, value: string) => {
    setLeadForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitMessage("");
    setIsSubmitting(true);

    const payload = {
      fullName: leadForm.fullName,
      email: leadForm.email,
      company: leadForm.company,
      employees: leadForm.employees,
      goals: leadForm.goals,
      heroVariant: variant,
      source: "landing-page",
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erreur de soumission");
      }

      trackEvent("generate_lead", { channel: "landing_form", hero_variant: variant });
      setSubmitMessage("Merci, votre demande a bien ete envoyee. Notre equipe vous contacte rapidement.");
      setLeadForm({ fullName: "", email: "", company: "", employees: "", goals: "" });
      setLeadStep(1);
    } catch {
      setSubmitMessage("Une erreur est survenue. Merci de reessayer ou de nous contacter directement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-surface bg-hero-radial px-6 pb-28 pt-6 text-slate-100 md:px-10 md:pb-16">
      <div className="mesh-aurora" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="glass sticky top-4 z-40 mb-16 flex items-center justify-between rounded-2xl px-4 py-3 md:px-6">
          <span className="text-lg font-semibold tracking-wide">Neuraxis AI</span>
          <div className="hidden gap-6 text-sm text-slate-300 md:flex">
            <a href="#features">Fonctionnalites</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </div>
          <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90">
            Reserver une demo
          </button>
        </header>

        <section className="mb-20 grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-3 inline-flex rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
              {hero.badge}
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              {hero.title.includes("IA premium") ? (
                <>
                  Le moteur <span className="gradient-text">IA premium</span> qui automatise vos ventes et operations.
                </>
              ) : (
                hero.title
              )}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">{hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <motion.a
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                href="#contact"
                className="rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 px-6 py-3 font-semibold text-slate-950"
                onClick={() => trackEvent("cta_click", { cta_id: "hero_primary", hero_variant: variant })}
              >
                Demarrer maintenant
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                href="#features"
                className="glass rounded-xl px-6 py-3 font-semibold"
                onClick={() => trackEvent("cta_click", { cta_id: "hero_secondary", hero_variant: variant })}
              >
                Voir la plateforme
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="glass relative rounded-3xl p-5 shadow-glow"
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-4 flex items-center justify-between text-xs text-slate-300">
              <span>Dashboard IA Live</span>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-emerald-300">+38% ce mois</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <p className="text-sm text-slate-300">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-white/15 bg-black/30 p-4">
              <p className="text-sm text-slate-300">Workflow IA actif</p>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="rounded-lg bg-cyan-300/20 px-3 py-2 text-cyan-200">Nouveau lead</span>
                <span>></span>
                <span className="rounded-lg bg-violet-300/20 px-3 py-2 text-violet-200">Qualification GPT</span>
                <span>></span>
                <span className="rounded-lg bg-emerald-300/20 px-3 py-2 text-emerald-200">Email auto</span>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mb-20">
          <div className="glass rounded-3xl p-7">
            <h2 className="text-3xl font-semibold md:text-4xl">Avant / Apres Neuraxis AI</h2>
            <p className="mt-2 text-slate-300">Preuve de performance pour dirigeants PME: moins d'operations, plus de revenus.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {beforeAfter.map((item) => (
                <article key={item.metric} className="rounded-2xl border border-white/15 bg-white/5 p-5">
                  <p className="text-sm text-slate-300">{item.metric}</p>
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-black/30 px-3 py-2 text-sm">
                    <span className="text-rose-300">Avant: {item.before}</span>
                    <span className="text-emerald-300">Apres: {item.after}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="mb-20">
          <h2 className="mb-6 text-3xl font-semibold md:text-4xl">Fonctionnalites clés pour scaler rapidement</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.article
                key={feature}
                className="glass rounded-2xl p-5"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
              >
                <span className="mb-3 inline-block rounded-lg bg-white/10 px-2 py-1 text-xs">Module {i + 1}</span>
                <p className="text-sm text-slate-200">{feature}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mb-20 grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-3xl p-6">
            <h3 className="text-2xl font-semibold">Mockup Dashboard Premium</h3>
            <p className="mt-2 text-sm text-slate-300">Vue executive avec KPIs, funnel, revenus et alertes IA.</p>
            <div className="mt-5 space-y-3">
              <div className="h-4 w-2/3 rounded-full bg-gradient-to-r from-cyan-200/80 to-cyan-500/40" />
              <div className="h-4 w-full rounded-full bg-white/10" />
              <div className="h-4 w-4/5 rounded-full bg-white/10" />
              <div className="h-28 rounded-2xl border border-white/15 bg-white/5" />
            </div>
          </div>
          <div className="glass rounded-3xl p-6">
            <h3 className="text-2xl font-semibold">Visuel Workflows IA</h3>
            <p className="mt-2 text-sm text-slate-300">Builder visuel pour orchestrer chaque etape du cycle client.</p>
            <div className="mt-6 space-y-3 text-sm">
              {["Trigger: formulaire web", "AI: scoring lead + intent", "Action: creation CRM", "Action: email + notification equipe"].map((line) => (
                <div key={line} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-20 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="glass rounded-2xl p-5">
              <p className="text-sm leading-relaxed text-slate-200">"{testimonial.quote}"</p>
              <p className="mt-4 font-semibold">{testimonial.name}</p>
              <p className="text-xs text-slate-400">{testimonial.role}</p>
            </div>
          ))}
        </section>

        <section id="pricing" className="mb-20">
          <h2 className="mb-6 text-3xl font-semibold md:text-4xl">Pricing premium, orienté performance</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {pricing.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-3xl p-6 ${plan.highlight ? "border border-cyan-300/60 bg-cyan-300/10" : "glass"}`}
              >
                <p className="text-sm text-slate-300">{plan.name}</p>
                <p className="mt-3 text-3xl font-semibold">{plan.price}</p>
                <p className="mt-2 text-sm text-slate-300">{plan.desc}</p>
                <button className="mt-6 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950">
                  {plan.cta}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-20 grid gap-5 md:grid-cols-3">
          {objections.map((item, index) => (
            <motion.article
              key={item.title}
              className="glass rounded-2xl p-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <p className="text-base font-semibold">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.answer}</p>
            </motion.article>
          ))}
        </section>

        <section className="mb-20">
          <div className="glass rounded-3xl p-7">
            <h2 className="text-3xl font-semibold md:text-4xl">FAQ Decision Makers</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {faqs.map((faq) => (
                <article key={faq.q} className="rounded-2xl border border-white/15 bg-white/5 p-5">
                  <p className="font-semibold">{faq.q}</p>
                  <p className="mt-2 text-sm text-slate-300">{faq.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="glass mb-20 rounded-3xl p-8">
          <h2 className="text-3xl font-semibold">Recevoir une strategie IA sur-mesure</h2>
          <p className="mt-2 max-w-2xl text-slate-300">
            Demande de demo haut de gamme: analyse de vos process, estimation ROI et blueprint d'automatisation.
          </p>
          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleLeadSubmit}>
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-300 md:col-span-2">
              <span className={`rounded-full px-2 py-1 ${leadStep >= 1 ? "bg-cyan-300/20 text-cyan-200" : "bg-white/10"}`}>1. Infos</span>
              <span className={`rounded-full px-2 py-1 ${leadStep >= 2 ? "bg-cyan-300/20 text-cyan-200" : "bg-white/10"}`}>2. Objectifs</span>
            </div>

            {leadStep === 1 ? (
              <>
                <input
                  name="fullName"
                  value={leadForm.fullName}
                  onChange={(e) => updateLeadField("fullName", e.target.value)}
                  className="rounded-xl border border-white/20 bg-black/30 px-4 py-3 outline-none focus:border-cyan-300"
                  placeholder="Nom complet"
                  type="text"
                  required
                />
                <input
                  name="email"
                  value={leadForm.email}
                  onChange={(e) => updateLeadField("email", e.target.value)}
                  className="rounded-xl border border-white/20 bg-black/30 px-4 py-3 outline-none focus:border-cyan-300"
                  placeholder="Email professionnel"
                  type="email"
                  required
                />
                <input
                  name="company"
                  value={leadForm.company}
                  onChange={(e) => updateLeadField("company", e.target.value)}
                  className="rounded-xl border border-white/20 bg-black/30 px-4 py-3 outline-none focus:border-cyan-300"
                  placeholder="Entreprise"
                  type="text"
                  required
                />
                <input
                  name="employees"
                  value={leadForm.employees}
                  onChange={(e) => updateLeadField("employees", e.target.value)}
                  className="rounded-xl border border-white/20 bg-black/30 px-4 py-3 outline-none focus:border-cyan-300"
                  placeholder="Nombre d'employes"
                  type="text"
                />
                <button
                  type="button"
                  className="rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 px-6 py-3 font-semibold text-slate-950 md:col-span-2"
                  onClick={() => {
                    if (!leadForm.fullName || !leadForm.email || !leadForm.company) {
                      setSubmitMessage("Merci de remplir nom, email et entreprise.");
                      return;
                    }
                    setSubmitMessage("");
                    setLeadStep(2);
                    trackEvent("funnel_step", { step: 2, hero_variant: variant });
                  }}
                >
                  Continuer
                </button>
              </>
            ) : (
              <>
                <textarea
                  name="goals"
                  value={leadForm.goals}
                  onChange={(e) => updateLeadField("goals", e.target.value)}
                  className="rounded-xl border border-white/20 bg-black/30 px-4 py-3 outline-none focus:border-cyan-300 md:col-span-2"
                  placeholder="Vos objectifs business"
                  rows={4}
                  required
                />
                <div className="flex gap-3 md:col-span-2">
                  <button
                    type="button"
                    className="glass w-full rounded-xl px-6 py-3 font-semibold"
                    onClick={() => setLeadStep(1)}
                  >
                    Retour
                  </button>
                  <button
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 px-6 py-3 font-semibold text-slate-950"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Envoi en cours..." : "Obtenir ma demo strategique"}
                  </button>
                </div>
              </>
            )}
            {submitMessage ? <p className="text-sm text-slate-300 md:col-span-2">{submitMessage}</p> : null}
          </form>
        </section>

        <footer className="glass rounded-2xl px-6 py-8 text-sm text-slate-300">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-lg font-semibold text-slate-100">Neuraxis AI</p>
              <p className="mt-1 text-xs text-slate-400">Automatisation IA premium pour PME ambitieuses.</p>
            </div>
            <div className="flex gap-6">
              <a href="#features">Produit</a>
              <a href="#pricing">Tarifs</a>
              <a href="#contact">Contact</a>
            </div>
            <button className="rounded-xl border border-white/20 px-4 py-2 text-slate-100">Parler a un expert</button>
          </div>
        </footer>
      </div>

      <div className="fixed bottom-4 left-1/2 z-50 w-[92%] -translate-x-1/2 md:hidden">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-3">
          <div>
            <p className="text-xs text-slate-400">Demarrage en 10 jours</p>
            <p className="text-sm font-semibold">Reserve ta demo premium</p>
          </div>
          <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950">Demarrer</button>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 hidden xl:block">
        <div className="glass w-80 rounded-2xl p-4">
          <p className="text-xs text-slate-400">Offre Elite la plus choisie</p>
          <p className="mt-1 text-sm font-semibold">Demonstration executive en 30 min</p>
          <a
            href="#contact"
            onClick={() => trackEvent("cta_click", { cta_id: "sticky_desktop", hero_variant: variant })}
            className="mt-3 block rounded-xl bg-white px-4 py-2 text-center text-sm font-semibold text-slate-950"
          >
            Reserver ma demo
          </a>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
    </main>
  );
}
