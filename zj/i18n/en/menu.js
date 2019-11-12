let buildingqm = {
    "building_inspection": "Building Inspection",
    "create_common_task": "Create Common Task",
    "create_special_task": "Create Special Task",
    "task_management": "Task Management",
    "issue_management": "Issue Management",
    "statistics_report": "Statistics Report",
    "daily_inspection_statistics": "Daily Inspection Statistics",
    "monthly_inspection_statistics": "Monthly Inspection Statistics",
    "quarterly_inspection_statistics": "Quarterly Inspection Statistics",
    "special_inspection_statistics": "Special Inspection Statistics",
    "scoring": "Scoring",
    "scoring_records": "Scoring Records",
    "check_item_management": "Check item management"
}

let houseqm = {
    "house_inspection_1": "House Inspection",
    "inspection_item_management": "Inspection Item Management",
    "house_inspection": "House inspection",
    "create_new_task": "Create new task",
    "handover_inspection": "Handover inspection",
    "proprietor_info_management": "Proprietor info management",
    "handover_report": "Handover report"

}

let setting = {
    "stat": "Statistics",
    "project_settings": "Project Settings",
    "select_companies": "Select Companies",
    "select_projects": "Select Projects",
    "organization_chart": "Organization Chart",
    "partners": "Partners" ,
    "setting": "Setting",
    "role_management": "Role Management",
    "group_settings":"Group Settings",
    "API_key": "API Key",
    "project_users": "Project Users",
    "statistics_analysis_report": "Statistics Analysis Report",
    "user_activity_statistics": "User Activity Statistics"
}

let manage = {
    "staff_management": "Staff Management"
}

let platform = {
    "my_operating_platform": "My Operating Platform",
    "export_file_list": "Export File List",
    "fundamental_information": "Fundamental Information",
    "building_management": "Building Management",
    "house_layout_drawing": "House Layout Drawing",
    "fix_preset": "Fix Preset",
    "project_partners": "Project Partners",
    "project_partner_staff": "Project Partner Staff",
    "project_bid_lot_management": "Project Bid Lot Management",
    "export_by_contractor": "Export By Contractor",
    "staff_list": "Staff List",
    "project_survey": "Project Survey"
}

let measure = {
    "measure_management": "Measure Management",
    "measure_area_management": "Measure Area Management",
    "create_measure_task": "Create Measure Task",
    "measure_task_list": "Measure Task List",
    "quick_search": "Quick Search",
    "task_overview": "Task Overview",
    "area_qualified_rate": "Area Qualified Rate",
    "issue_management_1": "Issue Management",
    "satistics_partner_analysis_report": "Satistics Partner Analysis Report"
}

let key_procedure = {
    "key_procedure_management": "Key Procedure Management",
    "procedure_task_list": "Procedure Task List",
    "create_procedure_task":"Create Procedure Task",
    "inspection_lot_list": "Inspection Lot List"

}
let plan = {
    "project_schedule": "Project Schedule",
    "template_management": "Template management",
    "schedule_planning":"Schedule planning",
    "configuration": "Configuration"

}

export default _.merge({}, buildingqm,houseqm, measure, platform, setting, manage, key_procedure, plan)