import { css, styled } from "linaria";

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
        background: blue;
      }
      > div:nth-child(-n + 4) {
        height: 0;
      }
    }
    .snake {
      div:nth-child(5),
      div:nth-child(6),
      div:nth-child(2),
      div:nth-child(3) {
        background: red;
      }
    }
    .square {
      div:nth-child(2),
      div:nth-child(3),
      div:nth-child(6),
      div:nth-child(7) {
        background: yellow;
      }
    }
    .tee {
      div:nth-child(1),
      div:nth-child(2),
      div:nth-child(3),
      div:nth-child(6) {
        background: purple;
      }
    }
    .leg {
      div:nth-child(1),
      div:nth-child(2),
      div:nth-child(3),
      div:nth-child(7) {
        background: orange;
      }
    }
    .reverseleg {
      div:nth-child(5),
      div:nth-child(6),
      div:nth-child(7),
      div:nth-child(3) {
        background: green;
      }
    }
    .reversesnake {
      div:nth-child(1),
      div:nth-child(2),
      div:nth-child(6),
      div:nth-child(7) {
        background: blue;
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
