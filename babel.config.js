module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        loose: true,
        modules: process.env.NODE_ENV === "test" ? "commonjs" : false,
        useBuiltIns: "entry",
        corejs: {
          version: 3,
          proposals: true,
        },
        targets: {
          chrome: 79,
          safari: 13,
          firefox: 73,
        },
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
    "linaria/babel",
  ],
  plugins: [
    "@babel/plugin-proposal-numeric-separator",
    [
      "@babel/plugin-proposal-class-properties",
      {
        loose: true,
      },
    ],
    [
      "@babel/plugin-proposal-nullish-coalescing-operator",
      {
        loose: true,
      },
    ],
    [
      "@babel/plugin-proposal-optional-chaining",
      {
        loose: true,
      },
    ],
  ],
};
