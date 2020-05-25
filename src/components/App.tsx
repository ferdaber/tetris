import React, { useState, useEffect } from "react";
import { css } from "linaria";
import { Tetromino } from "../templates/Tetromino";
import { Tetro, TetroType, rotateTetromino } from "./tetromino";

const styles = {
  grid: css`
    width: 1000px;
    border-top: 1px solid black;
    margin: 3rem auto;
  `,
  row: css`
    display: flex;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    width: 100%;
  `,
  matrix: css`
    width: 100px;
    height: 100px;
    border-left: 1px solid black;
    flex: 0 0 auto;
  `,
};

type Props = {};

type Grid = number[][];

const DEFAULT_TETROMINO: Tetromino = {
  shape: "|",
  coords: [
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
  ],
  rotation: 0,
};

const DEFAULT_TETROMINO_2: Tetro = {
  type: TetroType.Line,
  coords: [
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
  ],
};

const DEFAULT_TETROMINO_3: Tetro = {
  type: TetroType.Snake,
  coords: [
    [1, 3],
    [1, 4],
    [0, 4],
    [0, 5],
  ],
};

//  [
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,1,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0],
//   [0,0,0,0,0,0,0,0,0,0]
// ]

const DEFAULT_GRID = Array.from({ length: 20 }, () => Array(10).fill(0));
// DEFAULT_GRID[5][5] = 1

function getNewTetromino(): Tetromino {
  // do stuff
  return DEFAULT_TETROMINO;
}

type MoveType = "left" | "right" | "down";

const moveDeltas: Record<MoveType, [number, number]> = {
  left: [0, -1],
  right: [0, 1],
  down: [1, 0],
};

const App = () => {
  const [grid, setGrid] = useState<Grid>(DEFAULT_GRID);
  const [tetromino, setTetromino] = useState<Tetro>(DEFAULT_TETROMINO_3);

  const rotate = () => {
    const newCoords = rotateTetromino(tetromino);
    return setTetromino((tetro) => ({
      ...tetro,
      coords: newCoords,
    }));
  };

  const move = (moveType: MoveType) => {
    const { coords } = tetromino;
    const newCoords = coords.map(([x, y]) => {
      const [dx, dy] = moveDeltas[moveType];
      return [x + dx, y + dy] as [number, number];
    });

    // TODO: perform boundary checks
    return setTetromino((tetro) => ({
      ...tetro,
      coords: newCoords,
    }));
  };

  const check = () => {
    console.log(tetromino.coords);
  };
  useEffect(check);

  return (
    <div>
      <button
        onClick={() => {
          move("down");
        }}
      >
        Move Down
      </button>
      <button
        onClick={() => {
          move("left");
        }}
      >
        Move Left
      </button>
      <button
        onClick={() => {
          move("right");
        }}
      >
        Move Right
      </button>
      <button onClick={rotate}>rotate</button>
      <div className={styles.grid}>
        {grid.map((row, gridX) => {
          return (
            <div className={styles.row} key={gridX}>
              {row.map((matrix, gridY) => {
                const isOccupied =
                  Boolean(matrix) ||
                  tetromino.coords.some(
                    ([tetrominoX, tetrominoY]) =>
                      tetrominoX === gridX && tetrominoY === gridY
                  );
                return (
                  <div
                    className={styles.matrix}
                    key={gridY}
                    style={isOccupied ? { background: "gray" } : undefined}
                  >
                    {gridY}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
