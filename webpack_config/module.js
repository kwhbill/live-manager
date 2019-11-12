import ExtractTextPlugin from "extract-text-webpack-plugin"
import * as _ from "lodash"
var vueLoadersMap = {
    css: ["css-loader"],
    less: ["css-loader", "less-loader"]
}

function vueLoadersConfig(dev=false){
    let conf = {}
    _.each(vueLoadersMap, (loaders, lang)=>{
        if(dev){
            loaders.unshift("vue-style-loader")
        }else{
            loaders = ExtractTextPlugin.extract({
                use: loaders
            })
        }
        conf[lang] = loaders
    })
    return conf
}

export default function(dev=false, assetPrefix=""){
    return {
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: {
                        loader: "vue-loader",
                        options: {
                            loaders: vueLoadersConfig(dev)
                        }
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: ["babel-loader"]
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: "css-loader"
                    })
                },
                {
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: ["css-loader", "less-loader"]
                    })
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/,
                    use: {
                        loader: "url-loader",
                        options: {
                            limit: 1000,
                            name: `${assetPrefix}assets/imgs/[name].[ext]?[hash:8]`
                        }
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    use: [{
                        loader: "url-loader",
                        options: {
                            limit: 1000,
                            name: `${assetPrefix}assets/fonts/[name].[ext]?[hash:8]`
                        }
                    }]
                }
            ]
        }
    }
}