"""FinSage Robo-Advisor pédagogique
Lancer avec : uvicorn app:app --reload --port 8000
API : http://localhost:8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class QuestionnairePayload(BaseModel):
    q1: int = Field(..., ge=1, le=5)
    q2: int = Field(..., ge=1, le=5)
    q3: int = Field(..., ge=1, le=5)
    q4: int = Field(..., ge=1, le=5)
    q5: int = Field(..., ge=1, le=5)
    q6: int = Field(..., ge=1, le=5)
    q7: int = Field(..., ge=1, le=5)
    q8: int = Field(..., ge=1, le=5)
    q9: int = Field(..., ge=1, le=5)
    q10: int = Field(..., ge=1, le=5)


PROFILES = {
    "prudent": {
        "name": "Prudent",
        "description": "Préserver votre capital avec une progression régulière.",
        "allocation": {"BTA": 60, "OPCVM": 30, "Actions": 10},
        "expected_return": 4.8,
        "risk": "Faible",
        "volatilite": 3.8,
    },
    "equilibre": {
        "name": "Équilibré",
        "description": "Un compromis entre croissance et stabilité sur le long terme.",
        "allocation": {"BTA": 40, "OPCVM": 25, "Actions": 35},
        "expected_return": 7.4,
        "risk": "Modéré",
        "volatilite": 7.2,
    },
    "dynamique": {
        "name": "Dynamique",
        "description": "Favoriser la croissance en acceptant des variations plus fortes.",
        "allocation": {"BTA": 15, "OPCVM": 20, "Actions": 65},
        "expected_return": 12.6,
        "risk": "Élevé",
        "volatilite": 12.6,
    },
}

EXPERIENCE_LABELS = {
    1: "Aucune expérience",
    2: "Débutant",
    3: "Quelques expériences",
    4: "Expérience régulière",
    5: "Expérience approfondie",
}

KNOWLEDGE_LABELS = {
    1: "Très faibles",
    2: "Faibles",
    3: "Moyennes",
    4: "Bonnes",
    5: "Très bonnes",
}


def calculate_investor_profile(data: dict):
    answers = {f"q{i}": data[f"q{i}"] for i in range(1, 11)}

    objective = answers["q1"]
    horizon = answers["q2"]
    tolerance = (answers["q3"] + answers["q4"]) / 2
    capacity = (answers["q5"] + answers["q6"]) / 2
    liquidity = (answers["q7"] + answers["q8"]) / 2

    score = (
        10 * (objective - 1) / 4
        + 20 * (horizon - 1) / 4
        + 30 * (tolerance - 1) / 4
        + 25 * (capacity - 1) / 4
        + 15 * (liquidity - 1) / 4
    )
    score = round(score, 1)

    blocage_dynamique = (
        answers["q2"] == 1
        or answers["q5"] <= 1
        or answers["q7"] <= 2
        or answers["q6"] == 1
    )

    if score < 40:
        profile_key = "prudent"
    elif score < 70:
        profile_key = "equilibre"
    else:
        profile_key = "dynamique"

    message = ""
    if blocage_dynamique and profile_key == "dynamique":
        profile_key = "equilibre"
        message = (
            "Votre score initial indiquait un profil dynamique, "
            "mais une règle de sécurité limite votre classification "
            "au profil équilibré."
        )

    profile = PROFILES[profile_key]
    allocation = profile["allocation"]
    if sum(allocation.values()) != 100:
        raise ValueError("L'allocation pédagogique doit totaliser 100.")

    return {
        "score": score,
        "profil": profile["name"],
        "profile_key": profile_key,
        "description": profile["description"],
        "risk": profile["risk"],
        "allocation": allocation,
        "expected_return": profile["expected_return"],
        "volatilite": profile["volatilite"],
        "dimensions": {
            "Objectif": round(objective, 1),
            "Horizon": round(horizon, 1),
            "Tolérance au risque": round(tolerance, 1),
            "Capacité financière": round(capacity, 1),
            "Liquidité": round(liquidity, 1),
        },
        "experience": EXPERIENCE_LABELS[answers["q9"]],
        "connaissance": KNOWLEDGE_LABELS[answers["q10"]],
        "message": message,
        "blocage_dynamique": blocage_dynamique,
    }


app = FastAPI(title="FinSage API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "FinSage API fonctionne",
        "routes": ["/api/profiles", "/api/recommendation"],
    }


@app.get("/api/profiles")
def list_profiles():
    return PROFILES


@app.post("/api/recommendation")
def recommendation(payload: QuestionnairePayload):
    try:
        return calculate_investor_profile(payload.model_dump())
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
