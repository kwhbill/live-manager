import merge from "webpack-merge"
import {isDev, resolveInfo, target} from "./resolve"
import moduleRules from "./module"

import entry from "./prod/entry"
import output from "./prod/output"
import plugins from "./prod/plugins"
import extraConf from "./prod/extra"
console.log(entry);
export default merge(
    entry,
    output, 
    plugins, 
    resolveInfo,
    moduleRules(isDev, `${target}/`),
    extraConf(isDev)
)
