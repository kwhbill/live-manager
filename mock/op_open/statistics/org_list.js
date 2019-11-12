(function (req, {Mock, require}) {
  let _ = require("lodash") // 加载第三方库, Mock 为 mockjs


  let reqBody = req.query.org_ids
  let orgIds = _.split(reqBody, ",")



  let data = {
    ['org_list|10-100']: [
      {
        'group_id|+1':1,
        'name': '@cword(10,20)',
      }
    ],
  }
  data = Mock.mock(data)
  data.org_list = _.concat(data.org_list,[{'group_id':100000,
    'name': '是的',
  },{'group_id':1000200,
    'name': '是的啊',
  }])
  // 返回 response 内容体
  return {
    result: 0,
    data
  }
})