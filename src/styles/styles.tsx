import { css } from "linaria";

export default {
  gameContainer: css`
    display: flex;
    max-width: 1008px;
    margin: auto;
    padding: 4rem 1.5rem;
    height: 100vh;
    min-height: 800px;
    align-items: flex-start;
    .theme-changer {
      border-top: 1px solid black;
      label {
        display: block;
      }
      select {
        appearance: none;
        border: none;
        padding: 1rem 0 0.1rem;
        cursor: pointer;
        font-size: 1rem;
        text-transform: lowercase;
        width: 100%;
        font-family: "Montserrat", sans-serif;
        right: 4px;
        background-color: transparent;
        border-bottom: 1px solid black;
        transition: letter-spacing 0.2s ease;
      }
      select:hover,
      select:focus {
        letter-spacing: 0.1rem;
      }
    }
  `,
  themeTwo: css`
    background: #f0f2df;
  `,
  themeThree: css`
    background: #a3bfba;
  `,
  themeFour: css`
    background-color: #0f3965;
    .game-container {
      background: #cbcbcc;
      border-radius: 5px;
    }
    .game-grid {
      background: #ccd050;
      border-radius: 5px;
      border: 10px solid #bfb3b6;
      box-sizing: content-box;
      height: 819px;
      button {
        color: #0f3965;
      }
    }
    .info-box {
      background: #ccd050;
      border-radius: 5px;
      border: 10px solid #bfb3b6;
      box-sizing: content-box;
      .game-info-text-contain {
        p {
          color: #0f3965;
        }
      }
      .game-preview {
        border-bottom: 10px solid #bfb3b6;
      }
      .theme-changer {
        border-top: 10px solid #bfb3b6;
        label {
          color: #0f3965;
        }
        select {
          color: #0f3965;
          border-color: #0f3965;
        }
        option {
          color: black;
        }
      }
    }
  `,
  themeFive: css`
    background: #122e40;
    .game-grid {
      border-color: #05f2db;
      button {
        color: #05f2db;
      }
    }
    .info-box {
      border-color: #05f2db;
      .game-info-text-contain {
        p {
          color: #05f2db;
        }
      }
      .game-preview {
        border-bottom: 1px solid #05f2db;
      }
      .theme-changer {
        border-top: 1px solid #05f2db;
        label {
          color: #05f2db;
        }
        select {
          color: #05f2db;
          border-color: #05f2db;
        }
      }
    }
  `,
  gameInfo: css`
    width: 28%;
    margin-right: 2%;
    min-width: 250px;
    border: 1px solid black;
  `,
  gamePreview: css`
    border-bottom: 1px solid black;
  `,
  tetroPrev: css`
    .tetro-prev-grid {
      display: flex;
      width: 125px;
      flex-flow: wrap;
      margin: 0.5rem auto;
      > div {
        height: 30px;
        width: 30px;
        margin: 0.5px;
      }
    }
    .line {
      > div:nth-child(n + 5) {
      }
      > div:nth-child(-n + 4) {
        height: 0;
      }
    }
    .snake {
      div:nth-child(7),
      div:nth-child(8),
      div:nth-child(1),
      div:nth-child(4) {
        background-color: transparent !important;
      }
    }
    .square {
      div:nth-child(1),
      div:nth-child(5),
      div:nth-child(4),
      div:nth-child(8) {
        background-color: transparent !important;
      }
    }
    .tee {
      div:nth-child(4),
      div:nth-child(5),
      div:nth-child(7),
      div:nth-child(8) {
        background-color: transparent !important;
      }
    }
    .leg {
      div:nth-child(4),
      div:nth-child(5),
      div:nth-child(6),
      div:nth-child(8) {
        background-color: transparent !important;
      }
    }
    .reverseleg {
      div:nth-child(1),
      div:nth-child(2),
      div:nth-child(4),
      div:nth-child(8) {
        background-color: transparent !important;
      }
    }
    .reversesnake {
      div:nth-child(3),
      div:nth-child(4),
      div:nth-child(5),
      div:nth-child(8) {
        background-color: transparent !important;
      }
    }
  `,
  gameInfoTextContain: css`
    padding: 1rem 1.5rem;
    text-transform: lowercase;
  `,
  gameInfoText: css`
    font-size: 24px;
  `,
  grid: css`
    width: 410px;
    height: 821px;
    border: 1px solid black;
    margin: 0;
    &.off {
      display: flex;
      justify-content: center;
      align-items: space-between;
      button {
        font-size: 36px;
        &:hover {
          letter-spacing: 0.15em;
        }
      }
    }
  `,
  row: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 40px;
    margin-bottom: 1px;
  `,
  matrix: css`
    width: 40px;
    height: 40px;
    margin-left: 1px;
    &:nth-child(1) {
      margin-left: 0;
    }
  `,
  game_cover_modal: css`
    width: 100%;
    max-width: 600px;
    position: absolute;
    z-index: 20;
    background: white;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 500px;
    p {
      font-size: 36px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: lowercase;
      padding-bottom: 1rem;
      border-bottom: 2px solid black;
    }
    div {
      width: 250px;
    }
    button {
      margin: 1rem 0;
      width: 50%;
    }
  }
  `,
  shadow: css`
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
  `,
};
