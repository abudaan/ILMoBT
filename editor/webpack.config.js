/* eslint @typescript-eslint/no-var-requires: 0 */

const path = require("path");

module.exports = {
  // context: path.resolve(__dirname),
  // entry: "./src/index.tsx",
  entry: path.join(__dirname, "src", "index.tsx"),
  devtool: "inline-source-map",
  mode: "development",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    // modules: ["node_modules", path.resolve(__dirname, "src")],
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.css$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // "css-modules-typescript-loader",
          // {
          //   loader: "css-loader",
          //   options: {
          //     modules: true,
          //   },
          // },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            onlyCompileBundledFiles: true,
          },
        },
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    hot: false,
    inline: false,
    liveReload: false,
  },
  node: {
    fs: "empty",
  },
};
