//Enum for Tetromino Type
export enum TetroType {
  Line,
  Snake,
  Square,
  Tee,
  Leg,
  ReverseLeg,
  ReverseSnake,
}

export interface Tetro {
  type: TetroType;
  coords: [number, number][];
  color: string;
}

export type Grid = any[][];

//Themes Enum
export enum Themes {
  ColorTheme1,
}

export enum Styles { /// For style purposes
  Line,
  Snake,
  Square,
  Tee,
  Leg,
  ReverseLeg,
  ReverseSnake,
  Button,
  Borders,
  Grid,
  Body,
}

//Color Themes
const ColorTheme1 = {
  [Styles.Line]: "#FFBE0B",
  [Styles.Snake]: "#FB5607",
  [Styles.Square]: "#FF006E",
  [Styles.Tee]: "#8338EC",
  [Styles.Leg]: "#3A86FF",
  [Styles.ReverseLeg]: "#0096D2",
  [Styles.ReverseSnake]: "#00ECB7",
  [Styles.Body]: "theme-1",
} as Record<Styles, string>;

export const ColorTheme = {
  [Themes.ColorTheme1]: ColorTheme1,
} as Record<Themes, {}>;

//Type for Tetromino Coords
export type TetroCoords = [number, number][];

//Each shape has a origin block inside of it coordinates which changes depending on shape.
//Record that maps the TetroType to an origin
export const rotationOrigins = {
  [TetroType.Line]: 1,
  [TetroType.Snake]: 1,
  [TetroType.Square]: 0,
  [TetroType.Tee]: 1,
  [TetroType.Leg]: 2,
  [TetroType.ReverseLeg]: 2,
  [TetroType.ReverseSnake]: 1,
} as Record<TetroType, number>;

//Define Move type
export type MoveType = "left" | "right" | "down" | "up" | "none";

//Create record of different move directions
export const moveDeltas: Record<MoveType, [number, number]> = {
  left: [0, -1],
  right: [0, 1],
  down: [1, 0],
  up: [-1, 0],
  none: [0, 0],
};
