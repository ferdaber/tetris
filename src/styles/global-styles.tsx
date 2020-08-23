import { css } from "linaria";

export default css`
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap");
  :global() {
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      position: relative;
    }
    body {
      margin: 0;
      font-family: "Montserrat", sans-serif;
    }
    button {
      font-family: "Montserrat", sans-serif;
      text-transform: lowercase;
      font-weight: 600;
      background: transparent;
      border: none;
      box-shadow: none;
      cursor: pointer;
      letter-spacing: 0.1em;
      transition: letter-spacing 0.2s ease, color 0.2s ease;
      display: inline-block;
      &:hover {
        letter-spacing: 0.15em;
      }
    }
  }
`;
