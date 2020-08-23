import { css } from "linaria";

export default {
  gameContainer: css`
    display: flex;
    max-width: 1000px;
    margin: auto;
    padding: 4rem 1.5rem;
    height: 100vh;
    min-height: 800px;
    align-items: flex-start;
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
      width: 120px;
      flex-flow: wrap;
      margin: 0.5rem auto;
      > div {
        height: 30px;
        width: 30px;
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
    padding: 1.5rem;
    text-transform: lowercase;
  `,
  gameInfoText: css`
    font-size: 24px;
  `,
  grid: css`
    width: 400px;
    height: 800px;
    border: 1px solid black;
    margin: 0;
    &.off {
      display: flex;
      justify-content: center;
      align-items: center;
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
    width: 100%;
    height: 5%;
  `,
  matrix: css`
    width: 10%;
    height: 100%;
    flex: 0 0 auto;
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
