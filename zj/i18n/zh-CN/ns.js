let days = {
	day: "天",
	week: "周",
	month: "月",
	quarter: "季",
	year: "年",

	recent_day: "近{0}天",
	recent_week: "近{0}周",
	recent_month: "近{0}月",
	recent_quarter: "近{0}季",
	recent_year: "近{0}年",

	grading_week: "本周",
	grading_prev_week: "上周",
	grading_month: "本月",
	grading_prev_month: "上月",
	grading_quarter: "本季度",
	grading_year: "本年",

	today: "今天",
	yesterday: "昨天",
	last_x_days: "近 {0} 天",
	this_year: "近一年"
}

let orgs = {
	team: "公司",
	group: "集团"
}

let members = {
	"TOTAL_PACKAGE": "总包",
	"SUBCONSTRACTOR": "分包",
	"SUPERVISOR": "监理",
	"PARTY_A": "甲方",
	"MATERIAL": "材料商",
	"DESIGN_COMPANY": "设计方",
	"CHECKER": "检查人员",
	"REPAIRER": "整改人员",
	"WORKER": "施工人员",
	"SPOTCHECKER": "抽查人员"
}
let inspection = {
	"CHOOSE_ORG":"选择组织 ",
	"INSPECTION": "检查项标准：",
	"UPDATE_TIME": "数据将于每日凌晨2:00至早上10:00期间完成更新"
}

let task_status = {
	"no_task": "无任务",
	"not_started": "未开始",
	"being_contructed_inspected": "进行中",
	"completed": "已完成",
	"no_data":"暂无数据"
}
let pub = {
	"no_data": "暂无数据"
}
let comparator = {
	"less_than": "低于",
	"not_less_than": "高或等于",
	"highlight": "警示：",
	"compared_to": "对比",
	"compared_to_last": "对比上",
	"key_index_of_this_week": "本周关键指标",
}
export default {
	days,
	orgs,
	members,
	inspection,
	task_status,
	comparator,
	pub
}