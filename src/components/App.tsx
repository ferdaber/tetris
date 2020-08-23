import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "../styles/styles";
import {
  Tetro,
  TetroType,
  rotationOrigins,
  ColorTheme,
  Themes,
  Grid,
  MoveType,
} from "../templates/Tetromino";
import {
  checkGrid,
  checkMove,
  generateDefaultTetromino,
  rotateTetromino,
  getDirectionShift,
  moveTetro,
} from "../helpers/tetromino-functions";
import { useInterval } from "../hooks/hooks";

const DEFAULT_GRID = Array.from({ length: 20 }, () => Array(10).fill(0));
const DEFAULT_LEVEL_PROGRESS = 0;
const DEFAULT_LEVEL = 0;
const DEFAULT_SCORE = 0;
const DEFAULT_TETROMINO: Tetro = {
  type: TetroType.Line,
  coords: [
    [0, -1],
    [0, -1],
    [0, -1],
    [0, -1],
  ],
  color: "white",
};

const DEFAULT_DROP_TIMING = 1000;

//Game mode
type GameMode = "play" | "" | "game over";

const App = () => {
  const [grid, setGrid] = useState<Grid>(DEFAULT_GRID);
  const [session, setSession] = useState<GameMode>("");
  const [score, setScore] = useState<number>(DEFAULT_SCORE);
  const [level, setLevel] = useState<number>(DEFAULT_LEVEL);
  const [preview, setPreview] = useState<Tetro[] | null>(null);
  const [dropTiming, setDropTiming] = useState(DEFAULT_DROP_TIMING);
  const [levelProgress, setLevelProgress] = useState<number>(
    DEFAULT_LEVEL_PROGRESS
  );
  const [tetromino, setTetromino] = useState<Tetro>(DEFAULT_TETROMINO);
  const [keyPress, setKeyPress] = useState<boolean>(false);
  const [theme, setTheme] = useState<Themes>(0);
  const prevTetroCoords = useRef<[number, number][]>();

  //////////////Timer
  useInterval(
    () => {
      if (session === "play") {
        move("down");
      }
    },
    keyPress || session !== "play" ? null : dropTiming
  );

  //Select random Tetromino
  const getRandomTetroType: () => Tetro = useCallback(() => {
    let getTetro = TetroType[Math.floor(Math.random() * Math.floor(7))];
    return generateDefaultTetromino(
      TetroType[getTetro],
      ColorTheme[theme][TetroType[getTetro]]
    );
  }, [theme]);

  //////////////Movement and Rotation Checks
  //Check to see if any rows are complete
  const checkRows = useCallback(
    (grid: Grid) => {
      const gridCheck = checkGrid(grid, score);
      if (gridCheck[2] > 0) {
        setScore(score + gridCheck[1]);
        setLevelProgress(levelProgress + gridCheck[2]);
        if ((levelProgress + gridCheck[2]) / level >= 10) {
          setLevel(level + 1);
          setDropTiming(dropTiming - dropTiming * 0.2);
        }
      }

      setTetromino(() => {
        let newTetro = preview![0];
        let checkGameOver = checkMove(newTetro.coords, gridCheck[0]);
        if (checkGameOver > 0) {
          setSession("game over");
          return newTetro;
        } else {
          return newTetro;
        }
      });
      let newPreview = preview!.slice(1, 3);
      newPreview.push(getRandomTetroType());
      setPreview(newPreview);
      setGrid(gridCheck[0]);
    },
    [level, levelProgress, dropTiming, preview, score, getRandomTetroType]
  );

  ////Default Tetro Move
  const move = useCallback(
    (moveType: MoveType) => {
      //get coords of tetromino
      const { coords } = tetromino;
      // get new coords by mapping through current coords
      const newCoords = moveTetro(coords, moveType);
      //Check on down movement if tetro is at bottom or at one position more than once. !!!!!!!!!!!!!!!!!!!!!!(TODO: maybe figure out how to check if, even if its rotating to lock in in place. )
      if (moveType === "down") {
        let atBottom =
          tetromino.coords.some(([tetrominoX]) => tetrominoX === 19) ||
          checkMove(newCoords, grid) > 0;
        if (atBottom) {
          let newGrid = grid.slice();
          tetromino.coords.forEach(([x, y]) => {
            newGrid[x][y] = { color: tetromino.color };
          });

          return checkRows(newGrid);
        }
        prevTetroCoords.current = tetromino.coords;
      }
      if (checkMove(newCoords, grid) > 0) return;
      return setTetromino((tetro) => ({
        ...tetro,
        coords: newCoords,
      }));
    },
    [grid, tetromino, checkRows]
  );

  ///Type for Rotate return object
  type RotateCheckReturn = {
    moveType: MoveType;
    numOfMoves: number;
  };

  ///Checks if/when tetro has rotated whether or not
  //the new coords are occupied and returns direction it must move and number of spaces
  const checkOccupiedRotate: (
    ///////////////////////////////////////////////////Refactor this
    newCoords: [number, number][]
  ) => RotateCheckReturn | undefined = useCallback(
    (newCoords: [number, number][]) => {
      let hitOccupied = null; ///matrix that is hit(if there is one)
      let maxX = 0; /// Max number of matrix on x axis beyond occupied
      let maxY = 0; /// Max number of matrix on y axis beyond occupied
      //loop through new coords for rotation
      for (let i = 0; i < newCoords.length; i++) {
        const [x, y] = newCoords[i];
        //Change maxX/Y if less than x,y for this tetro block
        maxX < x && (maxX = x);
        maxY < y && (maxY = y);
        //If matrix is occupied on grid and hitOccupied is undefined
        if (Boolean(grid[x][y]) && !hitOccupied) {
          hitOccupied = [x, y];
        }
      }
      //If no occupied matrix exit function
      if (!hitOccupied!) return;
      //Get x / y coords of rotation origin
      let [xa, ya] = newCoords[rotationOrigins[tetromino.type]];
      //If occupied matrix figure out if tetro can be moved
      if (hitOccupied) {
        //deconstruct x /y of first occupied matrix
        let [x, y] = hitOccupied;
        //Default return value for rotation
        const rotatecheck: RotateCheckReturn = {
          moveType: "none",
          numOfMoves: 0,
        };
        ///Check which direction tetro needs to move + how far to move from occupied space
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
      }
    },
    [grid, tetromino]
  );

  //Default Function for Tetro rotate
  const rotate = useCallback(() => {
    //Squares don't rotate...duh
    if (tetromino.type === TetroType.Square) return;
    const newCoords = rotateTetromino(tetromino);
    //Check if any new tetromino coords are out of grid boundary
    let moveCheck = checkMove(newCoords, grid);
    if (moveCheck > 0) {
      if (getDirectionShift(newCoords) !== "none") {
        //If tetro hit grid boundary check new position, if occupied bail out
        let finalRotatedCoords = moveTetro(
          newCoords,
          getDirectionShift(newCoords),
          moveCheck
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
        //If matrix returns an object containing moves and direction, point to new coords using moveTetro function.
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

  ////////////Games Session Functions

  //Clear Game function
  const clearGame = () => {
    setSession("");
    setPreview(null);
    setGrid(Array.from({ length: 20 }, () => Array(10).fill(0)));
    setLevel(DEFAULT_LEVEL);
    setLevelProgress(DEFAULT_LEVEL_PROGRESS);
    setScore(DEFAULT_SCORE);
    setTetromino(DEFAULT_TETROMINO);
    setDropTiming(DEFAULT_DROP_TIMING);
  };

  //Start Game function
  const startGame = () => {
    clearGame();
    setTetromino(getRandomTetroType());
    setSession("play");
    setPreview([
      getRandomTetroType(),
      getRandomTetroType(),
      getRandomTetroType(),
    ]);
  };

  ////////////Key Press Functions

  const dropTetro = useCallback(() => {
    /////////////////////////////////!!!!! REFACTOR !!!!!!////////////////////////////////////////////////
    /**** START HERE ****/
    //Fix L drops

    let checkCol = false;
    for (let i = 0; i < grid.length; i++) {
      let checkRow = grid[i].some((matrix) => Boolean(matrix));
      if (checkRow) {
        for (let j = 0; j < tetromino.coords.length; j++) {
          checkCol = Boolean(grid[i][tetromino.coords[j][1]]);
          if (checkCol) {
            let moves = i - tetromino.coords[j][0];
            const { coords } = tetromino;
            // get new coords by mapping through current coords
            let newCoords = moveTetro(coords, "down", moves);
            if (checkMove(newCoords, grid) > 0) {
              let max = Math.max(
                ...newCoords.map((matrix: [number, number]) => matrix[0])
              );
              //let firstRow = Math.min(...newCoords.map((matrix) => matrix[0]));
              let difference = max - i;
              newCoords = moveTetro(newCoords, "up", difference);
              if (checkMove(newCoords, grid) > 0) {
                newCoords = moveTetro(newCoords, "up", 1);
              }
            }
            return setTetromino((tetro) => ({
              ...tetro,
              coords: newCoords,
            }));
          }
        }
      }
    }

    if (!checkCol) {
      const { coords } = tetromino;
      let max = Math.max(...tetromino.coords.map((matrix) => matrix[0]));
      let moves = grid.length - max - 1;
      let newCoords = moveTetro(coords, "down", moves);
      return setTetromino((tetro) => ({
        ...tetro,
        coords: newCoords,
      }));
    }
    //}
  }, [tetromino, grid]);

  //Add keydown event listeners
  useEffect(() => {
    //Player move
    const handleKeyPress = (e: KeyboardEvent) => {
      if (session !== "play") return;
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
        case " ":
          e.preventDefault();
          dropTetro();
          break;
        default:
          break;
      }
    };

    const handleKeyUp = () => {
      setKeyPress(false);
    };
    document.addEventListener("keydown", handleKeyPress, false);
    document.addEventListener("keyup", handleKeyUp, false);
    return () => {
      document.removeEventListener("keydown", handleKeyPress, false);
      document.removeEventListener("keyup", handleKeyUp, false);
    };
  }, [move, rotate, dropTetro, session]);
  ////////////////////////////////////////////////////////////////////////////////Ask Ferdy about passing functions into dependency array
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
                      <div
                        style={{
                          background: `${
                            ColorTheme[Themes.ColorTheme1][tetro.type]
                          }`,
                        }}
                        key={index}
                      ></div>
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
      <div className={styles.grid + `${session !== "" ? " on" : " off"}`}>
        {session !== "" ? (
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
                      style={
                        isOccupied
                          ? {
                              background: `${
                                grid[gridX][gridY] === 0
                                  ? tetromino.color
                                  : grid[gridX][gridY].color
                              }`,
                            }
                          : undefined
                      }
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
      {session === "game over" && (
        <div className={styles.game_cover_modal}>
          <p>Game Over</p>
          <div>
            <button onClick={clearGame}>home</button>
            <button onClick={startGame}>Start Over</button>
          </div>
        </div>
      )}
      {session === "game over" && <div className={styles.shadow}></div>}
    </div>
  );
};

export default App;
