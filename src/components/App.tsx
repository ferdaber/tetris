import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "../styles/styles";
import { Tetromino } from "../templates/Tetromino";
import {
  Tetro,
  TetroType,
  rotateTetromino,
  rotationOrigins,
  checkMove,
  generateDefaultTetromino,
} from "./tetromino";
import { useInterval } from "../hooks/hooks";

type Grid = any[][];

const DEFAULT_GRID = Array.from({ length: 20 }, () => Array(10).fill(0));

const DEFAULT_LEVEL = 1;

const DEFAULT_TETROMINO: Tetro = {
  type: TetroType.Line,
  coords: [
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
  ],
};

const DEFAULT_DROP_TIMING = 1000;

//Define Move type
type MoveType = "left" | "right" | "down" | "up" | "none";

//Create record of different move directions
const moveDeltas: Record<MoveType, [number, number]> = {
  left: [0, -1],
  right: [0, 1],
  down: [1, 0],
  up: [-1, 0],
  none: [0, 0],
};

//Select random Tetromino
const getRandomTetroType: () => Tetro = () => {
  let getTetro = TetroType[Math.floor(Math.random() * Math.floor(7))];
  return generateDefaultTetromino(TetroType[getTetro]);
};

const App = () => {
  const [grid, setGrid] = useState<Grid>(DEFAULT_GRID);
  const [session, setSession] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(0);
  const [preview, setPreview] = useState<Tetro[] | null>(null);
  const [dropTiming, setDropTiming] = useState(DEFAULT_DROP_TIMING);
  const [levelProgress, setLevelProgress] = useState<number>(9);
  const [tetromino, setTetromino] = useState<Tetro>(DEFAULT_TETROMINO);
  const [keyPress, setKeyPress] = useState<boolean>(false);
  const prevTetroCoords = useRef<[number, number][]>();

  useEffect(() => {}, []);

  //////////////Timer
  useInterval(
    () => {
      if (session) {
        move("down");
      }
    },
    keyPress || !session ? null : dropTiming
  );

  //Check to see if any rows contain filled array
  const checkRows = (grid: Grid) => {
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
    if (completedRows) {
      let newScore =
        completedRows > 3
          ? scoreSystem[4] * (level + 1)
          : scoreSystem[completedRows] * (level + 1);
      setScore(score + newScore);
      setLevelProgress(levelProgress + completedRows);
      if ((levelProgress + completedRows) / level >= 10) {
        setLevel(level + 1);
        setDropTiming(dropTiming - dropTiming * 0.2);
      }
    }
    let newGrid = Array.from({ length: completedRows }, () =>
      Array(10).fill(0)
    ).concat(previousGrid);

    setTetromino(() => {
      let newTetro = preview![0];
      let checkGameOver = checkMove(newTetro.coords, newGrid);
      if (checkGameOver > 0) {
        setSession(false);
        setGameOver(true);
        return newTetro;
      } else {
        return newTetro;
      }
    });
    let newPreview = preview!.slice(1, 3);
    newPreview.push(getRandomTetroType());
    setPreview(newPreview);
    setGrid(newGrid);
  };

  ///Find direction tetromino needs to shift if it rotates out of the bounds of the grid
  const getDirectionShift = (coords: [number, number][]) => {
    for (let i = 0; i < coords.length; i++) {
      if (coords[i][0] < 0) return "down";
      else if (coords[i][0] > 19) return "up";
      else if (coords[i][1] < 0) return "right";
      else if (coords[i][1] > 9) return "left";
    }
    return "none";
  };

  const moveTetro = (
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

  const move = useCallback(
    (moveType: MoveType) => {
      //Check on down movement if tetro is at bottom or at one position more than once. !!!!!!!!!!!!!!!!!!!!!!(TODO: maybe figure out how to check if, even if its rotating to lock in in place. )
      if (moveType === "down") {
        let atBottom = tetromino.coords.some(
          ([tetrominoX]) => tetrominoX === 19
        );
        if (prevTetroCoords.current === tetromino.coords || atBottom) {
          let newGrid = grid.slice();
          tetromino.coords.forEach(([x, y]) => {
            newGrid[x][y] = { color: "green" };
          });

          return checkRows(newGrid);
        }
        prevTetroCoords.current = tetromino.coords;
      }
      //get coords of tetromino1
      const { coords } = tetromino;
      // get new coords by mapping through current coords
      const newCoords = moveTetro(coords, moveType);

      if (checkMove(newCoords, grid) > 0) return;
      return setTetromino((tetro) => ({
        ...tetro,
        coords: newCoords,
      }));
    },
    [grid, tetromino]
  );

  ///Type for Rotate return object
  type RotateCheckReturn = {
    moveType: MoveType;
    numOfMoves: number;
  };

  const checkOccupiedRotate: (
    ///////////////////////////////////////////////////Refactor this
    newCoords: [number, number][]
  ) => RotateCheckReturn | undefined = useCallback(
    (newCoords: [number, number][]) => {
      let hitOccupied: [number, number];
      let maxX = 0;
      let maxY = 0;
      for (let i = 0; i < newCoords.length; i++) {
        const [x, y] = newCoords[i];

        maxX < x && (maxX = x);
        maxY < y && (maxY = y);
        if (Boolean(grid[x][y]) && !hitOccupied) {
          hitOccupied = [x, y];
        }
      }
      if (!hitOccupied!) return;
      let [xa, ya] = newCoords[rotationOrigins[tetromino.type]];
      let [x, y] = hitOccupied;

      const rotatecheck: RotateCheckReturn = {
        moveType: "none",
        numOfMoves: 0,
      };
      if (xa - x > 0) {
        rotatecheck.moveType = "down";
        rotatecheck.numOfMoves = newCoords.length - Math.abs(x - maxX);
      } else if (xa - x < 0) {
        rotatecheck.moveType = "up";
        rotatecheck.numOfMoves = Math.abs(maxX - x) + 1;
      } else if (ya - y > 0) {
        rotatecheck.moveType = "right";
        rotatecheck.numOfMoves = newCoords.length - Math.abs(y - maxY);
      } else if (ya - y < 0) {
        rotatecheck.moveType = "left";
        rotatecheck.numOfMoves = Math.abs(y - maxY) + 1;
      }
      return rotatecheck;
    },
    [grid, tetromino]
  );

  const rotate = useCallback(() => {
    //Squares don't rotate...duh
    if (tetromino.type === TetroType.Square) return;
    const newCoords = rotateTetromino(tetromino);
    //Check if any new tetromino coords are out of bounds or occupied
    if (checkMove(newCoords, grid) > 0) {
      if (getDirectionShift(newCoords) !== "none") {
        //If tetro hit boundary check new position, if occupied bail out
        let finalRotatedCoords = moveTetro(
          newCoords,
          getDirectionShift(newCoords),
          checkMove(newCoords, grid)
        );
        if (checkMove(finalRotatedCoords, grid)) return;
        return setTetromino((tetro) => ({
          ...tetro,
          coords: finalRotatedCoords,
        }));
      }
      //Check if is space is an occupied space, get back direction the news coords need to shift and number of moves in object form { moveType: MoveType; numOfMoves: number;}
      let matrixCheck = checkOccupiedRotate(newCoords);
      if (matrixCheck) {
        //If matrix returns an object containing moves and direction, point to new coords using moveTetro.
        let finalRotatedCoords = moveTetro(
          newCoords,
          matrixCheck!.moveType,
          matrixCheck!.numOfMoves
        );
        //If new coords are still occupied, bail out of rotation otherwise finish rotation/move
        if (checkMove(finalRotatedCoords, grid)) return;
        return setTetromino((tetro) => ({
          ...tetro,
          coords: finalRotatedCoords,
        }));
      }
    }
    //If no boundaries or occupied matrix hit complete rotation
    return setTetromino((tetro) => ({
      ...tetro,
      coords: newCoords,
    }));
  }, [checkOccupiedRotate, grid, tetromino]);

  const startGame = () => {
    setTetromino(getRandomTetroType());
    setSession(true);
    setPreview([
      getRandomTetroType(),
      getRandomTetroType(),
      getRandomTetroType(),
    ]);
  };

  //Player move
  const handleKeyPress = useCallback(
    (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          move("down");
          setKeyPress(true);
          break;
        case "ArrowUp":
          e.preventDefault();
          rotate();
          break;
        case "ArrowLeft":
          e.preventDefault();
          move("left");
          break;
        case "ArrowRight":
          e.preventDefault();
          move("right");
          break;
        default:
          break;
      }
    },
    [move, rotate]
  );

  const handleKeyUp = () => {
    setKeyPress(false);
  };

  //Add keydown event listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress, false);
    document.addEventListener("keyup", handleKeyUp, false);
    return () => {
      document.removeEventListener("keydown", handleKeyPress, false);
      document.removeEventListener("keyup", handleKeyUp, false);
    };
  });

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameInfo}>
        {preview && (
          <div className={styles.gamePreview}>
            {preview.map((tetro: Tetro, index: number) => {
              const newArr = Array(8).fill(1);
              return (
                <div key={index} className={styles.tetroPrev}>
                  <div
                    className={
                      TetroType[tetro.type].toLowerCase() + "  tetro-prev-grid"
                    }
                  >
                    {newArr.map((item, index) => (
                      <div key={index}></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className={styles.gameInfoTextContain}>
          <p className={styles.gameInfoText}>
            Score: <span>{score}</span>
          </p>
        </div>
        <div className={styles.gameInfoTextContain}>
          <p className={styles.gameInfoText}>
            Level: <span>{level}</span>
          </p>
        </div>
        <div className={styles.gameInfoTextContain}>
          <p className={styles.gameInfoText}>
            lines: <span>{levelProgress}</span>
          </p>
        </div>
      </div>
      <div className={styles.grid}>
        {session ? (
          grid.map((row, gridX) => {
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
                    ></div>
                  );
                })}
              </div>
            );
          })
        ) : (
          <button onClick={startGame}>Start Game</button>
        )}
      </div>
      {gameOver && (
        <div className={styles.game_cover_modal}>
          <p>Game Over</p>
        </div>
      )}
      {gameOver && <div className={styles.shadow}></div>}
    </div>
  );
};

export default App;
