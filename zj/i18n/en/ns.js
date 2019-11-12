let days = {
	day: "day",
	week: "week",
	month: "month",
	quarter: "quarter",
	year: "year",

	recent_day: "last {0} days",
	recent_week: "last {0} weeks",
	recent_month: "last {0} months",
	recent_quarter: "last {0} quarters",
	recent_year: "last {0} years",

	grading_week: "this week",
	grading_prev_week: "last week",
	grading_month: "this month",
	grading_prev_month: "last month",
	grading_quarter: "this quarter",
	grading_year: "this year",

	today:"Today",
	yesterday:"Yesterday",
	last_x_days:"Last {0} days",
	this_year:"This year"
}

let orgs = {
	team: "company",
	group: "group"
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
	"INSPECTION":"Inspection standard",
	"UPDATE_TIME": "System will finish the latest calculation between 2:00 am and 10:00 am."
}
let task_status = {
	"no_task": "No task",
	"not_started": "Not started",
	"being_contructed_inspected": "Being contructed/inspected",
	"completed": "Completed",
	"no_task": "No task",
	"no_data":"No data"
}
let pub = {
	"no_data": "No data"
}
let comparator = {
	"less_than": "Less than ",
	"not_less_than": "Not less than ",
	"highlight": "Highlight：",
	"compared_to":"Compared to ",
	"compared_to_last":"Compared to last ",
	"key_index_of_this_week": "Key index of this week",
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