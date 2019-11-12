import {nameFormat, publicName, resolve} from "../resolve"

console.log(publicName);
export default {
    output: {
        path: resolve(`./build`),
        filename: `portals/${nameFormat}.js`,
        chunkFilename: `portals/chk-${nameFormat}.js`,
        publicPath: `/${publicName}/`
    }
}