import React, { useState, useEffect } from "react";
import { css } from "linaria";
import {Tetromino} from '../templates/Tetromino';


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
  `,
  matrix: css`
    width: 100px;
    height: 100px;
    border-left: 1px solid black;
  `
};


type Props = {};

type Grid = number[][];

const DEFAULT_TETROMINO: Tetromino = {
  shape: '|',
  coords: [[0,3], [0,4], [0,5], [0,6]],
  rotation: 0
}

const DEFAULT_GRID: Grid = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0]
]

const App: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(DEFAULT_GRID);
  const [tetromino, setTetromino] = useState<Tetromino>(DEFAULT_TETROMINO);

  useEffect(()=> {
    setTetromino({
      shape: '|',
      coords: [[0,1], [0,2], [0,3], [0,4]],
      rotation: 0
    })
  }, [])
  
  const moveDown: () => void = () => {
    let newCoords: [number, number][] = [];
    for (let i = 0; i < tetromino.coords.length; i++) {
      if (!grid[tetromino.coords[i][0] + 1][tetromino.coords[i][1]]) {
        newCoords.push([tetromino.coords[i][0] + 1, tetromino.coords[i][1]]);
      } else {
        console.log('cant move that way');
        return;
      }
    }
    setTetromino({
      ...tetromino,
      coords: newCoords, 
    })
  }
  const moveLeft: () => void = () => {
    let newCoords: [number, number][] = [];
    for (let i = 0; i < tetromino.coords.length; i++) {
      if (!grid[tetromino.coords[i][0]][tetromino.coords[i][1] - 1] && tetromino.coords[i][1] > 0) {
        newCoords.push([tetromino.coords[i][0], tetromino.coords[i][1] - 1]);
      } else {
        console.log('cant move that way');
        return;
      }
    }
    setTetromino({
      ...tetromino,
      coords: newCoords, 
    })
  }
  const moveRight: () => void = () => {
    let newCoords: [number, number][] = [];
    for (let i = 0; i < tetromino.coords.length; i++) {
      if (!grid[tetromino.coords[i][0]][tetromino.coords[i][1] + 1] && tetromino.coords[i][1] < 9) {
        newCoords.push([tetromino.coords[i][0], tetromino.coords[i][1] + 1]);
      } else {
        console.log('cant move that way');
        return;
      }
    }
    setTetromino({
      ...tetromino,
      coords: newCoords, 
    })
  }
  const rotate: () => void = () => {
    let newCoords: [number, number][] = [];
    if (tetromino.shape == '|') {
      if (tetromino.rotation == 0) {
        for (let i = -1; i < tetromino.coords.length - 1; i++) {
          newCoords.push([tetromino.coords[i + 1][0] + i, tetromino.coords[i + 1][1] - i]);
        }
      } else if (tetromino.rotation == 1) {
        for (let i = - 1; i < tetromino.coords.length - 1; i++) {
          newCoords.push([tetromino.coords[i + 1][0] - i, tetromino.coords[i + 1][1] - i]);
        }
      } else if (tetromino.rotation == 2) {
        for (let i = - 1; i < tetromino.coords.length - 1; i++) {
          newCoords.push([tetromino.coords[i + 1][0] - i, tetromino.coords[i + 1][1] + i]);
        }
      } else  {
        for (let i = -1; i < tetromino.coords.length - 1; i++) {
          newCoords.push([tetromino.coords[i + 1][0] + i, tetromino.coords[i + 1][1] + i]);
        }
      }
      setTetromino({
        ...tetromino,
        coords: newCoords, 
        rotation: tetromino.rotation === 3 ? 0 : tetromino.rotation + 1
      })
    }
  }
  const check = () => {
    console.log(tetromino.coords);
  }
  return (
    <div>
      <button onClick={()=>{moveDown()}}>Move Down</button>
      <button onClick={()=>{moveLeft()}}>Move Left</button>
      <button onClick={()=>{moveRight()}}>Move Right</button>
      <button onClick={()=>{rotate()}}>rotate</button>

      <button onClick={()=>{check()}}>Check</button>
      <div className={styles.grid}>
        {
          grid.map((row, index)=>{
            return (
              <div className={styles.row} key={index}>
                {
                  row.map((matrix, index) => (
                    <div className={styles.matrix} key={index}>
                          {index}
                    </div>
                  ))
                }
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default App;
