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
  ColorTheme2,
  ColorTheme3,
  ColorTheme4,
  ColorTheme5,
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
  [Styles.Body]: "#f0f2df",
} as Record<Styles, string>;

const ColorTheme2 = {
  [Styles.Line]: "#D93B48",
  [Styles.Snake]: "#104D73",
  [Styles.Square]: "#32838C",
  [Styles.Tee]: "#d9b93b",
  [Styles.Leg]: "#D95F43",
  [Styles.ReverseLeg]: "#db9840",
  [Styles.ReverseSnake]: "#107370",
  [Styles.Body]: "themeTwo",
} as Record<Styles, string>;

const ColorTheme3 = {
  [Styles.Line]: "#4D5D73",
  [Styles.Snake]: "#3D5914",
  [Styles.Square]: "#A68F72",
  [Styles.Tee]: "#D96523",
  [Styles.Leg]: "#A6360D",
  [Styles.ReverseLeg]: "#A2352E",
  [Styles.ReverseSnake]: "#383E33",
  [Styles.Body]: "themeThree",
} as Record<Styles, string>;

const ColorTheme4 = {
  [Styles.Line]: "#0F3965",
  [Styles.Snake]: "#0F3965",
  [Styles.Square]: "#0F3965",
  [Styles.Tee]: "#0F3965",
  [Styles.Leg]: "#0F3965",
  [Styles.ReverseLeg]: "#0F3965",
  [Styles.ReverseSnake]: "#0F3965",
  [Styles.Body]: "themeFour",
} as Record<Styles, string>;

const ColorTheme5 = {
  [Styles.Line]: "#590222",
  [Styles.Snake]: "#73024B",
  [Styles.Square]: "#BF047E",
  [Styles.Tee]: "#04C4D9",
  [Styles.Leg]: "#F25F29",
  [Styles.ReverseLeg]: "#F2C230",
  [Styles.ReverseSnake]: "#F21905",
  [Styles.Body]: "themeFive",
} as Record<Styles, string>;

export const ColorTheme = {
  [Themes.ColorTheme1]: ColorTheme1,
  [Themes.ColorTheme2]: ColorTheme2,
  [Themes.ColorTheme3]: ColorTheme3,
  [Themes.ColorTheme4]: ColorTheme4,
  [Themes.ColorTheme5]: ColorTheme5,
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
