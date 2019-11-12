export const CATEGORY_CLS = {
    "FBFX": 21, // 分部分项
    "YBDP": 22,   // 样板点评
    "RCJC": 23, // 日常检查
    "YDJC": 24, // 月度检查
    "JDJC": 25, // 季度检查
    "RHYF": 26, // 入伙验房
    "ZXJC": 27, // 专项检查
    "FHYS": 28, // 分户验收
    "KEYPROCEDURE": 1,//关键工序
    "MEASURE": 102//实测实量
}


export const CHECK_TASK_STATUS = {
    "UNFIN": 1, // 未完成
    "FIN": 2,   // 已完成
    "CANCEL": 9 // 已取消
}

export const AREA_TYPES = {
    "PUBLIC": 1, // 公共区域
    "BUILDING": 2, // 楼栋
    "FLOOR": 3, // 层
    "HOUSE": 4, // 户
    "ROOM": 5,  // 房间
    "FLOOR_PUBLIC": 6, // 楼层公区
    "VILLA": 7, // 别墅
    "OTHER": 99  // 其它
}

export const ISSUE_LOG_STATUS = {
    NO_PROBLEM: 10,  // 没有问题
    RECORD_PROBLEM: 20,  // 已记录未分配
    WAITING_PROCESS: 30,  // 已分配未整改
    WAITING_APPROVED: 50,  // 已整改未审核
    APPROVED: 60,  // 已审核（销项）
    CANCEL: 70  // 已取消
}

export const ISSUE_LOG_TYPE = {
    NORMAL: 99,  // 普通记录
    FIND_PROBLEM: 1,  // 发现问题
    // GOOD: 2,  //优秀做法
    // DIFFICULT: 3  //困难问题
}

export const ISSUE_LOG_CONDITION = {
    SERIOUS: 3,  //严重
    RANGE_POOR: 2,  // 较差
    SLIGHT: 1  // 轻微
}

export const MEASURE_ISSUE_STATUS = {
    RECORD_PROBLEM: 1,  // 已记录未分配
    WAITING_PROCESS: 2,  // 已分配未整改
    WAITING_APPROVED: 3,  // 已整改未审核
    APPROVED: 4,  // 已审核（消项）
    CANCEL: 5  // 已取消
}
export const PROCEDURE_ISSUE_STATUS = {
    NO_PROBLEM: 0,  // 没有问题
    RECORD_PROBLEM: 1,  // 已记录未分配
    WAITING_PROCESS: 2,  // 已分配未整改
    WAITING_APPROVED: 3,  // 已整改未审核
    APPROVED: 4,  // 已审核（消项）
    CANCEL: 5  // 已取消
}

export const COMPANY_ROLES={
    PARTY_A:1,//甲方
    TOTAL_PACKAGE:2,//总包
    SUPERVISOR:3,//监理
    SUBCONSTRACTOR:4,//分包
    MATERIAL:5,//材料
    DESIGN_COMPANY:6//设计
}

export const TASK_STATUS = {
    QUEUEING: 10,
    BEING: 20,
    COMPLETE: 30,
    FAILURE: 9999
  }

export const STATUS = {//工序中的任务列表 状态
    ALL:"", //所有
    NORMAL: '1', //正常
    CLOSE: '2', //关闭
    FINISHED: '3' //完成
}
export const CHECK_STATUS = {//工序中的任务列表 检查状态
    ALL:"", //所有
    NOT_STARTED: '1', //未开始
    UNDER_INSPECTION: '2', //检查中
    PASS_INSPECTION: '3' //检查通过
}

export const TASK_ACTIVE_STATUS = {//工序中的任务列表 开关状态
    ALL: "", //所有
    OPEN: '1', //正常
    CLOSE: '-1', //关闭
}

export const WORK_STATUS = {//工序中的任务列表 施工状态
    ALL: "", //所有
    NO_START: '1', //未开始
    ABUILDING: '2', //施工中
    INSPECTION: '3', //报验
    FINISH: '4', //施工完成
}
export const ROLE_TYPE = {//角色
    BUILDER: "10", //施工人员
    INSPECTOR: '20', //检查人员
    SPOT_CHECK: '30',//抽查人员
}

export const PLAN_TYPE = {
    "ALL": 0,
    "GENERAL": 1,
    "BRANCH": 2,
    "SECTION": 3,
    "MONTH": 4,
    "WEEK": 5
}
