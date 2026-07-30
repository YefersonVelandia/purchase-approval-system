const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

const MF_BASE_URL = process.env.MF_BASE_URL || "http://localhost:3001";
const REQUESTS_MF_URL = process.env.REQUESTS_MF_URL || `${MF_BASE_URL}/requests-mf/remoteEntry.js`;
const APPROVALS_MF_URL = process.env.APPROVALS_MF_URL || `${MF_BASE_URL}/approvals-mf/remoteEntry.js`;

if (!process.env.MF_BASE_URL && process.env.NODE_ENV === "production") {
  console.warn("⚠️  MF_BASE_URL no definida. Usando fallback localhost. Las URLs remotas apuntarán a desarrollo.");
}

module.exports = {
  mode: "production",
  entry: "./src/main",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: `${MF_BASE_URL}/shell/`,
    filename: "[name].[contenthash:8].js",
    clean: true,
    crossOriginLoading: "anonymous",
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
        use: ["style-loader", "css-loader", "postcss-loader"],
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
        "requests-mf": `requests_mf@${REQUESTS_MF_URL}`,
        "approvals-mf": `approvals_mf@${APPROVALS_MF_URL}`,
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
};
