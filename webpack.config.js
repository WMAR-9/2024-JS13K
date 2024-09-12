'use strict';
const path = require('path');
//import { webpack } from 'webpack';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env, argv) => {

    const prodMode = argv.mode === 'production';

    const webpackConfig = {

        entry: {
            'index': './src/index.js',
        },
        output: {
            path: path.resolve(__dirname, 'public'),
            filename: 'index.js',
            clean: true
        },
        module:{
            rules:[
                {
                    test:/\.(css|sass)$/i,
                    use: ["css-loader"],
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({ 
                template: './src/index.html',
                filename: 'index.html'
            })
        ],

        devServer: {
            static: {
                directory: path.join(__dirname, 'src'),
            },
            port: 3000
        }
    }

    if (prodMode) {
        webpackConfig.optimization = {
            minimize: true,
            minimizer: [
                `...`,
                new CssMinimizerPlugin({
                    parallel: false,
                    minimizerOptions: {
                    processorOptions: {
                        parser: "sugarss",
                    },
                    },
                }),
            ]
        };
    }

    return webpackConfig;
};