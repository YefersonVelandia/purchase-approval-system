const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  const port = 3002;

  return {
    mode,
    entry: "./src/index",
    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: `http://localhost:${port}/`,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.API_BASE_URL": JSON.stringify(
          process.env.API_BASE_URL || "http://localhost:3000",
        ),
      }),
      new ModuleFederationPlugin({
        name: "requests_mf",
        filename: "remoteEntry.js",
        exposes: {
          "./RequestsApp": "./src/App",
        },
        shared: {
          react: { singleton: true, requiredVersion: "^18.0.0" },
          "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
          "react-router-dom": { singleton: true, requiredVersion: "^6.0.0" },
        },
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
    devServer: {
      port,
      historyApiFallback: true,
      hot: true,
    },
  };
};
