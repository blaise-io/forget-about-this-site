import * as CleanWebpackPlugin from "clean-webpack-plugin";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as fs from "fs";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { resolve } from "path";
import * as webpack from "webpack";
import * as ZipPlugin from "zip-webpack-plugin";

const config: webpack.Configuration = {
    entry: {
        background: resolve(__dirname, "app/background.ts"),
        manifest: resolve(__dirname, "app/manifest.ts"),
        options: resolve(__dirname, "app/options/options.ts"),
    },
    output: {
        filename: "[name].js",
        path: resolve(__dirname, `dist/${process.env.BROWSER}`),
    },
    optimization: {
        minimize: false,
        namedChunks: true,
        namedModules: true,
        occurrenceOrder: true,
        removeEmptyChunks: true,
        removeAvailableModules: true,
    },
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [
            {
                test: /manifest\.ts$/,
                use: ExtractTextPlugin.extract({use: []})
            },
            {
                test: /\.ts$/,
                use: "ts-loader",
            },
            {
                test: /\.(png|svg)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        context: resolve(__dirname, "app"),
                        name: "[path][name].[ext]",
                        outputPath: "",
                        publicPath: "/",
                    }
                }]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin([
            resolve(__dirname, `dist/${process.env.BROWSER}/*`),
        ], {verbose: false}),
        new webpack.EnvironmentPlugin([
            "BROWSER",
            "npm_package_name",
            "npm_package_version",
            "npm_package_description",
            "npm_package_homepage",
        ]),
        new ExtractTextPlugin("[name].json"),
        new HtmlWebpackPlugin({
            chunks: ["options"],
            filename: "options.html",
            template: resolve(__dirname, "app/options/options.ejs"),
        }),
        new CopyWebpackPlugin([
            {from: resolve(__dirname, "README.md")},
            {from: resolve(__dirname, "app/_locales"), to: "_locales"},
        ]),
        ...(process.argv.includes("production") ? [
            new ZipPlugin({
                exclude: /(manifest|messages)\.js$/,
                filename: [
                    process.env.npm_package_name,
                    process.env.npm_package_version,
                    process.env.BROWSER,
                ].join("-") + ".zip"
            })
        ] : [])
    ],
};

export default config;
