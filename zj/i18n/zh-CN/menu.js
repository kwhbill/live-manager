let buildingqm = {
    "building_inspection":"工程检查",
    "create_common_task": "创建检查任务",
    "create_special_task": "创建（专项检查）任务",
    "task_management": "任务管理",
    "issue_management": "问题管理",
    "issue_management_my": "我的问题",
    "statistics_report": "统计报告",
    "daily_inspection_statistics": "日常检查",
    "monthly_inspection_statistics": "月度检查",
    "quarterly_inspection_statistics": "季度检查",
    "special_inspection_statistics": "专项检查",
    "scoring": "评分",
    "scoring_records": "评分记录",
    "check_item_management": "检查项管理"
}

let houseqm = {
    "house_inspection_1": "移动验房",
    "inspection_item_management": "检查项管理",
    "export_delivery_list": "导出交付清单表",
    "house_inspection": "分户验收",
    "create_new_task": "创建任务",
    "handover_inspection": "入伙验房",
    "proprietor_info_management": "业主信息管理",
    "handover_report": "验房报告"
}

let setting = {
    "stat": "统计汇总",
    "project_settings": "项目配置",
    "select_companies": "公司选择",
    "select_projects": "项目选择",
    "organization_chart": "组织架构",
    "partners": "合作伙伴" ,
    "setting": "系统设置",
    "role_management": "角色管理",
    "group_settings":"集团设置",
    "API_key": "API密钥",
    "project_users": "人员管理",
    "satistics_analysis_report": "统计分析",
    "user_activity_statistics": "功能使用统计"
}

let manage = {
    "staff_management": "人员管理"
}

let platform = {
    "my_operating_platform": "我的工作台",
    "export_file_list": "导出文件列表",
    "fundamental_information": "基础资料",
    "building_management": "楼栋管理",
    "lot_management": "标段管理",
    "house_layout_drawing": "户型管理",
    "fix_preset": "整改预设",
    "project_partners": "项目合作伙伴",
    "project_partner_staff": "项目合作伙伴人员",
    "project_bid_lot_management": "项目标段管理",
    "export_by_contractor": "通过整改人导出",
    "staff_list": "人员列表",
    "project_survey": "项目概况"
}

let measure = {
    "measure_management": "实测实量",
    "measure_area_management": "描画区域管理",
    "create_measure_task": "创建实测实量任务",
    "measure_task_list": "实测实量任务列表",
    "quick_search": "快速查询",
    "task_overview": "任务概览",
    "area_qualified_rate": "区域合格率",
    "issue_management_1": "爆点整改",
    "satistics_partner_analysis_report": "合作伙伴统计分析"
}

let key_procedure = {
    "key_procedure_management": "工序管理",
    "procedure_task_list": "工序任务列表",
    "create_procedure_task":"创建工序任务",
    "inspection_lot_list": "检验批列表"
}

let plan = {
    "project_schedule": "工程进度",
    "template_management": "模板管理",
    "schedule_planning":"进度计划",
    "configuration": "配置"

}

export default _.merge({}, buildingqm,houseqm, measure, platform, setting, manage, key_procedure, plan)