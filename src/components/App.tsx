import React from "react";
import { css } from "linaria";

const styles = {
  container: css`
    color: slategray;
  `,
};

type Props = {};

export function App(props: Props) {
  return <span className={styles.container}>Hello world!</span>;
}
