import * as CleanWebpackPlugin from "clean-webpack-plugin";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as fs from "fs";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { resolve } from "path";
import * as webpack from "webpack";
import * as ZipPlugin from "zip-webpack-plugin";

const localeDirs = fs.readdirSync(resolve(__dirname, "app/_locales"));

const config: webpack.Configuration = {
    entry: {
        background: resolve(__dirname, "app/background.ts"),
        manifest: resolve(__dirname, "app/manifest.ts"),
        options: resolve(__dirname, "app/options/options.ts"),
        ...localeDirs.reduce((locales, dir) => {
            const messageFile = `_locales/${dir}/messages`;
            locales[messageFile] = resolve(__dirname, `app/${messageFile}.ts`);
            return locales;
        }, {}),
    },
    output: {
        filename: "[name].js",
        path: resolve(`dist/${process.env.BROWSER}`),
    },
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [
            {
                test: /(messages|manifest)\.ts$/,
                use: ExtractTextPlugin.extract({ use: [] })
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
            resolve(`dist/${process.env.BROWSER}/*`),
        ], { verbose: false }),
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
        ...(process.argv.includes("--run-prod") ? [
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
