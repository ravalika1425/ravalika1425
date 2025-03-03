interface UnderstandingFragment {
  appName?: string;
  summary?: string; // a short one sentence summary of the app
  problem?: string[]; // List of problems that the app solves
  alternatives?: string[]; // List of alternative apps similar to our product
  solutions?: string[]; // List of solutions to the problem
  keyMetrics?: string[]; // List of key metrics for the app
  valueProposition?: string[]; // List of value propositions of the app
  highLevelConcepts?: string[]; // List of high level concepts on what the app does
  unfairAdvantage?: string[]; // List of unfair advantages of the app
  costStructure?: string[]; // List of cost structure of the app
  earlyAdopters?: string[]; // List of early adopters of the app
  revenueStreams?: string[]; // List of revenue streams of the app
  customerSegments?: string[]; // List of customer segments of the app
}

interface SchemaFeature {
  title: string; // "Title of the feature"
  description: string[]; // "Description of the feature"
  tags: string[]; // "Tags that specify the feature"
}

interface FeaturesFragment {
  // PascalCase for consistency
  mustHave: SchemaFeature[]; // alias for must_have; "A list of must have features"
  shouldHave: SchemaFeature[]; // alias for should_have; "A list of should have features"
  couldHave: SchemaFeature[]; // alias for could_have; "Description of the feature"
  wontHave: SchemaFeature[]; // alias for could_have; "Description of the feature"
}

interface JiraRequest {
  appType: string;
  domain: string;
  epics: Epic[];
}

interface Recipe {
  name: string;
  userSignature : string;
  recipeSettings: RecipeSettings;
}

interface RecipeSettings {
  temperature: number;
}
interface BaseFragment {
  name: string;
  vertical: string;
  idea: string;
  strategy: string;
  competitors: string;
  natureOfBusiness: string;
  painPoints: string;
  userType: string[];
}

interface Details {
  title: string;
  description: string;
}
interface SwotAnalysisFragment {
  strength?: Details[];
  weakness?: Details[];
  opportunity?: Details[];
  threat?: Details[];
}
interface UserSchema {
  name: string;
  gender: string;
  age?: number;
  profession: string;
  education?: string;
}

interface RoleSchema {
  title: string;
  industry: string;
  level: string;
  decisionMakingPower: string;
}
interface PersonaFragment {
  userType: string;
  demographics: UserSchema;
  role: RoleSchema;
  motivation: string[];
  painPoints: string[];
  goals: string[];
  expectations: string[];
  laptopUsage: number;
  tabletUsage: number;
  smartphoneUsage: number;
}


interface Feature {
  title: string;
  status: "available" | "premium" | "not-available";
}
interface CompetitorAnalysisFragment {
  domain: string;
  data: Competitor[];
}
interface Competitor {
  competitor: string; features: Feature[];
}

interface Epic {
  id: string;
  title: string;
  description: string;
  additionalDetails: string; // alias for additional_details
}
interface Milestone {
  name: string;
  epics: Epic[];
}
interface RoadmapFragment {
  // PascalCase for consistency
  domain: string; // "Domain of the application, example: Healthcare, Finance, Retail, Manufacturing"
  appType: string; // alias for app_type; "Mobile or web"
  milestones: Milestone[]; // "List of key milestones to achieve"
  summary: string; // "A summary of the project based on input data"
}

interface BrainstormerRequest {
  recipe?: Recipe;
  base?: BaseFragment | null;
  understanding?: UnderstandingFragment | null;
  feature?: FeaturesFragment | null;
  swotAnalysis?: SwotAnalysisFragment | null;
  persona?: PersonaFragment[] | null;
  competitorAnalysis?: CompetitorAnalysisFragment | null;
  roadmap?: RoadmapFragment | null;
  userSignature?:userSignatureFragment | null;
}

interface userSignatureFragment{
  userSignature ?:string;
}
interface BoundingBox {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  tag: string;
  dataUri: string;
}
type UserMessage = {
  id: number;
  from_id: number;
  to_id: number;
  msg: string | null;
  reply: { sender: string; msg: string; id: number };
  isImages: boolean;
  has_images: { id: number; image: string }[];
  datetime: string;
};

type userMessagesType = {
  id: number;
  roomId: number;
  sender: string;
  createdAt: string;
  usermessages: UserMessage[];
};

interface GrapesJSProps {
  html: string;
  cssUrl: string;
  design: string;
  setHtml: React.Dispatch<
    React.SetStateAction<{
      design: string;
      code: string;
    } | null>
  >;
  setShowGrapes: React.Dispatch<React.SetStateAction<boolean>>;
}

interface WireframeRecepiModalProps {
  isOpen: boolean;
  toggle: (state: any) => void;
  onSubmit: (data: React.SetStateAction<null>) => void;
  closeCard: boolean;
  handleCloseClick: () => void;
  setProjectName: (name: React.SetStateAction<string>) => void;
}



interface FormErrors {
  appName: string;
  appDescription: string;
  industry: string;
  otherIndustry: string;
  designSystem: string;
}

interface Element {
  type: string;
  tag: string;
  label?: string;
  inputType?: string;
  links?: string[];
}

interface Subsection {
  subsection: string;
  description: string;
  elements: Element[];
}

interface Section {
  section: string;
  description: string;
  elements?: Element[];
  subsections?: Subsection[];
}

interface SitemapData {
  userPrompt: string;
  goal: string;
  domain: string;
  designSystem: string;
  layout: Section[];
}

// Define types for props
interface SitemapModalProps {
  isOpen: boolean;
  toggle: () => void;
  sitemapData: SitemapData | null; // Allow sitemapData to be null
  setGeneratedResponse: React.Dispatch<
    React.SetStateAction<{
      design: string;
      code: string;
    } | null>
  >;
}

export type {
  Epic,
  Milestone,
  JiraRequest,
  Details,
  UnderstandingFragment,
  SchemaFeature,
  BrainstormerRequest,
  FeaturesFragment,
  Recipe,
  RecipeSettings,
  BaseFragment,
  SwotAnalysisFragment,
  UserSchema,
  RoleSchema,
  PersonaFragment,
  CompetitorAnalysisFragment,
  RoadmapFragment,
  BoundingBox,
  userMessagesType,
  UserMessage,
  GrapesJSProps,
  WireframeRecepiModalProps,
  FormErrors,
  SitemapModalProps,
};
