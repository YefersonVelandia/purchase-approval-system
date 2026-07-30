const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  const port = 3001;

  return {
    mode,
    entry: "./src/main",
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
        name: "shell",
        remotes: {
          "requests-mf": "requests_mf@http://localhost:3002/remoteEntry.js",
          "approvals-mf": "approvals_mf@http://localhost:3003/remoteEntry.js",
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
      allowedHosts: "all",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  };
};
