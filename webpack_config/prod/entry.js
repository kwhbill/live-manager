import glob from "glob"
import {resolve} from "../resolve"

var entry = {}
let prodGlobPath = resolve(`./src/**/page.vue`)
let prodPagePrefix = `/src/pages/`
glob.sync(prodGlobPath).forEach((prodPath) => {
    let entryName = prodPath.split(prodPagePrefix)[1].slice(0, "/page.vue".length * -1)
    entry[entryName] = [prodPath]
})

export default {
    entry
}
