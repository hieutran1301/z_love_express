module.exports = {
    entry: './libs/react_ssr/main.jsx',
    output: {
        path: __dirname,
        filename: "./public/admin/assets/apps/js/bundle.js"
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                query: {
                    presets: [
                        'react',
                        'es2015'
                    ]
                },
                test: /\.jsx?$/,
                exclude: /node_modules/
            }
        ]
    }
};