(function (req, {Mock, require}) {
  let _ = require("lodash") // 加载第三方库, Mock 为 mockjs


  let reqBody = req.query.org_ids
  let orgIds = _.split(reqBody, ",")



  let data = {
    ['group_list|10-30']: [
      {
        'date|1-100': 1 ,
        'app_c|1-100': 100 ,
        'wap_c|1-100': 100 ,
      }
    ],
  }
  data = Mock.mock(data)
  // 返回 response 内容体
  return {
    result: 0,
    data
  }
})