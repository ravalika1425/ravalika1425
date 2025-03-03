export type SelectedElementType = ElementType & {
  xOffsets?: number[];
  yOffsets?: number[];
  offsetX?: number;
  offsetY?: number;
};

export interface ExtendedElementType extends ElementType {
  xOffsets?: number[];
  yOffsets?: number[];
}

export type ElementType = {

  image?: HTMLImageElement
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: ToolsType;
  tag?: string;

  // TODO: add type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roughElement?: any;
  offsetX?: number;
  offsetY?: number;
  position?: string | null;
  points?: { x: number; y: number }[];
  text?: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
};

export type ActionsType =
  | "writing"
  | "drawing"
  | "moving"
  | "multi_moving"
  | "panning"
  | "resizing"
  | "none"
  | "boundingBox" 
  | ""
  ;

export const Tools = {
  // pan: "pan",
  boundingBox: "boundingBox",
  selection: "selection",
  rectangle: "rectangle",
  line: "line",
  pencil: "pencil",
  text: "text",
  erease:"erease",
  importImage: "importImage"
 
};

export type ToolsType = (typeof Tools)[keyof typeof Tools];

export type PointType = { x: number; y: number };

export type BoundingBox = {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: ToolsType;
  tag: string;  // Make sure this is not optional
};