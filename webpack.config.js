const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = (env, argv) => {
  const isAnalyze = argv.analyze;

  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js",
      chunkFilename: "[name].[contenthash].chunk.js",
      clean: true,
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          games: {
            test: /[\\/]src[\\/]components[\\/]games[\\/]/,
            name: "games",
            chunks: "all",
            minSize: 0,
          },
        },
      },
    },
    performance: {
      maxAssetSize: 300000,
      maxEntrypointSize: 300000,
      hints: "warning",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react"],
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|mp3|wav|ogg)$/,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "public",
            to: ".",
            globOptions: {
              ignore: ["**/index.html"], // Don't copy index.html as HtmlWebpackPlugin handles it
            },
          },
        ],
      }),
      ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
    ],
    devServer: {
      port: 3001,
      hot: true,
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
  };
};
