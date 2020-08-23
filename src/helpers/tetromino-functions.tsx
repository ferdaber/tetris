import {
  TetroType,
  TetroCoords,
  Tetro,
  rotationOrigins,
  Grid,
  MoveType,
  moveDeltas,
} from "../templates/Tetromino";

//Generate Tetromino
export function generateDefaultTetromino(type: TetroType, color: string) {
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
    color,
  };
  return newTetro;
}

///Returns news coords for directional movement
export const moveTetro = (
  coords: [number, number][],
  moveType: MoveType,
  moveAmount = 1
) => {
  return coords.map(([x, y]) => {
    // get deltas of move type

    const [dx, dy] = moveDeltas[moveType];

    // return deltas + coord of each tetromino to get new coords
    return [x + dx * moveAmount, y + dy * moveAmount] as [number, number]; //ask ferdy about this again
  });
};

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

///Find direction tetromino needs to shift if it rotates out of the bounds of the grid
export const getDirectionShift = (coords: [number, number][]) => {
  for (let i = 0; i < coords.length; i++) {
    if (coords[i][0] < 0) return "down";
    else if (coords[i][0] > 19) return "up";
    else if (coords[i][1] < 0) return "right";
    else if (coords[i][1] > 9) return "left";
  }
  return "none";
};

export const checkGrid: (
  grid: Grid,
  level: number
) => [Grid, number, number] = (grid, level) => {
  let completedRows = 0;
  let previousGrid = grid.filter((row) => {
    if (!row.every((matrix) => Boolean(matrix))) {
      return row;
    } else {
      completedRows++;
    }
  });
  const scoreSystem = {
    1: 40,
    2: 100,
    3: 300,
    4: 1200,
  };
  let newGrid = Array.from({ length: completedRows }, () =>
    Array(10).fill(0)
  ).concat(previousGrid);
  let newScore =
    completedRows > 3
      ? scoreSystem[4] * (level + 1)
      : scoreSystem[completedRows] * (level + 1);
  return [newGrid, newScore, completedRows];
};
