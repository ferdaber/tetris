export {};

export enum TetroType {
  Line,
  Snake,
  Square,
  Tee,
  Leg,
}

export interface Tetro {
  type: TetroType;
  coords: [number, number][];
}

const rotationOrigins = {
  [TetroType.Line]: 1,
  [TetroType.Snake]: 1,
} as Record<TetroType, number>;

/** Rotate tetromino 90 degrees clockwise */
export function rotateTetromino(tetro: Tetro) {
  const { coords, type } = tetro;
  const origin = coords[rotationOrigins[type]];
  const [x0, y0] = origin;
  const relativeCoords = coords.map(([x, y]) => [x - x0, y - y0]);
  const rotatedRelativeCoords = relativeCoords.map(([x, y]) => [y, -x]);
  const rotatedCoords = rotatedRelativeCoords.map(([x, y]) => [x + x0, y + y0]);
  return rotatedCoords as [number, number][];
}
