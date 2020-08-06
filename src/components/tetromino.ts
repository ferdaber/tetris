export {};

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

//Interface for Tertomino - Tetro for short
export interface Tetro {
  type: TetroType;
  coords: [number, number][];
}

//Type for Tetromino Coords
export type TetroCoords = [number, number][];

//Generate Tetromino
export function generateDefaultTetromino(type: TetroType) {
  let startingCoords: TetroCoords | [] = [];
  if (type === TetroType.Line) {
    startingCoords = [
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
    ];
  } else if (type === TetroType.Snake) {
    startingCoords = [
      [0, 4],
      [1, 4],
      [1, 5],
      [2, 5],
    ];
  } else if (type === TetroType.Square) {
    startingCoords = [
      [0, 4],
      [0, 5],
      [1, 5],
      [1, 4],
    ];
  } else if (type === TetroType.Tee) {
    startingCoords = [
      [0, 4],
      [0, 5],
      [0, 6],
      [1, 5],
    ];
  } else if (type === TetroType.Leg) {
    startingCoords = [
      [0, 4],
      [1, 4],
      [2, 4],
      [2, 5],
    ];
  } else if (type === TetroType.ReverseLeg) {
    startingCoords = [
      [0, 4],
      [1, 4],
      [2, 4],
      [2, 3],
    ];
  } else if (type === TetroType.ReverseSnake) {
    startingCoords = [
      [0, 5],
      [1, 5],
      [1, 4],
      [2, 4],
    ];
  }
  let newTetro: Tetro = {
    type,
    coords: startingCoords,
  };
  return newTetro;
}

//Each shape has a origin block inside of it coordinates which changes depending on shape.
//Created a Record type that maps the TetroType to an origin
export const rotationOrigins = {
  [TetroType.Line]: 1,
  [TetroType.Snake]: 1,
  [TetroType.Square]: 0,
  [TetroType.Tee]: 1,
  [TetroType.Leg]: 2,
  [TetroType.ReverseLeg]: 2,
  [TetroType.ReverseSnake]: 1,
} as Record<TetroType, number>;

/** Rotate tetromino 90 degrees clockwise */
export function rotateTetromino(tetro: Tetro) {
  //Deconstruct Tetromino
  const { coords, type } = tetro;
  //Use rotationOrigins and pass in Tetromino type to find Rotation Origin
  const origin = coords[rotationOrigins[type]];
  //Deconstruct origin x,y values
  const [x0, y0] = origin;
  //Map through coords of current tetromino and get relative coords ex. [0, 3],[0, 4],[0, 5],[0, 6] => [0,-1], [0, 0], [0, 1], [0, 2]
  const relativeCoords = coords.map(([x, y]) => [x - x0, y - y0]);
  //Map through relative coords and find rotated relative coords ex. [0,-1], [0, 0], [0, 1], [0, 2] => [-1,0], [0,0], [1,0], [2, 0]
  const rotatedRelativeCoords = relativeCoords.map(([x, y]) => [y, -x]);
  //Map through relative coords and find rotated coords ex. [-1,0], [0,0], [1,0], [2, 0] => [-1, 4], [0, 4], [1,4], [2, 4]
  const rotatedCoords = rotatedRelativeCoords.map(([x, y]) => [x + x0, y + y0]);
  return rotatedCoords as [number, number][];
}

//////////////Boundary Checks
export function checkMove(coords: [number, number][], grid: number[][]) {
  let numOutOfBounds = 0;
  ///Loop through each of the coords check if the number is greater than the x,y grid. Return number of squares needed to move
  ///Rotations on Line and Elle tetrominos can push two blocks outside of grid.
  coords.forEach(([x, y]) => {
    if (y < 0 || y > 9 || x < 0 || x > 19 || Boolean(grid[x][y]))
      numOutOfBounds++;
  });
  return numOutOfBounds;
}
