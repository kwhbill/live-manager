import NsTabs from "./part/tabs"
import NsRouter from "./part/router"
import NsLoading from "./part/loading"

import NsDayRangeRadioGroup from "./form/day-range-radio-group"
import NsDayRangeSelect from "./form/day-range-select"
import NsDaysSelect from "./form/days-select"
import NsSelect from "./form/select"
import NsButton from "./form/button"
import NsMultipleOrgSelect from "./form/multiple-org-select"
import NsOrgSelect from "./form/org-select"
import NsInput from "./form/input"
import NsRootCategorySelect from "./form/root-category-select"
import NsRootPartnerSelect from "./form/root-partner-select"
import NsCautionSelect from "./form/caution-select"
import NsRadioButtonGroup from "./form/radio-button-group"
import NsCategoryTreeSelect from './form/category-tree-select'
import NsCategoryBreadcrumb from "./form/category-breadcrumb"
import NsAreaBreadcrumb from "./form/area-breadcrumb"
import NsSwitch from "./form/switch"
import NsAreaTreeSelect from "./form/area-tree-select"
import NsMemberSelect from "./form/member-select"


import NsSource from "./source/source"

import NsTable from "./view/table"
import NsChart from "./view/chart"
import NsRankTable from "./view/rank-table/widget"
import NsIndicatorComparePanel from "./view/indicator-compare-panel"
import NsHeatmap from "./view/heatmap"


export var components = {
    // source 
    NsSource,

    // part
    NsTabs,
    NsRouter,
    NsLoading,

    // form
    NsDaysSelect,
    NsDayRangeSelect,
    NsDayRangeRadioGroup,
    NsSelect,
    NsButton,
    NsMultipleOrgSelect,
    NsOrgSelect,
    NsInput,
    NsRootCategorySelect,
    NsRootPartnerSelect,
    NsCautionSelect,
    NsRadioButtonGroup,
    NsCategoryTreeSelect,

    NsCategoryBreadcrumb,
    NsAreaBreadcrumb,
    NsSwitch,
    NsAreaTreeSelect,
    NsMemberSelect,

    // view 
    NsTable,
    NsChart,
    NsRankTable,
    NsIndicatorComparePanel,
    NsHeatmap
}
