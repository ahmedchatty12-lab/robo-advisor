from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="FinSage API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QuestionnairePayload(BaseModel):
    q1: int  # Objectif
    q2: int  # Horizon
    q3: int  # Perte 10%
    q4: int  # Fluctuation
    q5: int  # Réserve
    q6: int  # Charges financières
    q7: int  # Besoin argent
    q8: int  # Disponibilité
    q9: int  # Expérience
    q10: int  # Connaissances


@app.post("/api/recommendation")
def calculate_recommendation(data: QuestionnairePayload):
    total_score = sum(
        [data.q1, data.q2, data.q3, data.q4, data.q5, data.q6, data.q7, data.q8, data.q9, data.q10]
    )
    score_100 = int((total_score / 50) * 100)

    if score_100 < 45:
        profil = "Prudent"
        risk = "Faible"
        expected_return = 4.8
        volatilite = 3.8
        allocation = {"BTA": 60, "Actions": 10, "OPCVM": 30}
        message = "Votre profil indique une préférence pour la sécurité. L'allocation privilégie les BTA pour préserver le capital."
    elif score_100 < 75:
        profil = "Équilibré"
        risk = "Modéré"
        expected_return = 7.4
        volatilite = 7.2
        allocation = {"BTA": 40, "Actions": 35, "OPCVM": 25}
        message = "Vous cherchez un compromis entre sécurité et croissance. L'allocation mélange BTA, OPCVM et Actions."
    else:
        profil = "Dynamique"
        risk = "Élevé"
        expected_return = 12.6
        volatilite = 12.6
        allocation = {"BTA": 15, "Actions": 65, "OPCVM": 20}
        message = "Vous avez une forte tolérance au risque et un horizon long. L'allocation maximise les Actions."

    dimensions = {
        "Objectif & Horizon": (data.q1 + data.q2) / 2,
        "Tolérance au Risque": (data.q3 + data.q4) / 2,
        "Liquidité": (data.q5 + data.q6 + data.q7 + data.q8) / 4,
        "Expérience": (data.q9 + data.q10) / 2,
    }

    return {
        "score": score_100,
        "profil": profil,
        "risk": risk,
        "expected_return": expected_return,
        "volatilite": volatilite,
        "allocation": allocation,
        "dimensions": dimensions,
        "message": message,
        "description": f"Score pédagogique : {score_100}/100. Profil {profil}.",
    }
