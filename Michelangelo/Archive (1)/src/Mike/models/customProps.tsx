import { BaseFragment, CompetitorAnalysisFragment, FeaturesFragment, PersonaFragment, Recipe, RoadmapFragment, SwotAnalysisFragment, UnderstandingFragment } from "./response";

type BrainstormerProp = {
    recipe?: Recipe,
    base?: BaseFragment,
    understanding?: UnderstandingFragment[] | null,
    feature?: FeaturesFragment[] | null,
    swotAnalysis?: SwotAnalysisFragment | null,
    persona?:PersonaFragment | null,
    competitorAnalysis?:CompetitorAnalysisFragment | null,
    roadmap?:RoadmapFragment | null,
}

export type {BrainstormerProp};