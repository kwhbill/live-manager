import {target, nameFormat, publicName, resolve} from "../resolve"

export default {
    output: {
        path: resolve(`./build`),
        filename: `${nameFormat}.js`,
        chunkFilename: `chk-${nameFormat}.js`,
        publicPath: `/${publicName}/`,
        library: `${nameFormat}`,
        libraryTarget: "amd"      
    }
}