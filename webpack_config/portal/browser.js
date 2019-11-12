
(function(){
  window.APP_DISABLE = false
  var tmpl = {tmpl}
  var isIE = (/Trident|msie/i).test(navigator.userAgent)
  if (isIE) {
    /* 判断是否为IE，是则执行以下操作 */
    document.body.innerHTML = tmpl
    window.APP_DISABLE = true
    return
  }
}())
