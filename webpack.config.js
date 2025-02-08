const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  entry: {
    index: "./src/index.tsx",
    background: "./src/background.js",
    contentScript: "./src/contentScript.ts",
    options: "./src/options.tsx",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: { compilerOptions: { noEmit: false } },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "manifest.json" }, // Ensure manifest is copied correctly
        { from: "public/*.png", to: "[name][ext]" },
      ],
    }),
    ...getHtmlPlugins(["index", "options"]),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      services: path.resolve(__dirname, "src/services/"),
    },
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js", // Ensures background.js is placed directly in dist/
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HTMLPlugin({
        title: "React extension",
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}