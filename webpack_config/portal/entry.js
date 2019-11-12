import glob from "glob"
import {resolve} from "../resolve"

var entry = {}
let portalGlobPath = resolve("./portals/**/index.js")
let portalRegexp = /\/portals\/(.+)\/index\.js$/
glob.sync(portalGlobPath).forEach((portalPath) => {
    let entryName = portalPath.match(portalRegexp)[1]
    entry[entryName] = [portalPath]
})

export default {
    entry
}
