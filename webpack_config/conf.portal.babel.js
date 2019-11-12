import merge from "webpack-merge"
import {isDev, resolveInfo } from "./resolve"
import moduleRules from "./module"
import genDevTool from "./devtool"
import entry from "./portal/entry"
import output from "./portal/output"
import plugins from "./portal/plugins"

export default merge(
    entry, 
    output, 
    plugins, 
    resolveInfo,
    moduleRules(isDev, "portals/", true),
    genDevTool(isDev)
)
