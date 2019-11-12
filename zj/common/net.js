import axios from "axios"
export var request = axios.request

const liveOptsDefault = {
    baseURL: "/live/",
    responseType: "json",
    headers: {
        "Content-Type": "application/json"
    }
}
export function live(opts) {
    return restApi(liveOptsDefault, opts)
}

function wrapRestApi(fn) {
    return (opts) => {
        return fn(opts).then(res => {
            return res.data.data
        })
    }
}

export var w = {
    live: wrapRestApi(live),
}

function restApi(liveOptsDefault, opts) {
    if (_.isString(opts)) opts = {
        url: opts,
        method: "get"
    }
    opts = _.merge({}, liveOptsDefault, opts)

    let url = opts.url
    if (_.indexOf(url, "?") == -1 && _.last(url) != "/") {
        opts.url = url + "/"
    }
    return request(opts)
}
export var configRequest = (function () {
    var opts = {
        msgOnError: false
    }

    // 对 axios request 拦截
    axios.interceptors.request.use(
        function (config) {
            return config
        },
        function (error) {
            return Promise.reject(error)
        }
    )

    // 对 axios response 拦截
    axios.interceptors.response.use(
        function (response) { // before then
            return response
        },
        function (error) { // before catch
            return Promise.reject(error)
        }
    )

    return (newOpts = {}) => {
        opts = _.merge(opts, newOpts)
    }
})()
