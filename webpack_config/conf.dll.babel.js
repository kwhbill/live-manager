import merge from "webpack-merge"
import { resolveInfo } from "./resolve"
import moduleRules from "./module"

import entry from "./dll/entry"
import output from "./dll/output"
import plugins from "./dll/plugins"


export default merge(
    entry, 
    output, 
    plugins, 
    resolveInfo,
    moduleRules(false)
)
