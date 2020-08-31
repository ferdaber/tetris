import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "../styles/styles";
import {
  Tetro,
  TetroType,
  ColorTheme,
  Themes,
  Grid,
  MoveType,
  Styles,
} from "../templates/Tetromino";
import {
  checkGrid,
  checkMove,
  checkRotate,
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
  const [bag, setBag] = useState<Tetro[] | []>([]);
  const [queue, setQueue] = useState<Tetro[] | null>(null);
  const [dropTiming, setDropTiming] = useState(DEFAULT_DROP_TIMING);
  const [reserve, setReserve] = useState<number[] | null>(null);
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
  const fillBag: (refillingBag: Tetro[]) => void = useCallback(
    (refillingBag) => {
      if (refillingBag.length > 6) {
        setBag(refillingBag);
        return;
      }
      let getTetro = TetroType[Math.floor(Math.random() * Math.floor(7))];
      let newTetro = generateDefaultTetromino(
        TetroType[getTetro],
        ColorTheme[theme][TetroType[getTetro]]
      );
      if (refillingBag.some((tetro) => tetro.type === newTetro.type)) {
        return fillBag(refillingBag);
      }
      refillingBag.push(newTetro);
      return fillBag(refillingBag);
    },
    [theme]
  );

  useEffect(() => {
    fillBag([]);
  }, [fillBag]);

  const handleChangeTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = Number(e.target.value);
    setTheme(theme);
  };

  //////////////Movement and Rotation Checks
  //Check to see if any rows are complete
  const checkFinalPlacement = useCallback(
    (grid: Grid) => {
      const gridCheck = checkGrid(grid, level);
      if (gridCheck[2] > 0) {
        setScore(score + gridCheck[1]);
        setLevelProgress(levelProgress + gridCheck[2]);
        if (levelProgress + gridCheck[2] >= 10 * (level + 1)) {
          setLevel(level + 1);
          let first = (level + 1) * 0.0007;
          let timing = 0.8 - first;
          setDropTiming(Math.pow(timing, level + 1) * 1000);
        }
      }

      setTetromino(() => {
        let newTetro = queue![0];
        let checkGameOver = checkMove(newTetro.coords, gridCheck[0]);
        if (checkGameOver > 0) {
          setSession("game over");
          return newTetro;
        } else {
          return newTetro;
        }
      });
      let newPreview = queue!.slice(1, 3);
      let filledbag = bag.slice();
      let newTetro = filledbag.pop();
      newPreview.push(newTetro!);
      setBag(filledbag);
      if (filledbag.length === 0) {
        fillBag([]);
      }
      setQueue(newPreview);
      setGrid(gridCheck[0]);
    },
    [level, levelProgress, queue, score, bag, fillBag]
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

          return checkFinalPlacement(newGrid);
        }
        prevTetroCoords.current = tetromino.coords;
      }
      if (checkMove(newCoords, grid) > 0) return;
      return setTetromino((tetro) => ({
        ...tetro,
        coords: newCoords,
      }));
    },
    [grid, tetromino, checkFinalPlacement]
  );

  ///Set/Swap reserve tetro
  const swapReserve = useCallback(() => {
    if (reserve) {
      let currentTetro = tetromino.type;
      setTetromino(
        generateDefaultTetromino(reserve[0], ColorTheme[theme][reserve[0]])
      );
      setReserve([currentTetro]);
    } else {
      setReserve([tetromino.type]);
      checkFinalPlacement(grid);
    }
  }, [grid, checkFinalPlacement, tetromino, reserve, theme]);

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
      let matrixCheck = checkRotate(newCoords, grid, tetromino);
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
  }, [grid, tetromino]);

  ////////////Games Session Functions

  //Clear Game function
  const clearGame = () => {
    setSession("");
    setQueue(null);
    setGrid(Array.from({ length: 20 }, () => Array(10).fill(0)));
    setLevel(5);
    setLevelProgress(59);
    setScore(DEFAULT_SCORE);
    setTetromino(DEFAULT_TETROMINO);
    setDropTiming(DEFAULT_DROP_TIMING);
    fillBag([]);
  };

  //Start Game function
  const startGame = () => {
    clearGame();
    let filledbag = bag.slice();
    let firstTetro = filledbag.pop();
    let preview = filledbag.splice(filledbag.length - 3, 3);
    setBag(filledbag);
    setTetromino(firstTetro!);
    setSession("play");
    setQueue(preview);
  };

  ////////////Key Press Functions

  const dropTetro = useCallback(async () => {
    /////////////////////////////////!!!!! REFACTOR !!!!!!////////////////////////////////////////////////
    /**** START HERE ****/
    //Fix L drops
    const { coords } = tetromino;
    let checkCol = false;
    //Start Loop at lowest X coord. Allows for drops under hanging tetros
    let firstRow = Math.min(...coords.map((matrix) => matrix[0]));
    for (let i = firstRow; i < grid.length; i++) {
      //Loop through grid
      let checkRow = grid[i].some((matrix) => Boolean(matrix));
      //Check each row
      if (checkRow) {
        //If a row has an occupied space loop through coords to see if any of the tetro coords are in the same col
        for (let j = 0; j < coords.length; j++) {
          checkCol = Boolean(grid[i][coords[j][1]]);
          if (checkCol) {
            if (i < coords[j][0]) return;
            let moves = i - coords[j][0] - 1;
            // get new coords by mapping through current coords
            let newCoords = moveTetro(coords, "down", moves);
            if (checkMove(newCoords, grid) > 0) {
              let max = Math.max(
                ...newCoords.map((matrix: [number, number]) => matrix[0])
              );
              let difference = max - i;
              newCoords = moveTetro(newCoords, "up", difference);
              if (checkMove(newCoords, grid) > 0) {
                newCoords = moveTetro(newCoords, "up", 1);
              }
            }
            let newGrid = grid.slice();
            newCoords.forEach(([x, y]) => {
              newGrid[x][y] = { color: tetromino.color };
            });
            return checkFinalPlacement(newGrid);
          }
        }
      }
    }
    //If no part of the grid below is occupied this will run
    if (!checkCol) {
      const { coords } = tetromino;
      let max = Math.max(...tetromino.coords.map((matrix) => matrix[0]));
      let moves = grid.length - max - 1;
      let newCoords = moveTetro(coords, "down", moves);
      let newGrid = grid.slice();
      newCoords.forEach(([x, y]) => {
        newGrid[x][y] = { color: tetromino.color };
      });
      return checkFinalPlacement(newGrid);
    }
    //}
  }, [tetromino, grid, checkFinalPlacement]);

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
        case "Shift":
          e.preventDefault();
          swapReserve();
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
  }, [
    move,
    rotate,
    dropTetro,
    session,
    grid,
    checkFinalPlacement,
    swapReserve,
  ]);

  ////////////////////////////////////////////////////////////////////////////////Ask Ferdy about passing functions into dependency array
  return (
    <div className={styles[ColorTheme[theme][Styles.Body]]}>
      <div className={styles.gameContainer + ` game-container`}>
        <div className={styles.gameInfo + ` info-box`}>
          {reserve && (
            <div className={styles.gamePreview + ` game-queue`}>
              {reserve.map((type, index: number) => {
                const newArr = Array(8).fill(1);
                return (
                  <div key={index} className={styles.tetroPrev}>
                    <div
                      className={
                        TetroType[type].toLowerCase() + "  tetro-prev-grid"
                      }
                    >
                      {newArr.map((item, index) => (
                        <div
                          style={{
                            background: `${ColorTheme[theme][type]}`,
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
          {queue && (
            <div className={styles.gamePreview + ` game-queue`}>
              {queue.map((tetro: Tetro, index: number) => {
                const newArr = Array(8).fill(1);
                return (
                  <div key={index} className={styles.tetroPrev}>
                    <div
                      className={
                        TetroType[tetro.type].toLowerCase() +
                        "  tetro-prev-grid"
                      }
                    >
                      {newArr.map((item, index) => (
                        <div
                          style={{
                            background: `${ColorTheme[theme][tetro.type]}`,
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
          <div
            className={styles.gameInfoTextContain + " game-info-text-contain"}
          >
            <p className={styles.gameInfoText}>
              Score: <span>{score}</span>
            </p>
          </div>
          <div
            className={styles.gameInfoTextContain + " game-info-text-contain"}
          >
            <p className={styles.gameInfoText}>
              Level: <span>{level}</span>
            </p>
          </div>
          <div
            className={styles.gameInfoTextContain + " game-info-text-contain"}
          >
            <p className={styles.gameInfoText}>
              lines: <span>{levelProgress}</span>
            </p>
          </div>
          {session !== "play" && (
            <div className={styles.gameInfoTextContain + " theme-changer"}>
              <label htmlFor={"theme-change"}>Change Theme</label>
              <select name="theme-change" onChange={handleChangeTheme}>
                <option value="0">Default</option>
                <option value="1">Pastel</option>
                <option value="2">Fall</option>
                <option value="3">Classic</option>
                <option value="4">Midnight</option>
              </select>
            </div>
          )}
          <div
            className={
              styles.gameInfoTextContain +
              " game-info-text-contain instructions"
            }
          >
            <p>Up - Rotate</p>
            <p>Down - Move Down</p>
            <p>Left - Move Left</p>
            <p>Right- Move Right</p>
            <p>Space - Drop</p>
            <p>Shift - Reserve</p>
          </div>
        </div>
        <div
          className={
            styles.grid + `${session !== "" ? " on" : " off"} game-grid`
          }
        >
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
    </div>
  );
};

export default App;
