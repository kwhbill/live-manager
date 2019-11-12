import Vue from "vue"


window.Vue2 = Vue

export function process(self, {consts, net, utils}){
    self.t = Vue.t
    _.merge(self, consts, net, utils)

}
