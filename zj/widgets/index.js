import Vue from "vue"

import BasePage from "./base_page.vue"
import BaseApp from "./base_app.vue"

import NavMenu from "./nav/menu"
import NavLevel from "./nav/level"
import NavDlgPwd from "./nav/dlg_change_pwd"
import NavReturnTo from "./nav/return_top"
import NavBreadcrumb from "./nav/breadcrumb"
import Notification from './nav/notification'
import TaskWindow from './nav/task_window'
import Tree from "./tree/tree"
import SelectTree from "./select-tree/widget"
import TreeTable from "./tree-table/tree-table"
import NsStage from "./ns/stage"
import NsUI from "../stat/ui"

let components = {
    NavMenu,
    NavLevel,
    NavDlgPwd,
    NavReturnTo,
    NavBreadcrumb,
    Notification,
    TaskWindow,
    Tree,
    TreeTable,
    SelectTree
}

_.each(components, (component, key) => {
    Vue.component(key, component)
})

export default {
    BaseApp,
    BasePage,
    NsStage,
    NsUI
}