let consts = {
    demo: {
        chart: {
            count_click: "点我计数："
        }
    },
    req: {
        net_err: "访问出错",
        res_err: "处理有误",
        need_login: "请先登录再操作"
    },

    dlg: {
        title_auth: "登录提示",
        btn_login: "前往登录"
    },

    measure: {
        issue_status: ["未定义","待指派", "待修复", "待销项", "已销项", "已关闭"],
        issue:{
            "token1124":"需整改问题",
            "token1162":"难以整改问题",
            "token1689":"待指派",
            "token1729":"待修复",
            "token1768":"待销项",
            "token1802":"已销项",
            "token1834":"已取消"
        },
        issue_status_map: {
            "RECORD_PROBLEM": "待指派",
            "WAITING_PROCESS": "待修复",
            "WAITING_APPROVED": "待销项",
            "APPROVED": "已销项",
            "CANCEL": "已取消"
        }
    },
    key_procedure: {
        issue_status_map: {
            "NO_PROBLEM":"没有问题",
            "RECORD_PROBLEM": "已记录未分配",
            "WAITING_PROCESS": "已分配未整改",
            "WAITING_APPROVED": "已整改未审核",
            "APPROVED": "已审核（销项）",
            "CANCEL": "已取消"
        },
       status:{
            "ALL":"所有",
            "NORMAL":"正常",
            "CLOSE":"关闭",
            "FINISHED":"完成"
        },
        check_status:{
            ALL: "所有", //所有
            NOT_STARTED: '未开始', 
            UNDER_INSPECTION: '检查中', 
            PASS_INSPECTION: '检查通过'
        },
        task_active_status:{
            "ALL": "所有", 
            "OPEN":"打开",
            "CLOSE":"关闭"
        },
        work_status: {
            "ALL": "所有",
            "NO_START": "未开始",
            "ABUILDING": "施工中",
            "INSPECTION": "报验",
            "FINISH": "施工完成",
        },
        role_type:{
            "BUILDER":"施工人员",
            "INSPECTOR":"检查人员",
            "SPOT_CHECK":"抽查人员"
        }
    },
    area: {
        types: {
            "PUBLIC": "公共区域",
            "BUILDING": "楼栋",
            "FLOOR": "层",
            "HOUSE": "户",
            "ROOM": "房间",
            "FLOOR_PUBLIC": "楼层公区",
            "VILLA": "别墅",
            "OTHER": "其它"
        }
    },

    proj: {
        category_cls: {
            "FBFX": "分部分项",
            "YBDP": "样板点评",
            "RCJC": "日常检查",
            "YDJC": "月度检查",
            "JDJC": "季度检查",
            "RHYF": "入伙验房",
            "ZXJC": "专项检查",
            "FHYS": "分户验收"
        }
    },

    houseqm: {
        issue_status: {
            "NO_PROBLEM": "记录",
            "RECORD_PROBLEM": "待分配",
            "WAITING_PROCESS": "待修复",
            "WAITING_APPROVED": "待销项",
            "APPROVED": "已销项",
            "CANCEL": "已取消"
        },

        issue_type: {
            "NORMAL": "记录",
            "FIND_PROBLEM": "问题",
            "GOOD": "优秀做法",
            "DIFFICULT": "困难问题"
        },

        issue_condition: {
            "SERIOUS": "严重",
            "RANGE_POOR": "较差",
            "SLIGHT": "轻微"
        }
    },


    app: {
       
        desc: "工程现场管理协作平台",
       
        layout: {
            change_passwd: "修改密码",
            exit: "退出",
            index: "个人首页"
        }
    },

    c: {
        more: "更多",
        operate: "操作",
        guest: "游客"
    },
    inspection: {
        issue_manage: {
            part: {
                "token1179": "记录",
                "token1213": "普通问题",
                "token1242": "优秀做法",
                "token1276": "难以整改问题",
                "token1803": "待分配",
                "token1843": "待整改",
                "token1882": "待销项",
                "token1916": "已销项",
                "token1948": "已关闭"
            }
        }
    },
    issue_manage:{
        part:{
            "records": "记录",
            "common": "普通问题",
            "great": "优秀做法",
            "token1276": "难以整改问题",
            "pending_assign": "待分配",
            "pending_fix": "待修复",
            "pending_audit": "待销项",
            "closed": "已销项",
            "Cancelled": "已取消"
        }
    },
    company_roles:{
        "PARTY_A": "甲方",
        "TOTAL_PACKAGE": "总包",
        "SUPERVISOR": "监理",
        "SUBCONSTRACTOR": "分包",
        "MATERIAL": "材料",
        "DESIGN_COMPANY": "设计"

    },
    category_cls:{
        "FBFX": "分部分项",
        "YBDP": "样板点评",
        "RCJC": "日常检查",
        "YDJC": "月度检查",
        "JDJC": "季度检查",
        "RHYF": "入伙验房",
        "ZXJC": "专项检查",
        "FHYS": "分户验收",
        "KEYPROCEDURE": "关键工序",
        "MEASURE": "实测实量"
    },
    task_status_font:{
        "QUEUEING": "队列中",
        "BEING": "正在执行",
        "COMPLETE": "完成",
        "FAILURE": "失败"
    },
    plan_type: {
        "ALL": "全部",
        "GENERAL": "总控计划",
        "BRANCH": "分部分项计划",
        "SECTION": "阶段计划",
        "MONTH": "月计划",
        "WEEK": "周计划"
    }
}

export default consts
