(function (req, {Mock, require}) {
  let _ = require("lodash") // 加载第三方库, Mock 为 mockjs


  let reqBody = req.query.org_ids
  let orgIds = _.split(reqBody, ",")



  let data = {
    ['count_list|10-100']: [
      {
        'group_id|1-1000':1,
        'org_name': '@cword(3,6)',
        "status|1": [
           0,
           5,
           10,
           15,
           20,
           25
        ],
        'enable_date': new Date().getTime()/1000,
        'yesterday_app|1-100': 100 ,
        'yesterday_web|1-100': 100 ,
        'seven_app|1-50': 50 ,
        'seven_pc|1-50': 50
      }
    ],
    "count|100-1000": 10,
  }
  data = Mock.mock(data)
  // 返回 response 内容体
  return {
    result: 0,
    data
  }
})