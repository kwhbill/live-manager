import {
    isDev,
    target,
    resolve
} from "../resolve"
export default function () {
    return {
        entry: {
            "i18n": [resolve(`./src/i18n/index.js`)]
        },
        resolve: {
            alias: {
                "src": resolve(`./src/`),
                // leaflet
                "leaflet.css": resolve("node_modules/leaflet/dist/leaflet.css"),
                "leaflet_label.css": resolve("node_modules/leaflet.label/dist/leaflet.label.css"),
                "leaflet_test": resolve("node_modules/leaflet/dist/leaflet-src.js"),
                "leaflet_label_test": resolve("node_modules/leaflet.label/dist/leaflet.label-src.js")
            }
        },
        devtool: isDev ? "cheap-module-source-map" : false,
        externals: {
            vue: "vue2",
            zj: "zj",
            jquery: "jquery",
            lodash: "lodash",
            qs: "qs",
            axios: "axios",
            fecha: "fecha",
            "vue-router": "vue-router",
            echarts: "echarts"
        }
    }
}