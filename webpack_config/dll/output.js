import {nameFormat, publicName, resolve, dllNameTarget} from "../resolve"

export default {
    output: {
        pathinfo: true,
        path: resolve("./build/dll"),
        filename: `${nameFormat}.js`,
        publicPath: `/${publicName}/dll/`,
        library: dllNameTarget(nameFormat),
        libraryTarget: "var"
    }
}