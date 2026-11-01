"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  id: number;
  title: string;
  options: { label: string; value: number }[];
};

const questions: Question[] = [
  {
    id: 1,
    title: "Quel est votre principal objectif d’investissement ?",
    options: [
      { label: "Préserver mon capital", value: 1 },
      { label: "Constituer une épargne disponible", value: 2 },
      { label: "Obtenir un revenu complémentaire", value: 3 },
      { label: "Préparer un projet futur", value: 4 },
      { label: "Faire croître mon capital à long terme", value: 5 },
    ],
  },
  {
    id: 2,
    title: "Quel est votre horizon d’investissement ?",
    options: [
      { label: "Moins d'un an", value: 1 },
      { label: "Entre 1 et 3 ans", value: 2 },
      { label: "Entre 3 et 5 ans", value: 3 },
      { label: "Entre 5 et 10 ans", value: 4 },
      { label: "Plus de 10 ans", value: 5 },
    ],
  },
  {
    id: 3,
    title: "Comment réagiriez-vous à une perte temporaire de 10 % ?",
    options: [
      { label: "Je vendrais immédiatement", value: 1 },
      { label: "Je serais très inquiet et envisagerais de vendre", value: 2 },
      { label: "Je serais inquiet, mais j'attendrais", value: 3 },
      { label: "Je conserverais mes placements", value: 4 },
      { label: "Je conserverais mes placements à long terme", value: 5 },
    ],
  },
  {
    id: 4,
    title: "Quelle fluctuation de votre portefeuille pourriez-vous accepter ?",
    options: [
      { label: "Aucune variation", value: 1 },
      { label: "De très faibles variations", value: 2 },
      { label: "Des variations modérées", value: 3 },
      { label: "Des variations importantes", value: 4 },
      { label: "Des variations très importantes", value: 5 },
    ],
  },
  {
    id: 5,
    title: "Quelle réserve d'urgence possédez-vous ?",
    options: [
      { label: "Aucune réserve", value: 1 },
      { label: "Moins d'un mois", value: 1 },
      { label: "Entre 1 et 3 mois", value: 2 },
      { label: "Entre 3 et 6 mois", value: 4 },
      { label: "Plus de 6 mois", value: 5 },
    ],
  },
  {
    id: 6,
    title: "Comment évaluez-vous vos charges financières ?",
    options: [
      { label: "Très importantes", value: 1 },
      { label: "Importantes", value: 2 },
      { label: "Modérées", value: 3 },
      { label: "Faibles", value: 4 },
      { label: "Aucune charge importante", value: 5 },
    ],
  },
  {
    id: 7,
    title: "Quand pourriez-vous avoir besoin de récupérer votre argent ?",
    options: [
      { label: "À tout moment", value: 1 },
      { label: "Dans les prochains mois", value: 2 },
      { label: "Dans 1 à 2 ans", value: 3 },
      { label: "Dans 3 à 5 ans", value: 4 },
      { label: "Après plus de 5 ans", value: 5 },
    ],
  },
  {
    id: 8,
    title: "Quelle importance accordez-vous à la disponibilité rapide de votre argent ?",
    options: [
      { label: "Essentielle", value: 1 },
      { label: "Très importante", value: 2 },
      { label: "Moyennement importante", value: 3 },
      { label: "Peu importante", value: 4 },
      { label: "Pas importante", value: 5 },
    ],
  },
  {
    id: 9,
    title: "Quel est votre niveau d'expérience en investissement ?",
    options: [
      { label: "Aucune expérience", value: 1 },
      { label: "Débutant", value: 2 },
      { label: "Quelques expériences", value: 3 },
      { label: "Expérience régulière", value: 4 },
      { label: "Expérience approfondie", value: 5 },
    ],
  },
  {
    id: 10,
    title: "Comment évaluez-vous vos connaissances financières ?",
    options: [
      { label: "Très faibles", value: 1 },
      { label: "Faibles", value: 2 },
      { label: "Moyennes", value: 3 },
      { label: "Bonnes", value: 4 },
      { label: "Très bonnes", value: 5 },
    ],
  },
];

function pedagogicalChip(id: number) {
  if (id === 1) {
    return {
      term: "Objectif d'investissement",
      definition: "L’intention qui guide l’allocation entre BTA, Actions et OPCVM.",
    };
  }
  if (id === 2) {
    return {
      term: "Horizon d'investissement",
      definition: "Durée pendant laquelle le capital peut rester investi.",
    };
  }
  if (id === 3 || id === 4) {
    return {
      term: "Profil de risque / Volatilité",
      definition: "Ampleur des variations des rendements (écart-type). Plus ce chiffre est élevé, plus le risque est grand.",
    };
  }
  if (id >= 5 && id <= 8) {
    return {
      term: "Liquidité",
      definition: "Facilité à récupérer votre argent, distincte de la VL d’un OPCVM.",
    };
  }
  return {
    term: "Expérience & Connaissances",
    definition: "Familiarité avec le coupon (BTA), le dividende (Actions) et la VL (OPCVM).",
  };
}

type ApiResult = {
  score: number;
  profil: string;
  description?: string;
  dimensions?: Record<string, number>;
  experience?: string;
  connaissance?: string;
  message?: string;
  allocation?: { BTA: number; Actions: number; OPCVM: number };
  volatilite?: number;
};

function FinSageLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#0A2E26" />
      <path
        d="M9.5 27.5 C12 16.5 19 10.5 30.5 8.5 C26.5 15 24.2 20.2 22.8 27.2 C19.2 22.4 14.2 24.6 9.5 27.5 Z"
        fill="#C59D3F"
      />
      <path
        d="M12 25.5 C17.2 19.8 22.4 14.6 28.8 10.8"
        fill="none"
        stroke="#F8F6F0"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Questionnaire() {
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const question = questions[currentQuestion];
  const progress = (Object.keys(answers).length / questions.length) * 100;
  const chip = pedagogicalChip(question.id);

  function selectAnswer(value: number) {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: value,
    }));
    setError("");
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion((current) => current - 1);
    }
  }

  async function submitQuestionnaire() {
    if (Object.keys(answers).length !== questions.length) {
      setError("Veuillez répondre à toutes les questions.");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      q1: answers[1],
      q2: answers[2],
      q3: answers[3],
      q4: answers[4],
      q5: answers[5],
      q6: answers[6],
      q7: answers[7],
      q8: answers[8],
      q9: answers[9],
      q10: answers[10],
    };

    try {
      const response = await fetch("http://localhost:8000/api/recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || "Erreur lors du calcul du profil.");
      }

      localStorage.setItem(
        "finsage_profile",
        JSON.stringify({
          ...data,
          answers: payload,
        })
      );

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de contacter le serveur Python."
      );
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <main className="min-h-screen bg-ivory px-4 py-12">
        <div className="animate-fade-in-up mx-auto max-w-2xl rounded-[24px] border border-card-border bg-white p-8 shadow-[0_10px_40px_rgba(10,46,38,.06)]">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4">
              <FinSageLogo size={56} />
            </div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Votre profil FinSage
            </p>
            <span className="mt-4 inline-block rounded-full bg-gold px-4 py-1.5 text-sm font-bold text-night">
              {result.profil}
            </span>
            <p className="mt-4 text-sage">Votre score pédagogique</p>
            <p className="mt-1 font-serif text-5xl font-semibold text-night">
              {result.score}/100
            </p>
          </div>

          {result.description && (
            <p className="rounded-xl bg-ivory p-4 text-center text-ink">{result.description}</p>
          )}

          {result.message && (
            <p className="mt-4 rounded-xl border border-gold/40 bg-[#F8F1E3] p-4 text-sm text-night">
              {result.message}
            </p>
          )}

          {result.dimensions && (
            <div className="mt-6">
              <h2 className="mb-3 font-serif font-semibold text-night">Détail de votre profil</h2>
              <div className="space-y-3">
                {Object.entries(result.dimensions).map(([name, value]) => (
                  <div key={name}>
                    <div className="mb-1 flex justify-between text-sm text-sage">
                      <span>{name}</span>
                      <span>{value}/5</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#F1EEE6]">
                      <div
                        className="h-full rounded-full bg-gold transition-all duration-700"
                        style={{
                          width: `${Math.max(0, Math.min(100, (value / 5) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-card-border bg-ivory p-4 text-sm text-sage">
            <p>Expérience : {result.experience || questions[8].options.find((o) => o.value === answers[9])?.label}</p>
            <p className="mt-1">
              Connaissances financières :{" "}
              {result.connaissance || questions[9].options.find((o) => o.value === answers[10])?.label}
            </p>
          </div>

          <p className="mt-6 rounded-xl border border-[#C4674A]/30 bg-[#F8EEEA] p-4 text-xs leading-5 text-night">
            Exemples pédagogiques — ne constituent pas des recommandations d’investissement.
            Cette classification est uniquement illustrative.
          </p>

          <button
            onClick={() => router.push("/")}
            className="mt-6 w-full rounded-xl bg-night px-6 py-3 font-semibold text-white transition hover:bg-emerald"
          >
            Retour au tableau de bord
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ivory px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <FinSageLogo />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">FinSage</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-night md:text-4xl">
            Découvrez votre profil d&apos;investisseur
          </h1>
          <p className="mt-3 text-sage">
            Répondez aux 10 questions pour obtenir une classification pédagogique de votre profil.
          </p>
        </div>

        <div className="fs-card mb-6 p-5">
          <div className="mb-2 flex justify-between text-sm text-sage">
            <span>
              Étape {currentQuestion + 1} / {questions.length}
            </span>
            <span>
              {Object.keys(answers).length}/{questions.length} réponses · {Math.round(progress)} %
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#F1EEE6]">
            <div
              className="h-full rounded-full bg-gold transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <section className="fs-card p-6 md:p-9">
          <div className="mb-5 flex items-center justify-between">
            <span className="rounded-full bg-[#F8F1E3] px-4 py-2 text-sm font-semibold text-night">
              Question {currentQuestion + 1} / {questions.length}
            </span>
            <span className="text-sm text-sage">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)} %
            </span>
          </div>

          <h2 className="mb-3 font-serif text-xl font-semibold leading-relaxed text-night md:text-2xl">
            {question.title}
          </h2>
          <div className="mb-7">
            <span className="inline-block rounded-full bg-night px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold">
              {chip.term}
            </span>
            <p className="mt-2 text-sm italic text-sage">{chip.definition}</p>
          </div>

          <div className="space-y-3">
            {question.options.map((option) => {
              const selected = answers[question.id] === option.value;

              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => selectAnswer(option.value)}
                  className={`w-full rounded-xl border p-4 text-left text-sm transition md:text-base ${
                    selected
                      ? "border-gold bg-[#F8F1E3] font-semibold text-night"
                      : "border-card-border bg-white text-sage hover:border-gold hover:bg-ivory"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        selected ? "border-gold bg-gold" : "border-card-border"
                      }`}
                    >
                      {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                    </span>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          {error && (
            <p className="mt-5 rounded-lg bg-[#F8EEEA] p-3 text-sm text-terracotta">{error}</p>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={previousQuestion}
              disabled={currentQuestion === 0 || loading}
              className="rounded-xl border border-card-border px-5 py-3 font-medium text-sage transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-40"
            >
              Précédent
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                type="button"
                disabled={answers[question.id] === undefined}
                onClick={() => setCurrentQuestion((current) => current + 1)}
                className="rounded-xl bg-night px-6 py-3 font-semibold text-white transition hover:bg-emerald disabled:cursor-not-allowed disabled:opacity-40"
              >
                Suivant
              </button>
            ) : (
              <button
                type="button"
                onClick={submitQuestionnaire}
                disabled={answers[question.id] === undefined || loading}
                className="rounded-xl bg-gold px-6 py-3 font-semibold text-night transition hover:bg-[#d4ae52] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Calcul en cours..." : "Calculer mon profil"}
              </button>
            )}
          </div>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-sage">
          FinSage est un simulateur pédagogique. Les résultats ne constituent pas des conseils
          financiers personnalisés. Données simulées à des fins pédagogiques uniquement.
        </p>
      </div>
    </main>
  );
}
