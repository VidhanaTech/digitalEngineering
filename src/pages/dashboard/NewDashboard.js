import React, { useState, useEffect } from "react"
import ClientNameIcon from "../../assets/img/icons/project-management/icon-clientname.svg"
import ProjectNameIcon from "../../assets/img/icons/project-management/icon-projectname.svg"
import ProjectTypeIcon from "../../assets/img/icons/project-management/icon-project-type.svg"
import ProjectStatusIcon from "../../assets/img/icons/project-management/icon-project-status.svg"
import DownloadIcon from "../../assets/img/new-dashboard/download-icon.svg"
import ProfilePic from "../../assets/img/profile.jpg"
import HeartIcon from "../../assets/img/heart.svg"
import ChartCard from "../KnowledgeManagement/ChartCard"
import apiClient from "../../common/http-common"
import LineChart from "../components/LineChart"
import PieChartNew from "../components/piechartNew"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import Papa from "papaparse"
import { Alert } from "../../components/Alert"
import { useNavigate } from "react-router-dom"
import { Routes } from "../../routes"
import Select from "react-select"
import reset from "../../assets/img/brand/reseticon.svg"
import { Modal, Form, Accordion } from "@themesberg/react-bootstrap"
import { connect } from "react-redux"
import StackBarChart from "../components/StackBarChart"
import ActiveUsersIcon from "../../assets/img/new_design/active-users-icon.svg"
import TotalArtifactsIcon from "../../assets/img/new_design/totalartifacts-icon.svg"
import GenAISearchesIcon from "../../assets/img/new_design/genai-icon.svg"
import KnowledgeCreditsIcon from "../../assets/img/new_design/knowledge-credits-icon.svg"
import AverageRateIcon from "../../assets/img/new_design/average-icon.svg"
import TotalEventsIcon from "../../assets/img/new_design/total-events-icon.svg"
import ChampionIcon from "../../assets/img/new_design/champion-icon.svg"
import EmployeeIcon from "../../assets/img/new_design/employee-icon.svg"
import EnrichingTeamIcon from "../../assets/img/new_design/enrichingteam-icon.svg"
import LeadingRegionIcon from "../../assets/img/new_design/leading-icon.svg"
import ViewArticle from "../KnowledgeManagement/ViewArticle"

const NewDashboard = ({ user }) => {
  const [logUserId] = useState(user.Id)
  let [isClientLoading, setIsClientLoading] = useState(true)
  let [isengageLoading, setIsengageLoading] = useState(true)
  let [isClassLoading, setIsClassLoading] = useState(true)
  let [isContributionSummary, setIsContributionSummary] = useState(true)
  const [engagements, setEngagements] = useState([])
  const [casestudies, setCasestudies] = useState([])
  const [knowledgewise, setKnowledgewise] = useState([])
  let [isLoading, setIsLoading] = useState(true)
  const [tableData, setTableData] = useState([])
  const [vxcount, setvxcount] = useState([])
  const [overallContribution, setOverallContribution] = useState([])
  const [popularArticle, setPopularArticle] = useState([])
  const [classification, setClassification] = useState([])
  let [topContributorslist, setTopContributorslist] = useState([])
  let [filteredData, setFilteredData] = useState(tableData)
  const currentDate = new Date()
  const newMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0")
  const newYear = currentDate.getFullYear().toString()
  let [month, setMonth] = useState(`${newYear}-${newMonth}`)
  const [isInitialReset, setIsInitialReset] = useState(true);
  const [searchValue, setSearchValue] = useState("")
  let [lastmonthArticleCount, setLastMonthArticleCount] = useState(0)
  let [lastUsersCount, setLastUsersCount] = useState(0)
  let [lastCaseStudyCount, setLastCaseStudyCount] = useState(0)
  let [lastBPCount, setLastBPCount] = useState(0)
  let [lastArtifactConsumption, setLastArtifactConsumption] = useState(0)
  let [lastKnowledgeCredits, setLastKnowledgeCredits] = useState(0)
  let [lastEventCount, setLastEventCount] = useState(0)
  let [lastCACount, setLastCACount] = useState(0)
  const navigate = useNavigate()
  const [articleViewDetails, setArticleViewDetails] = useState({})
  const [showDefault, setShowDefault] = useState(false)
  const [ShowDef, setShowDef] = useState(false)
  const handleClose = () => (
    setShowDefault(false), setShowDef(false), setArticleViewDetails({})
  )

  let [projScore, setProjScore] = useState([])
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);

  useEffect(() => {
    if (articleViewDetails?.Id) {
      setShowDefault(true)
    }
  }, [articleViewDetails])

  const handleArticleClick = (row) => {
    setArticleViewDetails(row)
    setShowDefault(true)
  }

  let [cardValue, setCardValue] = useState({
    totalusers: 0,
    activeusers: 0,
    totalactiveusers: 0,
    starproject: "",
    totalarticle: 0,
    ArtifactsPublishedCount: 0,
    casestudies: 0,
    bestpractices: 0,
    starofmonth: "",
    starofmonthRegion: "",
    starofmonthProjectName: "",
    starprojectRegion: "",
    regionwiseusrCount: 0,
    article_percent: 0,
    activeusers_precent: 0,
    articale_status: "",
    user_percent: 0,
    user_status: "",
    case_percent: 0,
    casestudies_status: "",
    practice_percent: 0,
    bestpractices_status: "",
    leadingRegioncount: "",
    knowledgeCredits: 0,
    KnowledgeCredits_precent: 0,
    knowledgeCredits_status: "",
    artifactConsumption: 0,
    artifactConsumption_precent: 0,
    artifactConsumption_status: "",
    enthusiastBadge: 0,
    catalystBadge: 0,
    proBadge: 0,
    championBadge: 0,
    EventCount: 0,
    EventCount_precent: 0,
    EventCount_status: "",
    CACount: 0,
    CACount_precent: 0,
    CACount_status: "",
    knowledgeCreditsContri: 0,
    knowledgeCreditsConsumption: 0,
    knowledgeCreditsTotalPoints:0,
    leadingRegionData:[],
    SearchCountData:[],
    EventsData:[],
  })

  const [selectVal, setSelectVal] = useState({
    client: { value: null, label: "All" },
    project: { value: null, label: "All" },
    category: { value: null, label: "All" },
    domain: { value: null, label: "All" },
    region: { value: null, label: "All" },
    month: { value: null, label: "All" }
  })

  const [postClientList, setPostClientList] = useState([])
  const [clientList, setClientList] = useState([{ value: null, label: "All" }])
  const [projectList, setProjectList] = useState([
    { value: null, label: "All" }
  ])
  const [categoryList, setCategoryList] = useState([
    { value: null, label: "All" }
  ])
  const [postcategoryList, setPostCategoryList] = useState([])
  const [domainList, setDomainList] = useState([{ value: null, label: "All" }])
  const [regionList, setRegionList] = useState([{ value: null, label: "All" }])
  let [badgeValues, setBadgeValues] = useState({
    Enthusiast: "0",
    Catalyst: "0",
    Pro: "0",
    Champion: "0"
  })
  const [highestBadge, setHighestBadge] = useState()
  let [sortedBadges, setSortedBadges] = useState([])

  const resetFilters = () => {
    setIsLoading(true)
    setIsengageLoading(true)
    setIsClientLoading(true)
    setIsClassLoading(true)
    selectVal.client.value = null
    selectVal.project.value = null
    selectVal.category.value = null
    selectVal.domain.value = null
    selectVal.region.value = null
    setSelectVal({
      client: { value: null, label: "All" },
      project: { value: null, label: "All" },
      category: { value: null, label: "All" },
      domain: { value: null, label: "All" },
      region: { value: null, label: "All" }
    })
    month = `${newYear}-${newMonth}`
    setMonth(`${newYear}-${newMonth}`)
    setTimeout(() => {
      filterDashboard()
    }, 2000)
  }

  const [eventsCount, setEventCount] = useState(0)

  useEffect(() => {
    handleCmt()
    apiClient
      .post("kmarticle/eventList")
      .then((res) => {
        const eventsWithStatus1 = res.data.filter((event) => event.Status === 1)
        setEventCount(eventsWithStatus1.length)
      })
      .catch((err) => { })

    apiClient
      .get("/lookup/ArticalCategory/1")
      .then((response) => {
        let arr = [{ value: null, label: "All" }]
        let carr = []
        if (response.data.lookup.length > 0) {
          response.data.lookup.forEach((element) => {
            arr.push({ value: element.Id, label: element.Name })
            carr.push({ value: element.Id, label: element.Name })
          })
        }
        setCategoryList(arr)
        setPostCategoryList(carr)
      })
      .catch(() => {
        Alert("error", "Please Try Again")
      })

    apiClient
      .get("/lookup/domain/1")
      .then((response) => {
        let arr = [{ value: null, label: "All" }]
        if (response.data.lookup.length > 0) {
          response.data.lookup.forEach((element) => {
            arr.push({ value: element.Id, label: element.Name })
          })
        }
        setDomainList(arr)
      })
      .catch(() => {
        Alert("error", "Please Try Again")
      })

    apiClient
      .get("/lookup/DeliveryLocation/1")
      .then((response) => {
        let arr = [{ value: null, label: "All" }]
        if (response.data.lookup.length > 0) {
          response.data.lookup.forEach((element) => {
            arr.push({ value: element.Id, label: element.Name })
          })
        }
        setRegionList(arr)
      })
      .catch(() => {
        Alert("error", "Please Try Again")
      })

    apiClient
      .post("project/searchall", {})
      .then((response) => {
        let arr = [{ value: null, label: "All" }]
        let parr = []
        if (response.data.project.length > 0) {
          response.data.project.forEach((element) => {
            arr.push({ value: element.id, label: element.Name })
            parr.push({ value: element.id, label: element.Name })
          })
        }
        setProjectList(arr)
        setPostProjectList(parr)
      })
      .catch(() => { })

    apiClient
      .post("kmarticle/topContributors")
      .then((res) => {
        setTopContributorslist(res.data)
      })
      .catch((err) => { })

    apiClient
      .post("/client/search", {
        clientId: "0",
        domainId: "0",
        towerId: "0",
        organizationId: "0",
        userId: "0"
      })
      .then((response) => {
        let arr = [{ value: null, label: "All" }]
        let parr = []
        if (response.data.client.length > 0) {
          response.data.client.forEach((element) => {
            arr.push({ value: element.Id, label: element.Name })
            parr.push({ value: element.Id, label: element.Name })
          })
        }
        setClientList(arr)
        setPostClientList(parr)
      })
      .catch((error) => {
        Alert("error", "Please Try Again")
      })
    filterDashboard()
  }, [])

  const filterDashboard = () => {
    setIsLoading(true)
    setIsengageLoading(true)
    setIsClientLoading(true)
    setIsClassLoading(true)
    setIsContributionSummary(true)
    let lastMonth,
      lastYear = null
    if (month) {
      const lastMonthDate = new Date(month)
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
      lastMonth = lastMonthDate.getMonth() + 1
      lastYear = lastMonthDate.getFullYear()
    }
    let pmonth,
      pyear = null
    if (month.split("-")[1]) pmonth = month.split("-")[1]
    if (month.split("-")[0]) pyear = month.split("-")[0]
    const data = {
      month: pmonth,
      year: pyear,
      lastMonth: lastMonth,
      lastYear: lastYear,
      projectId: selectVal.project.value,
      ClientId: selectVal.client.value,
      CategoryId: selectVal.category.value,
      domainId: selectVal.domain.value,
      regionId: selectVal.region.value
    }

// Request for upvotes
apiClient.post("kmarticle/kmarticle_get_up_down_vote", {
  type: 1,
  month: pmonth,
  year: pyear
}).then((res) => {
  const upvotes = res.data.data.length > 0 && res.data.data[0].votes !== undefined
  ? res.data.data[0].votes
  : 0;
  setUpvotes(upvotes);
}).catch((err) => {
  console.log(err);
});

// Request for downvotes
apiClient.post("kmarticle/kmarticle_get_up_down_vote", {
  type: 2,
  month: pmonth,
  year: pyear
}).then((res) => {
  const downvotes = res.data.data.length > 0 && res.data.data[0].votes !== undefined
  ? res.data.data[0].votes
  : 0;
  setDownvotes(downvotes);
}).catch((err) => {
  console.log(err);
});




    apiClient
      .post("kmarticle/kmdashboardContributionSummary", data)
      .then((res) => {
        setIsContributionSummary(false)
        setProjScore(res.data.teamcontribution)
        setFilteredData(res.data.teamcontribution)
        setTableData(res.data.teamcontribution)
      })
      .catch((err) => {
        setIsContributionSummary(false)
        setProjScore([])
        setFilteredData([])
        setTableData([])
      })
    apiClient.post("kmarticle/kmdashboard", data).then((res) => {
      let kmartical = res.data.kmartical[0]
      //Total Article
      let totalarticle = kmartical.totalarticle
      let ArtifactsPublishedCount = kmartical.ArtifactsPublishedCount
      let totalarticle_precent = kmartical.totalarticle_precent
      setLastMonthArticleCount(kmartical.totalarticle_precent)
      let articale_status = ""
      if (totalarticle_precent === 0) {
        articale_status = ""
      } else {
        let value =
          ((totalarticle - totalarticle_precent) / totalarticle_precent) * 100
        if (value < 0) {
          articale_status = " Decrease "
        } else {
          articale_status = " Increase "
        }
        totalarticle_precent = Number(Math.abs(value)).toFixed(0)
      }

      //Active users
      let activeusers = kmartical.activeusers
      // let ArtifactsPublishedCount = kmartical.ArtifactsPublishedCount
      let activeusers_precent = kmartical.activeusers_precent
      // setLastMonthArticleCount(kmartical.activeUsers_precent)
      let activeuser_status = ""
      if (activeusers_precent === 0) {
        activeuser_status = ""
      } else {
        let value =
          ((activeusers - activeusers_precent) / activeusers_precent) * 100
        if (value < 0) {
          activeuser_status = " Decrease "
        } else {
          activeuser_status = " Increase "
        }
        activeusers_precent = Number(Math.abs(value)).toFixed(0)
      }

      //Total Users
      let totalusers = kmartical.totalusers
      let totalusers_precent = kmartical.totalusers_precent
      setLastUsersCount(kmartical.totalusers_precent)
      let user_status = ""
      if (totalusers_precent === 0) {
        user_status = ""
      } else {
        let value =
          ((totalusers - totalusers_precent) / totalusers_precent) * 100
        if (value < 0) {
          user_status = " Decrease "
        } else {
          user_status = " Increase "
        }
        totalusers_precent = Number(Math.abs(value)).toFixed(0)
      }

      //Case Studies
      let casestudies = kmartical.casestudies
      let casestudies_precent = kmartical.casestudies_precent
      setLastCaseStudyCount(kmartical.casestudies_precent)
      let casestudies_status = ""
      if (casestudies_precent === 0) {
        casestudies_status = ""
      } else {
        let value =
          ((casestudies - casestudies_precent) / casestudies_precent) * 100
        if (value < 0) {
          casestudies_status = " Decrease "
        } else {
          casestudies_status = " Increase "
        }
        casestudies_precent = Number(Math.abs(value)).toFixed(0)
      }

      //Best Practices
      let bestpractices = kmartical.bestpractices
      let bestpractices_precent = kmartical.bestpractices_precent
      setLastBPCount(kmartical.bestpractices_precent)
      let bestpractices_status = ""
      if (bestpractices_precent === 0) {
        bestpractices_status = ""
      } else {
        let value =
          ((bestpractices - bestpractices_precent) / bestpractices_precent) *
          100
        if (value < 0) {
          bestpractices_status = " Decrease "
        } else {
          bestpractices_status = " Increase "
        }
        bestpractices_precent = Number(Math.abs(value)).toFixed(0)
      }

      let artifactConsumption = kmartical.artifactConsumption
      let artifactConsumption_precent = kmartical.artifactConsumption_precent
      setLastArtifactConsumption(kmartical.artifactConsumption_precent)
      let artifactConsumption_status = ""
      if (artifactConsumption_precent === 0) {
        artifactConsumption_status = ""
      } else {
        let value =
          ((artifactConsumption - artifactConsumption_precent) /
            artifactConsumption_precent) *
          100
        if (value < 0) {
          artifactConsumption_status = " Decrease "
        } else {
          artifactConsumption_status = " Increase "
        }
        artifactConsumption_precent = Number(Math.abs(value)).toFixed(0)
      }

      let knowledgeCredits = kmartical.knowledgeCredits
      let knowledgeCredits_precent = kmartical.knowledgeCredits_precent
      setLastKnowledgeCredits(kmartical.knowledgeCredits_precent)
      let knowledgeCredits_status = ""
      if (knowledgeCredits_precent === 0) {
        knowledgeCredits_status = ""
      } else {
        let value =
          ((knowledgeCredits - knowledgeCredits_precent) /
            knowledgeCredits_precent) *
          100
        if (value < 0) {
          knowledgeCredits_status = " Decrease "
        } else {
          knowledgeCredits_status = " Increase "
        }
        knowledgeCredits_precent = Number(Math.abs(value)).toFixed(0)
      }

      let EventCount = kmartical.EventCount
      let EventCount_precent = kmartical.EventCount_precent
      setLastEventCount(kmartical.EventCount_precent)
      let EventCount_status = ""
      if (EventCount_precent === 0) {
        EventCount_status = ""
      } else {
        let value =
          ((EventCount - EventCount_precent) / EventCount_precent) * 100
        if (value < 0) {
          EventCount_status = " Decrease "
        } else {
          EventCount_status = " Increase "
        }
        EventCount_precent = Number(Math.abs(value)).toFixed(0)
      }

      let CACount = kmartical.customerAccolades
      let CACount_precent = kmartical.customerAccolades_precent
      setLastCACount(kmartical.customerAccolades_precent)
      let CACount_status = ""
      if (CACount_precent === 0) {
        CACount_status = ""
      } else {
        let value = ((CACount - CACount_precent) / CACount_precent) * 100
        if (value < 0) {
          CACount_status = " Decrease "
        } else {
          CACount_status = " Increase "
        }
        CACount_precent = Number(Math.abs(value)).toFixed(0)
      }

      let enthusiastBadge = kmartical.enthusiastBadge
      let catalystBadge = kmartical.catalystBadge
      let proBadge = kmartical.proBadge
      let championBadge = kmartical.championBadge

      const updatedCardValue = {
        totalusers: totalusers || 0,
        activeusers: activeusers || 0,
        totalactiveusers: kmartical.totalactiveusers || 0,
        totalarticle: totalarticle || 0,
        ArtifactsPublishedCount: ArtifactsPublishedCount || 0,
        casestudies: casestudies || 0,
        starproject: kmartical.starproject || "",
        bestpractices: bestpractices || 0,
        starofmonth: kmartical.starofmonth || "",
        starofmonthRegion: kmartical.starofmonthRegion || "",
        starprojectRegion: kmartical.starprojectRegion || "",
        starofmonthProjectName: kmartical.starofmonthProjectName || "",
        article_percent: totalarticle_precent || 0,
        articale_status: articale_status,
        user_percent: totalusers_precent || 0,
        user_status: user_status,
        case_percent: casestudies_precent || 0,
        casestudies_status: casestudies_status,
        practice_percent: bestpractices_precent || 0,
        bestpractices_status: bestpractices_status,
        leadingRegioncount: kmartical.leadingRegioncount || "",
        regionwiseusrCount: kmartical.leadingRegionuserscount || 0,
        knowledgeCredits_status: knowledgeCredits_status,
        knowledgeCredits: kmartical.knowledgeCredits || 0,
        KnowledgeCredits_precent: kmartical.KnowledgeCredits_precent || 0,
        artifactConsumption_status: artifactConsumption_status,
        artifactConsumption: kmartical.artifactConsumption || 0,
        artifactConsumption_precent: kmartical.artifactConsumption_precent || 0,
        activeusers_precent: activeusers_precent || 0,
        enthusiastBadge: enthusiastBadge || 0,
        catalystBadge: catalystBadge || 0,
        proBadge: proBadge || 0,
        championBadge: championBadge || 0,
        EventCount: EventCount || 0,
        EventCount_precent: EventCount_precent || 0,
        EventCount_status: EventCount_status,
        CACount: CACount || 0,
        CACount_precent: CACount_precent || 0,
        CACount_status: CACount_status,
        knowledgeCreditsContri: kmartical.knowledgeCreditsContri || 0,
        knowledgeCreditsConsumption: kmartical.knowledgeCreditsConsumption || 0,
        knowledgeCreditsTotalPoints: kmartical.knowledgeCreditsTotalPoints || 0,
        leadingRegionData: kmartical.leadingRegionData || [],
        SearchCountData: kmartical.SearchCountData || [],
        EventsData: kmartical.EventsData || [],
      }
      setCardValue(updatedCardValue)
      setIsLoading(false)
    })

    apiClient.post("kmarticle/kmdashboardcasestudies", data).then((res) => {
      if (res.data.engagement.length > 0) {
        let earr = res.data.engagement.map((row) => ({
          label: row.month,
          value: row.count,
          color: "#9de6a1"
        }))
        setEngagements(earr)
      }
      else{
        setEngagements([])
      }

      // if (res.data.casestudies.length > 0) {
      //   let earr = res.data.casestudies.map((row) => ({
      //     label: row.month,
      //     value: row.count,
      //     color: "#9de6a1"
      //   }))
      //   setCasestudies(earr)
      // }

      if (res.data.search.length > 0) {
        let earr = res.data.search.map((row) => ({
          label: row.month,
          value: row.search_count,
          color: "#9de6a1"
        }))
        setCasestudies(earr)
      }
      else{
        setCasestudies([])
      }
      
      if (res.data.knowledgewise.length > 0) {
        let earr = res.data.knowledgewise.map((row) => ({
          label: row.month,
          value: row.count,
          color: "#9de6a1"
        }))
        setKnowledgewise(earr)
      }

      if (res.data.vx.length > 0) {
        let earr = res.data.vx.map((row) => ({
          label: row.month,
          value: row.count,
          color: "#9de6a1"
        }))
        setvxcount(earr)
      }
      setIsengageLoading(false)
    })


    // apiClient.get('kmarticle/totalsearchcount').then((res) => {
    //   console.log(res.data);
    //   let earr = res.data.map((row) => {
    //     const date = new Date(row.CreatedAt);
    //     const formattedDate = date.toLocaleString('default', { month: 'short' }) + ' ' + date.getDate();
    //     return {
    //       label: formattedDate,
    //       value: row.SearchCount,
    //       color: "#9de6a1"
    //     };
    //   });
    //   setCasestudies(earr);
    // });



    //  useEffect(()=>{
    //   apiClient.get("kmarticle/knowledgecredits_contri_consumption", { 
    //     month: pmonth,
    //     year: pyear,
    //   }).then((res) => {
    //     setkcConsumption(res.data[0].ConsumptionPoints);
    //     setkcContribution(res.data[0].ContributionPoints);
    //     setkcTotalPoints(res.data[0].TotalPoints);
    //     console.log(kcConsumption)
    //     console.log(kcContribution)
    //   });
    // },)


    // useEffect(()=>{
    //   kccontri()
    // },[])

  //   apiClient.post(" kmarticle/get_usersdata_barchart", data).then((res) => {
  //     // let carr = res.data.clientwise.map((row) => ({
  //     //   id: 2,
  //     //   label: row.Name,
  //     //   value: row.article,
  //     //   value1: row.casestudy,
  //     //   value2: row.km,
  //     //   value3: row.vx,
  //     //   color: "rgb(5 3 70)",
  //     // }));
  //     const transformedData = res.data.regionwise.reduce((result, item) => {
  //       const { tMonth, totalcount, active } = item
  //       const existingItem = result.find((entry) => entry.label === tMonth)

  //       if (existingItem) {
  //         existingItem[totalcount.trim()] = active
  //       } else {
  //         const newItem = { label: tMonth }
  //         newItem[totalcount.trim()] = active
  //         result.push(newItem)
  //       }
  //       console.log();
  //       return result
  //     }, [])
  //     setOverallContribution(transformedData)
  //     setIsClientLoading(false)
  //   })
  // }

  
  apiClient.post("kmarticle/get_usersdata_barchart", data).then((res) => {
    const transformedData = res.data.reduce((result, item) => {
      const { month, total_count, active_count } = item;
      const inactive_count = total_count - active_count;
 
      const existingItem = result.find((entry) => entry.label === month);
 
      if (existingItem) {
        existingItem.active_count = active_count;
        existingItem.inactive_count = inactive_count;
      } else {
        // const newItem = { label: month, active_count, inactive_count };
        const newItem = { label: month, Active: active_count, Inactive: inactive_count };

        result.push(newItem);
      }
 
      return result;
    }, []);
 
    setOverallContribution(transformedData);
    setIsClientLoading(false);
  });
  
  
}

  useEffect(() => {
    setIsClassLoading(true);
    let BadgeTotal =
      parseInt(cardValue.enthusiastBadge, 10) +
      parseInt(cardValue.catalystBadge, 10) +
      parseInt(cardValue.proBadge, 10) +
      parseInt(cardValue.championBadge, 10)

    if (BadgeTotal !== 0) {
      let enthusiastBad =
        (parseInt(cardValue.enthusiastBadge) / BadgeTotal) * 100
      let catalystBad = (parseInt(cardValue.catalystBadge) / BadgeTotal) * 100
      let proBad = (parseInt(cardValue.proBadge) / BadgeTotal) * 100
      let championBad = (parseInt(cardValue.championBadge) / BadgeTotal) * 100

      badgeValues = {
        Enthusiast: Number(Math.abs(enthusiastBad)).toFixed(0),
        Catalyst: Number(Math.abs(catalystBad)).toFixed(0),
        Pro: Number(Math.abs(proBad)).toFixed(0),
        Champion: Number(Math.abs(championBad)).toFixed(0)
      }
      setBadgeValues(badgeValues)

      let colarr = ["#7F0127", "#8B4A9E", "#5A9ECB", "#EC954E", "#00b4b0"]

      const clarr = []
      if (Number(Math.abs(enthusiastBad)).toFixed(0) > 0) {
        clarr.push({
          label: "Enthusiast",
          value: Number(Math.abs(enthusiastBad)).toFixed(0),
          color: colarr[0]
        })
      }
      if (Number(Math.abs(catalystBad)).toFixed(0) > 0) {
        clarr.push({
          label: "Catalyst",
          value: Number(Math.abs(catalystBad)).toFixed(0),
          color: colarr[1]
        })
      }
      if (Number(Math.abs(proBad)).toFixed(0) > 0) {
        clarr.push({
          label: "Pro",
          value: Number(Math.abs(proBad)).toFixed(0),
          color: colarr[2]
        })
      }
      if (Number(Math.abs(championBad)).toFixed(0) > 0) {
        clarr.push({
          label: "Champion",
          value: Number(Math.abs(championBad)).toFixed(0),
          color: colarr[3]
        })
      }

      setClassification(clarr)
      setIsClassLoading(false)
    } else {
      badgeValues = {
        Enthusiast: "0",
        Catalyst: "0",
        Pro: "0",
        Champion: "0"
      }
      let colarr = ["#7F0127", "#8B4A9E", "#5A9ECB", "#EC954E", "#00b4b0"]

      const clarr = [
        {
          label: "Enthusiast",
          value: 0,
          color: colarr[0]
        },
        {
          label: "Catalyst",
          value: 0,
          color: colarr[1]
        },
        {
          label: "Pro",
          value: 0,
          color: colarr[2]
        },
        {
          label: "Champion",
          value: 0,
          color: colarr[3]
        }
      ]
      setClassification(clarr)
      setIsClassLoading(false)
      setBadgeValues(badgeValues)
    }

    const badgeEntries = Object.entries(badgeValues)
    badgeEntries.sort((a, b) => b[1] - a[1])

    setHighestBadge(badgeEntries[0][0])

    sortedBadges = badgeEntries.slice(1).map(([badge, value]) => {
      return { badge, value }
    })
    setSortedBadges(sortedBadges)
  }, [cardValue])

  //active users calc
  const totalUsers = cardValue.totalusers
  const activeUsers = cardValue.activeusers
  const totalactiveusers = cardValue.totalactiveusers

  const percentageActiveUsers = Math.round((activeUsers / totalUsers) * 100) || 0;

  let [regUsers, setRegUsers] = useState(0)
  let [searchCount, setSearchCount] = useState(0)
  let [searchSuccCount, setSearchSuccCount] = useState(0)
  let [regionwiseuserCount, setregionwiseuserCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("kmarticle/registereduserscount")
        setRegUsers(response.data[0]?.TotalUserCount)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await apiClient.get("kmarticle/totalsearchcount",{year:currentyear})
  //       setSearchCount(response.data.length)
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }
  //   fetchData()
  // }, [])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await apiClient.get("kmarticle/getsuccsearchcount")
  //       setSearchSuccCount(response.data[0]?.SearchSuccCount)
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }
  //   fetchData()
  // }, [])

  let regionUserCount = cardValue.regionwiseusrCount;

  const GensearchCount = cardValue.SearchCountData.length;

  const GenSuccCount = cardValue.SearchCountData.filter(item => item.type === 1).length;


  let clickThruRate = GensearchCount> 0 ? Math.min(100, Math.max(0, Math.round((GenSuccCount / GensearchCount) * 100))) || 0 : 0;

  let regionwiseusrCount = Math.round((regionUserCount / totalUsers) * 100)

  const TotalEvents = cardValue.EventsData.length;

  let total = 0;
  cardValue.EventsData.map((row) => {
      total += (row.registerUser / totalactiveusers) * 100;
  });
  
  const ParticipationIndex =
    TotalEvents > 0
      ? Math.min(100, Math.max(0, Math.round((total / TotalEvents) * 100))) || 0
      : 0;
  
  let [maxCNTValue, setMaxCNTValue] = useState(0);

  useEffect(() => {
    let totalMaxCNT = cardValue.leadingRegionData.reduce((sum, data) => sum + data.maxCNT, 0);
    setMaxCNTValue(totalMaxCNT);
  }, [cardValue.leadingRegionData]); // Add cardValue.leadingRegionData as a dependency

  // Now you can use maxCNTValue in your calculation
  let leadingRegionContri =
    Math.min(100, Math.max(0, Math.round((cardValue.leadingRegionData[0]?.maxCNT / maxCNTValue) * 100))) || 0;


  const totalVotes = upvotes + downvotes;
  const satisfactionRate = totalVotes > 0 ? Math.round((upvotes / totalVotes) * 100) : 0;

  let kcConsumption = cardValue.knowledgeCreditsConsumption;
  let kcContribution = cardValue.knowledgeCreditsContri;
  let kcTotalPoints = cardValue.knowledgeCreditsTotalPoints;


  const kCConsumption = Math.min(100, Math.max(0, Math.round((kcConsumption / kcTotalPoints) * 100)));
  const kCContribution = Math.min(100, Math.max(0, Math.round((kcContribution / kcTotalPoints) * 100)));


  const highestTotalPublishedProject = projScore.reduce(
    (maxProject, currentProject) => {
      return currentProject?.current_published > maxProject?.current_published
        ? currentProject
        : maxProject
    },
    projScore[0]
  )

  let ProjContribution

  if (cardValue.ArtifactsPublishedCount !== 0) {
    ProjContribution = Math.round(
      (highestTotalPublishedProject?.current_published /
        cardValue?.ArtifactsPublishedCount) *
      100
    ) || 0
  } else {
    ProjContribution = 0
  }

  const handleSearch = (event) => {
    setSearchValue(event.target.value)
    filterData(event.target.value)
  }
  function handleExport(data) {
    const headers = [
      { label: "Author", key: "team" },
      { label: "Project Name", key: "ProjectName" },
      { label: "Client Name", key: "ClientName" },
      { label: "Total Published", key: "totalpublished" },
      { label: "No. of Posts submitted", key: "current_submitted" },
      { label: "No. of Posts Published", key: "current_published" }
    ]

    const exportData = data.map((row) =>
      headers.reduce((acc, header) => {
        if (row[header.key] === "start_date" || row[header.key] === "end_date")
          acc[header.label] = changeStartDateFormat(row[header.key])
        else acc[header.label] = row[header.key]
        return acc
      }, {})
    )
    const csvData = Papa.unparse(exportData)

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" })
    saveAs(blob, "Article Contribution Summary.csv")
  }
  const filterData = (value) => {
    const lowerCaseValue = value.toLowerCase().trim()
    const filtereddData = tableData.filter(
      (item) =>
        item.team.toLowerCase().includes(lowerCaseValue) ||
        item.ProjectName.toLowerCase().includes(lowerCaseValue) ||
        item.ClientName.toLowerCase().includes(lowerCaseValue)
    )
    setFilteredData(filtereddData)
  }

  const columns = [
    {
      name: "Author",
      selector: (param) => param?.team,
      sortable: true,
      filter: (
        <input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={handleSearch}
        />
      )
    },
    {
      name: "Project",
      selector: (param) => param?.ProjectName,
      sortable: true
    },
    {
      name: "Client",
      selector: (param) => param?.ClientName,
      sortable: "true"
    },
    {
      name: "Total",
      selector: (param) => param?.totalpublished,
      sortable: "true"
    },
    {
      name: "Submitted",
      selector: (param) => param?.current_submitted,
      sortable: "true"
    },
    {
      name: "Published",
      selector: (param) => param?.current_published,
      sortable: "true"
    }
  ]

  const [isAccordionOpen, setIsAccordionOpen] = useState(false)

  const toggleAccordion = () => {
    setIsAccordionOpen((prevState) => !prevState)
  }

  const [submittedCount, setSubmittedCount] = useState(0)
  useEffect(() => {
    apiClient
      .post("kmarticle/kmarticleunpublished", { UserId: logUserId })
      .then((res) => {
        setSubmittedCount(res?.data?.length)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleCmt = () => {
    apiClient
      .post("kmarticle/latestArticlenew", {
        UserId: logUserId,
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        sort: 2,
        limit: 5,
        start: 0,
        des: null,
        articleId: null
      })
      .then((res) => {
        setPopularArticle(res.data.data)
      })
      .catch(() => { })
  }
  useEffect(() => {
    getKMWiseCHart()
  }, [badgeValues])
  const [kmArticleRewardChart, setKmArticleRewardChart] = useState({
    label: [],
    value: [],
    color: []
  })
  const getKMWiseCHart = () => {
    const transformedArray = Object.entries(badgeValues).map(
      ([badge, value]) => ({
        [badge]: value
      })
    )
    const colarr = ["#7F0127", "#8B4A9E", "#5A9ECB", "#EC954E", "#00b4b0"]

    const transformedData = transformedArray.map((item, index) => {
      const label = Object.keys(item)[0]
      const value = parseInt(Object.values(item)[0], 10)
      const color = colarr[index]
      return {
        label: label,
        value: value,
        color: color
      }
    })

    setKmArticleRewardChart(transformedData)
  }
  return (
    <>
      <div className="flex justify-end mt-2">
        <button
          className="mt-4 maincontent__btn maincontent__btn--primaryblue w-fit md:m-0"
          onClick={() => {
            navigate(Routes.NewArticles)
          }}
        >
          My Dashboard
        </button>
      </div>
      <Accordion activeKey={isAccordionOpen ? "1" : "0"} className="my-2">
        <Accordion.Item eventKey="1">
          <Accordion.Header
            onClick={toggleAccordion}
            className="accordionheader"
          >
            Search
          </Accordion.Header>
          <Accordion.Body
            style={{ visibility: "visible" }}
            className="accordionnew"
          >
            <div
              className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6"
              style={{ width: "97%" }}
            >
              <Form.Group id="domain">
                <Form.Label>Domain</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="inputIconCont input-group-text icon-container">
                      <img
                        src={ProjectTypeIcon}
                        alt="client name"
                        className="input-icon"
                      />
                    </span>
                  </div>
                  <Select
                    className="selectOptions"
                    options={domainList.map((domain) => ({
                      value: domain.value,
                      label: domain.label
                    }))}
                    placeholder=""
                    value={selectVal.domain}
                    onChange={(e) => {
                      selectVal.domain = e
                      setSelectVal({ ...selectVal, domain: e })
                      filterDashboard()
                    }}
                  />
                </div>
              </Form.Group>

              <Form.Group id="region">
                <Form.Label>Region</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="inputIconCont input-group-text icon-container">
                      <img
                        src={ProjectStatusIcon}
                        alt="client name"
                        className="input-icon"
                      />
                    </span>
                  </div>
                  <Select
                    className="selectOptions"
                    options={regionList.map((region) => ({
                      value: region.value,
                      label: region.label
                    }))}
                    placeholder=""
                    value={selectVal.region}
                    onChange={(e) => {
                      selectVal.region = e
                      setSelectVal({ ...selectVal, region: e })
                      filterDashboard()
                    }}
                  />
                </div>
              </Form.Group>

              <Form.Group id="project">
                <Form.Label>Period</Form.Label>
                <div>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="inputIconCont input-group-text icon-container">
                        <img
                          src={ProjectStatusIcon}
                          alt="client name"
                          className="input-icon"
                        />
                      </span>
                    </div>
                    <Form.Control
                      className="selectOptions"
                      required
                      type="month"
                      value={month}
                      placeholder="mm/dd/yyyy"
                      onChange={(e) => {
                        month = e.target.value
                        setMonth(e.target.value)
                        filterDashboard()
                      }}
                    />
                  </div>
                </div>
              </Form.Group>

              <Form.Group id="client">
                <Form.Label>Client</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="inputIconCont input-group-text icon-container">
                      <img
                        src={ClientNameIcon}
                        alt="client name"
                        className="input-icon"
                      />
                    </span>
                  </div>
                  <Select
                    className="selectOptions"
                    options={clientList.map((client) => ({
                      value: client.value,
                      label: client.label
                    }))}
                    placeholder="Select Client"
                    value={selectVal.client}
                    onChange={(e) => {
                      selectVal.client = e
                      setSelectVal({ ...selectVal, client: e })
                      filterDashboard()
                    }}
                  />
                </div>
              </Form.Group>

              <Form.Group id="project">
                <Form.Label>Project</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="inputIconCont input-group-text icon-container">
                      <img
                        src={ProjectNameIcon}
                        alt="client name"
                        className="input-icon"
                      />
                    </span>
                  </div>
                  <Select
                    className="selectOptions"
                    options={projectList.map((project) => ({
                      value: project.value,
                      label: project.label
                    }))}
                    placeholder=""
                    value={selectVal.project}
                    onChange={(e) => {
                      selectVal.project = e
                      setSelectVal({ ...selectVal, project: e })
                      filterDashboard()
                    }}
                  />
                </div>
              </Form.Group>

              <Form.Group id="category">
                <Form.Label>Category</Form.Label>
                <div>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="inputIconCont input-group-text icon-container">
                        <img
                          src={ClientNameIcon}
                          alt="client name"
                          className="input-icon"
                        />
                      </span>
                    </div>
                    <Select
                      className="selectOptions"
                      options={categoryList.map((category) => ({
                        value: category.value,
                        label: category.label
                      }))}
                      placeholder=""
                      value={selectVal.category}
                      onChange={(e) => {
                        selectVal.category = e
                        setSelectVal({ ...selectVal, category: e })
                        filterDashboard()
                      }}
                    />
                  </div>
                  <img
                    className="resetIconKM"
                    style={{ color: "#1658a0", cursor: "pointer" }}
                    title="Reset"
                    src={reset}
                    onClick={() => {
                      resetFilters()
                    }}
                  />
                </div>
              </Form.Group>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div className="grid grid-cols-5 gap-2 text-black">
        {isLoading ? (
          <div class="circle__loader items-center my-0 mx-auto"></div>
        ) : (
          <div className="overflow-hidden text-black bg-[#e6e8f0] maincontent__card--content maincontent__card--content-woheader">
            <div className="flex flex-col gap-1 w75">
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-[#2d9800]">
                  {cardValue.activeusers.toLocaleString()}
                </span>
                <span className="text-sm font-semibold">Active Users</span>
              </div>
              <span className="card__line"></span>
              <span className="text-[10px]">
                {month && (
                  <>
                    {/* {cardValue.totalarticle === lastmonthArticleCount
                      ? "No Change from Last Month"
                      // : cardValue.articale_status
                      // ? cardValue.article_percent +
                      //   "%" +
                      //   cardValue.articale_status +
                      //   " from last month"
                      // : "Last month total article was " + lastmonthArticleCount
                      : "of Total Employees"
                      } */}
                    {percentageActiveUsers}% of Total Employees
                  </>
                )}
              </span>
            </div>
            <div className="bg-[#d2d4db] maincontent__card--content-circleWithIcon bg-[rgba(0,0,0,10%)]"></div>
            <img
              src={ActiveUsersIcon}
              className="z-0 maincontent__card--content-icon"
            />
          </div>
        )}

        {/* {isLoading ? (
          <div class="circle__loader items-center my-0 mx-auto"></div>
        ) : (
          <div className="overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader bg-[rgba(0,0,0,6%)]">
            <div className="flex flex-col gap-1 w75">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold">
                  {cardValue.artifactConsumption} Artifacts
                </span>
                <span className="text-sm font-semibold">Consumption</span>
              </div>
              <span className="card__line"></span>
              <span className="text-[10px]">
                {month && (
                  <>
                    {cardValue.artifactConsumption === lastArtifactConsumption
                      ? "No Change from prey Month"
                      : cardValue.artifactConsumption_status
                      ? cardValue.artifactConsumption_precent +
                        "%" +
                        cardValue.artifactConsumption_status +
                        " from prey month"
                      : "Last month total artifact was " +
                        lastArtifactConsumption}
                  </>
                )}
              </span>
            </div>
            <div className="maincontent__card--content-circleWithIcon bg-[rgba(1,1,1,5%)]"></div>
            <img
              src={ConsumptionIcon}
              className="z-0 maincontent__card--content-icon"
            />
          </div>
        )} */}
        {isLoading ? (
          <div class="circle__loader items-center my-0 mx-auto"></div>
        ) : (
          <div className="overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader bg-[#e0e2ea]">
            <div className="flex flex-col gap-1 w75">
              <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-[#ff3169]">
                {cardValue.totalarticle.toLocaleString()}
              </span>
                <span className="text-sm font-semibold">Total Artifacts</span>
              </div>
              <span className="card__line"></span>
              <span className="text-[10px]">
                {month && (
                  <>
                    {/* {cardValue.artifactConsumption === lastArtifactConsumption
                      ? "No Change from prey Month"
                      // : cardValue.artifactConsumption_status
                      // ? cardValue.artifactConsumption_precent +
                      //   "%" +
                      //   cardValue.artifactConsumption_status +
                      //   " from prey month"
                      // : "Submitted: " +
                      //   lastArtifactConsumption
                      :"Submitted:0"
                        };
                    {cardValue.artifactConsumption === lastArtifactConsumption
                      ? "No Change from prey Month"
                      // : cardValue.artifactConsumption_status
                      // ? cardValue.artifactConsumption_precent +
                      //   "%" +
                      //   cardValue.artifactConsumption_status +
                      //   " from prey month"
                      // : "Published: " +
                      //   lastArtifactConsumption
                      :"Publsihed:0"
                        } */}
                    {/* Submitted:{" "}{submittedCount};  */}
                    Published: {cardValue.ArtifactsPublishedCount.toLocaleString()}
                    {cardValue.totalarticle > 0 && (
                      <>
                        {" "}
                        (
                        {Math.floor(
                          (cardValue.ArtifactsPublishedCount /
                            cardValue.totalarticle) *
                          100
                        )}
                        %)
                      </>
                    )}
                  </>
                )}
              </span>
            </div>
            <div className="maincontent__card--content-circleWithIcon bg-[#d7d9e0]"></div>
            <img
              src={TotalArtifactsIcon}
              className="z-0 maincontent__card--content-icon"
            />
          </div>
        )}

        {/* {isLoading ? (
          <div class="circle__loader items-center my-0 mx-auto"></div>
        ) : (
          <div className="overflow-hidden text-black bg-[rgba(0,0,0,6%)] maincontent__card--content maincontent__card--content-woheader">
            <div className="flex flex-col gap-1 w75">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold">
                  {cardValue.casestudies}
                </span>
                <span className="text-sm font-semibold">Success Stories</span>
              </div>
              <span className="card__line"></span>
              <span className="text-[10px]">
                {month && (
                  <>
                    {cardValue.casestudies === lastCaseStudyCount
                      ? "No Change from Last Month"
                      : cardValue.casestudies_status
                      ? cardValue.case_percent +
                        "%" +
                        cardValue.casestudies_status +
                        " from prey month"
                      : "Last month total success stories was " +
                        lastCaseStudyCount}
                  </>
                )}
              </span>
            </div>
            <div className="bg-[rgba(0,0,0,5%)] maincontent__card--content-circleWithIcon"></div>
            <img
              src={StoriesIcon}
              className="z-0 maincontent__card--content-icon"
            />
          </div>
        )} */}
        {isLoading ? (
          <div class="circle__loader items-center my-0 mx-auto"></div>
        ) : (
          <div className="overflow-hidden text-black bg-[#e6e8f0] maincontent__card--content maincontent__card--content-woheader">
            <div className="flex flex-col gap-1 w75">
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-[#00a0cf]">
                  {GensearchCount.toLocaleString()}
                </span>
                <span className="text-sm font-semibold">GenAI searches</span>
              </div>
              <span className="card__line"></span>
              <span className="text-[10px]">
                {month && (
                  <>
                    {/* {cardValue.casestudies === lastCaseStudyCount
                      ? "No Change from Last Month"
                      : // : cardValue.casestudies_status
                        // ? cardValue.case_percent +
                        //   "%" +
                        //   cardValue.casestudies_status +
                        //   " from prey month"
                        // : "clicking through rate : " +
                        //   lastCaseStudyCount
                        "Click through rate: 81%"} */}
                    Click through rate: {clickThruRate}%
                    {/* Click through rate: 60% */}
                  </>
                )}
              </span>
            </div>
            <div className="bg-[#d3d5dc] maincontent__card--content-circleWithIcon"></div>
            <img
              src={GenAISearchesIcon}
              className="z-0 maincontent__card--content-icon"
            />
          </div>
        )}
        {isLoading ? (
          <div class="circle__loader items-center my-0 mx-auto"></div>
        ) : (
          <div className="overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader bg-[#e1e3ea]">
            <div className="flex flex-col gap-1 w75">
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-[#00a0cf]">
                  {cardValue.knowledgeCredits.toLocaleString()}
                </span>
                <span className="text-sm font-semibold">Knowledge Credits</span>
              </div>
              <span className="card__line"></span>
              <span className="text-[10px]">
                {month && (
                  <>
                    Contribution : {kCContribution ? kCContribution : 0}%;
                    Consumption : {kCConsumption ? kCConsumption : 0}%
                  </>
                )}
              </span>
            </div>
            <div className="maincontent__card--content-circleWithIcon bg-[#d8dae1]"></div>
            <img
              src={KnowledgeCreditsIcon}
              className="z-0 maincontent__card--content-icon w-[32px]"
            />
          </div>
        )}
        {/* {isLoading ? (
          <div class="circle__loader items-center my-0 mx-auto"></div>
        ) : (
          <div className="overflow-hidden text-black bg-[rgba(0,0,0,3%)] maincontent__card--content maincontent__card--content-woheader">
            <div className="flex flex-col gap-1 w75">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold">
                  {cardValue.CACount}
                </span>
                <span className="text-sm font-semibold">
                  Customer Accolades
                </span>
              </div>
              <span className="card__line"></span>

              <span className="text-[10px]">
                {month && (
                  <>
                    {cardValue.CACount === lastCACount
                      ? "No Change from prey Month"
                      : cardValue.CACount_status
                      ? cardValue.CACount_precent +
                        "%" +
                        cardValue.CACount_status +
                        " from prey month"
                      : "Last month total customer accolades was " +
                        lastCACount}
                  </>
                )}
              </span>
            </div>
            <div className="bg-[rgba(0,0,0,10%)] maincontent__card--content-circleWithIcon"></div>
            <img
              src={AccoladesIcon}
              className="z-0 maincontent__card--content-icon"
            />
          </div>
        )} */}
        {isLoading ? (
          <div class="circle__loader items-center my-0 mx-auto"></div>
        ) : (
          <div className="overflow-hidden text-black bg-[#e0e2ea] maincontent__card--content maincontent__card--content-woheader">
            <div className="flex flex-col gap-1 w75">
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-[#00aaa6]">
                  {satisfactionRate}
                </span>
                <span className="text-sm font-semibold">
                  Average Satisfication Rate
                </span>
              </div>
              <span className="card__line"></span>
              <span className="text-[10px]">
                {month && (
                  <>
                    Upvotes : {upvotes};
                    Downvotes : {downvotes}
                  </>
                )}
              </span>
            </div>
            <div className="bg-[#d3d5dc] maincontent__card--content-circleWithIcon"></div>
            <img
              src={AverageRateIcon}
              className="z-0 maincontent__card--content-icon"
            />
          </div>
        )}

        {isLoading ? (
          <div class="circle__loader items-center my-0 mx-auto"></div>
        ) : (
          <div className="overflow-hidden text-black bg-[#e1e3ea] maincontent__card--content maincontent__card--content-woheader">
            <div className="flex flex-col gap-1 w75">
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-[#00a0cf]">
                  {TotalEvents.toLocaleString()}
                </span>
                <span className="text-sm font-semibold"> Total Events</span>
              </div>
              <span className="card__line"></span>
              <span className="text-[10px]">
                {month && (
                  <>
                    {/* {cardValue.EventCount === lastEventCount
                      ? "No Change from prey Month"
                      // : cardValue.EventCount_status
                      // ? cardValue.EventCount_precent +
                      //   "%" +
                      //   cardValue.EventCount_status +
                      //   " from prey month"
                      // : "Last month total event was " + lastEventCount
                      :"Particaipation Index: "
                      } */}
                    Participation Index: {ParticipationIndex}&#37;
                  </>
                )}
              </span>
            </div>
            <div className="maincontent__card--content-circleWithIcon bg-[#d8dae1]"></div>
            <img
              src={TotalEventsIcon}
              className="z-0 maincontent__card--content-icon"
            />
          </div>
        )}
        {isLoading ? (
          <div class="circle__loader items-center my-0 mx-auto"></div>
        ) : (
          <div className="overflow-hidden text-black bg-[#e6e8f0] maincontent__card--content maincontent__card--content-woheader">
            <div className="flex flex-col gap-1 w75">
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-[#9f49a3]">
                  {badgeValues[highestBadge]}%{" "}
                </span>
                <span className="text-sm font-semibold">{highestBadge}</span>
              </div>
              <span className="card__line"></span>
              <span className="text-[10px]">
                {sortedBadges.map((entry) => (
                  <span key={entry.badge}>
                    {entry.badge}: {entry.value}%;{" "}
                  </span>
                ))}
              </span>
            </div>
            <div className="bg-[#d3d5dc] maincontent__card--content-circleWithIcon"></div>
            <img
              src={ChampionIcon}
              className="z-0 maincontent__card--content-icon w-[35px]"
            />
          </div>
        )}
        {isLoading ? (
          <div class="circle__loader items-center my-0 mx-auto"></div>
        ) : (
          <div className="overflow-hidden text-black bg-[#e1e3ea] maincontent__card--content maincontent__card--content-woheader">
            <div className="flex flex-col gap-1 w75">
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-[#2d9800]">
                  {cardValue.starofmonth}
                </span>
                <span className="text-sm font-semibold">
                  Outstanding Contributor
                </span>
              </div>
              <span className="card__line"></span>
              <span className="text-[10px]">
                {month && (
                  <>
                    {/* {cardValue.artifactConsumption === lastArtifactConsumption
                      ? "No Change from prey Month"
                      : // : cardValue.artifactConsumption_status
                        // ? cardValue.artifactConsumption_precent +
                        //   "%" +
                        //   cardValue.artifactConsumption_status +
                        //   " from prey month"
                        // : "Region: " +
                        // lastArtifactConsumption
                        "Region:India"}
                    ;
                    {cardValue.artifactConsumption === lastArtifactConsumption
                      ? "No Change from prey Month"
                      : // : cardValue.artifactConsumption_status
                        // ? cardValue.artifactConsumption_precent +
                        //   "%" +
                        //   cardValue.artifactConsumption_status +
                        //   " from prey month"
                        // : "Project: " +
                        // lastArtifactConsumption
                        " Project: NSIT"} */}
                    Region:{cardValue.starofmonthRegion}; Project:{cardValue.starofmonthProjectName}
                  </>
                )}
              </span>
            </div>
            <div className="bg-[#d6d7de] maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-purple"></div>
            <img
              src={EmployeeIcon}
              className="z-0 maincontent__card--content-icon w-[30px]"
            />
          </div>
        )}

        {isLoading ? (
          <div class="circle__loader items-center my-0 mx-auto"></div>
        ) : (
          <div className="overflow-hidden text-black bg-[#e6e8f0] maincontent__card--content maincontent__card--content-woheader">
            <div className="flex flex-col gap-1 w75">
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-[#fc3b70]">
                  {cardValue.starproject}
                </span>
                <span className="text-sm font-semibold">Enriching Team</span>
              </div>
              <span className="card__line"></span>
              <span className="text-[10px]">
                {month && (
                  <>
                    {/* {cardValue.artifactConsumption === lastArtifactConsumption
                      ? "No Change from prey Month"
                      : // : cardValue.artifactConsumption_status
                        // ? cardValue.artifactConsumption_precent +
                        //   "%" +
                        //   cardValue.artifactConsumption_status +
                        //   " from prey month"
                        // : "Region: " +
                        // lastArtifactConsumption
                        "Region:Malaysia"}
                    ;
                    {cardValue.artifactConsumption === lastArtifactConsumption
                      ? "No Change from prey Month"
                      : // : cardValue.artifactConsumption_status
                        // ? cardValue.artifactConsumption_precent +
                        //   "%" +
                        //   cardValue.artifactConsumption_status +
                        //   " from prey month"
                        // : "Project: " +
                        // lastArtifactConsumption
                        " Contribution:23%"} */}
                    Region:{cardValue.starprojectRegion}; Contribution:{ProjContribution}%
                  </>
                )}
              </span>
            </div>
            <div className="bg-[#cfd0d8] maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-litepurple"></div>
            <img
              src={EnrichingTeamIcon}
              className="z-0 maincontent__card--content-icon"
            />
          </div>
        )}
        {isLoading ? (
          <div class="circle__loader items-center my-0 mx-auto"></div>
        ) : (
          <div className="overflow-hidden text-black bg-[#e1e3ea] maincontent__card--content maincontent__card--content-woheader">
            <div className="flex flex-col gap-1 w75">
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-[#00aaa6]">
                  {cardValue.leadingRegioncount}
                </span>
                <span className="text-sm font-semibold">Leading Region</span>
              </div>
              <span className="card__line"></span>
              <span className="text-[10px]">
                {month && (
                  <>
                    {/* {cardValue.artifactConsumption === lastArtifactConsumption */}
                    {/* ? "No Change from prey Month"
                      : // : cardValue.artifactConsumption_status
                        // ? cardValue.artifactConsumption_precent +
                        //   "%" +
                        //   cardValue.artifactConsumption_status +
                        //   " from prey month"
                        // : "Users: " +
                        //   lastArtifactConsumption
                        // Users:{cardValue.usrcount}}
                    ;
                    {cardValue.artifactConsumption === lastArtifactConsumption */}
                    {/* ? // ? "No Change from prey Month"
                        // : cardValue.artifactConsumption_status
                        // ? cardValue.artifactConsumption_precent +
                        //   "%" +
                        //   cardValue.artifactConsumption_status +
                        //   " from prey month"
                        // : "Contribution: " +
                        //   lastArtifactConsumption
                        "No change from prey month"
                      : " Contribution:62%"} */}
                    Users:{regionwiseusrCount}%; Contribution: {leadingRegionContri}%
                  </>
                )}
              </span>
            </div>

            <div className="bg-[#ced0d7] maincontent__card--content-circleWithIcon"></div>
            <img
              src={LeadingRegionIcon}
              className="z-0 maincontent__card--content-icon"
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 my-2 text-black">
        <div className="p-2 bg-[rgba(0,0,0,10%)] rounded-3xl h-[300px]">
        {isLoading ? (
            <div class="circle__loader items-center my-0 mx-auto"></div>
          ) : (
            <ChartCard title="Overall Contribution">
              {/* <KMStackedBarChart
                data={overallContribution}
                title={"Artifacts"}
              /> */}
              <StackBarChart data={overallContribution} title={"Artifacts"} />
            </ChartCard>
          )}
        </div>
        <div className="p-2 bg-[rgba(0,0,0,5%)] rounded-3xl h-[300px]">
          {isengageLoading ? (
            <div class="circle__loader items-center my-0 mx-auto"></div>
          ) : (
            <ChartCard title="Engagement Summary">
              <LineChart
                data={engagements}
                casedata={casestudies}
                // knowdata={knowledgewise}
                // vx={vxcount}
                title={"Artifacts"}
              />
            </ChartCard>
          )}
        </div>
        <div className="p-2 bg-[rgba(0,0,0,5%)] rounded-3xl h-[300px]">
          {isLoading ? (
            <div class="circle__loader items-center my-0 mx-auto"></div>
          ) : (
            <ChartCard title="Knowledge Expertise">
              {/* <PieChart1 data={classification} title={""} /> */}
              <PieChartNew data={classification} title={""} />
            </ChartCard>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-black">
        <div className="col-span-2 bg-[#e3e5ec] card__container rounded-3xl">
          <div className="bg-[#d0d2d9] card__header">Contribution Summary</div>
          <div className="card__header">
            <div className="maincontent__card--tableheader">
              <div className="maincontent__card--tableheader-right">
                <div className="relative search-containerKMArti kmarticle-seactform">
                  <input
                    type="search"
                    placeholder="Search by author,project,name"
                    className="w-full pt-2 pb-2 pl-2 pr-[26%] text-xs border-0 rounded-[28px] outline-0 h-[34px]"
                    value={searchValue}
                    onChange={handleSearch}
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-[rgba(0,0,0,60%)] rounded-[28px] h-[26px] text-white text-[10px] font-bold"
                  >
                    Search
                  </button>
                </div>
                <Link className="flexVerandHorCenter rounded-[5px] bg-[rgba(0,0,0,60%)]">
                  <img
                    src={DownloadIcon}
                    onClick={() => handleExport(filteredData)}
                    className="p-2 bg-[0,0,0,60%] rounded-md"
                  ></img>
                </Link>
              </div>
            </div>
            {isContributionSummary ? (
              <div class="circle__loader items-center my-0 mx-auto"></div>
            ) : (
              <DataTable
                title=""
                columns={columns}
                data={filteredData}
                pagination
                paginationRowsPerPageOptions={[5, 10, 15]}
                paginationPerPage={5}
                highlightOnHover
                className="mt-4 kmdash_cont_table"
                defaultSortField="team"
                defaultSortAsc={true}
              />
            )}
          </div>
        </div>
        <Modal
          as={Modal.Dialog}
          centered
          show={showDefault}
          onHide={handleClose}
          backdrop="static"
        >
          <ViewArticle
            article={articleViewDetails}
            postRender={handleCmt}
            onClose={handleClose}
          />
        </Modal>
        <div className="bg-[#e3e5ec] card__container card__container--articles">
          <div className="bg-[#d0d2d9] card__header">Popular Articles</div>
          <div className="round-3xl">
            {popularArticle.map((row, i) => {
              return (
                <>
                  <div className="card__articles--listsec" key={i}>
                    <div className="grid grid-cols-3 p-4">
                      <div className="flex items-center col-span-2 gap-2">
                        <img
                          src={row.Profile ? row.Profile : ProfilePic}
                          className="card__profilepic"
                        />
                        <div
                          className="card__articles--title cursor-pointer text-[13px]"
                          title={row.title}
                          onClick={(e) => handleArticleClick(row)}
                        >
                          {row.title.length > 25
                            ? row.title.substring(0, 25) + "..."
                            : row.title}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <img src={HeartIcon} />
                        <span className="text-purple-500">{row.Likes}</span>
                      </div>
                    </div>
                  </div>
                </>
              )
            })}
            <button
              className="px-4 py-2 m-4 text-xs font-semibold bg-[rgba(0,0,0,10%)] rounded-3xl"
              onClick={() => navigate(Routes.NewArticles)}
            >
              READ MORE
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  rewards: state.rewards
})

export default connect(mapStateToProps)(NewDashboard)
