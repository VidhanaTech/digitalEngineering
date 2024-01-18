import React, { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { faPenToSquare, faEye } from "@fortawesome/free-solid-svg-icons";
import HomeOutlineIcon from "../../../assets/img/icons/home-outline-icon.svg";
import ClientNameIcon from "../../../assets/img/icons/icon-client.svg";
import IndustryIcon from "../../../assets/img/icons/icon-industry.svg";
import LocationIcon from "../../../assets/img/icons/icon-po-location.svg";
import CapabilityIcon from "../../../assets/img/icons/icon-capability.svg";
import DownloadIcon from "../../../assets/img/new-dashboard/download-icon.svg";
import reset from "../../../assets/img/brand/reseticon.svg";
import { Button, Accordion, Form } from "@themesberg/react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "./SearchClient.css";
import apiClient from "../../../common/http-common";
import { ClientContext } from "../../components/context";
import { Routes } from "../../../routes";
import Papa from "papaparse";
import { connect } from "react-redux";

const SearchClient = (state) => {
  const [client, setClient] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [capability, setCapability] = useState("");
  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectVal, setSelectVal] = useState({
    client: { value: null, label: "All" },
    industry: { value: null, label: "All" },
    location: { value: null, label: "All" },
    capability: { value: null, label: "All" },
  });

  const [clientLookup, setClientLookup] = useState([
    { value: null, label: "All" },
  ]);
  const [industryLookup, setIndustryLookup] = useState([
    { value: null, label: "All" },
  ]);
  const [locationLookup, setLocationLookup] = useState([
    { value: null, label: "All" },
  ]);
  const [capabilityLookup, setCapabilityLookup] = useState([
    { value: null, label: "All" },
  ]);

  const clients = useContext(ClientContext);
  const navigate = useNavigate();

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    filterData(value);
  };

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = () => {
    setIsAccordionOpen((prevState) => !prevState);
  };

  const columns = [
    {
      name: "Code",
      selector: (param) => param.Id,
      sortable: true,
    },
    {
      name: "Client",
      selector: (param) => <span title={param.Name}>{param.Name}</span>,
      filter: (
        <input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={handleSearch}
        />
      ),
      sortable: true,
      sortFunction: (a, b) => a.Name.localeCompare(b.Name),
    },
    {
      name: "Type",
      selector: (param) => (
        <span title={param.ClientTypeDesc}>{param.ClientTypeDesc}</span>
      ),
      sortable: true,
      sortFunction: (a, b) => a.ClientTypeDesc.localeCompare(b.ClientTypeDesc),
    },
    {
      name: "Industry",
      selector: (param) => (
        <span title={param.DomainName}>{param.DomainName}</span>
      ),
      sortable: true,
      sortFunction: (a, b) => a.DomainName.localeCompare(b.DomainName),
    },
    {
      name: "Capability",
      selector: (param) => param.TowerId,
      cell: (param) => (
        <>
          <p className="maincontent__table--status bg-info scheduled">
            {param.TowerName}
          </p>
        </>
      ),
      sortable: true,
    },

    {
      name: "Action",
      cell: (param) => (
        <>
          <a
            onClick={() => {
              navigate(Routes.ViewClient, {
                state: { client: param },
              });
            }}
            style={{ marginRight: "10px" }}
            title="View Client"
          >
            <FontAwesomeIcon icon={faEye} size="lg" color="#1475DF" />
          </a>

          <a
            onClick={() => {
              navigate(Routes.EditClient, {
                state: { client: param },
              });
            }}
            title="Edit Client"
          >
            <FontAwesomeIcon icon={faPenToSquare} size="lg" color="#1475DF" />
          </a>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  useEffect(() => {
    searchFields();
    apiClient
      .post("/client/search", {
        clientId: "0",
        domainId: "0",
        towerId: "0",
        organizationId: "0",
        userId: "0",
      })
      .then((response) => {
        if (response?.data?.client?.length > 0) {
          let arr = [{ value: null, label: "All" }];
          setClient(arr);
          setFilteredData(response?.data.client);
          setTableData(response?.data.client);
          response.data.client.map((user) => {
            const obj = { value: user.Id, label: user.Name };
            arr.push(obj);
            setLoading(false);
          });
          setClientLookup(arr);
        }
      });
    apiClient.get("/lookup/domain/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [{ value: null, label: "All" }];
        setIndustry(arr);
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
        });
        setIndustryLookup(arr);
      }
    });
    apiClient.get("/lookup/polocation/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [{ value: null, label: "All" }];
        setLocation(arr);
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
        });
        setLocationLookup(arr);
      }
    });
    apiClient.get("/lookup/tower/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [{ value: null, label: "All" }];
        setCapability(arr);
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setCapabilityLookup(arr);
        });
      }
    });
  }, []);

  const searchReset = () => {
    setSelectVal({
      client: { value: null, label: "All" },
      industry: { value: null, label: "All" },
      location: { value: null, label: "All" },
      capability: { value: null, label: "All" },
    });
    searchFields();
  };

  const filterData = (value) => {
    const lowerCaseValue = value.toLowerCase().trim();
    const filteredTableData = tableData.filter(
      (item) =>
        item.Name.toLowerCase().includes(lowerCaseValue) ||
        item.ClientTypeDesc.toLowerCase().includes(lowerCaseValue) ||
        item.DomainName.toLowerCase().includes(lowerCaseValue) ||
        item.TowerName.toLowerCase().includes(lowerCaseValue)
    );
    setFilteredData(filteredTableData);
  };

  function handleExport(data) {
    // Define your custom headers
    const headers = [
      { label: "Client Code", key: "Id" },
      { label: "Client Name", key: "Name" },
      { label: "Client Type", key: "ClientTypeDesc" },
      { label: "Industry", key: "DomainName" },
      { label: "Capability", key: "TowerName" },
    ];

    // Prepare the data for export
    const exportData = data.map((row) =>
      headers.reduce((acc, header) => {
        if (row[header.key] === "start_date" || row[header.key] === "end_date")
          acc[header.label] = changeStartDateFormat(row[header.key]);
        else acc[header.label] = row[header.key];
        return acc;
      }, {})
    );

    // Convert the data to CSV format
    const csvData = Papa.unparse(exportData);

    // Create a Blob object and save the file
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "Client details.csv");
  }

  const searchFields = () => {
    setLoading(true);
    let data = {
      clientId: selectVal.client.value,
      domainId: selectVal.industry.value,
      towerId: selectVal.capability.value,
      organizationId: selectVal.location.value,
      userId: 1,
    };
    apiClient
      .post("/client/search", data)
      .then((response) => {
        setTableData(response.data.client);
        if (searchValue) {
          filterData(searchValue, response.data.client);
        } else {
          setFilteredData(response.data.client);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    searchFields();
  }, [selectVal]);

  return (
    <div>
      <div className="maincontent__breadcrumb">
        <img
          className="cursor_pointer"
          src={HomeOutlineIcon}
          alt="home"
          onClick={() => {
            navigate(state.defaultpage);
          }}
        />
        <span className="maincontent__breadcrumb--divider">/</span>
        <span>Client Management</span>
        <span className="maincontent__breadcrumb--divider">/</span>
        <span className="maincontent__breadcrumb--active">Search Clients</span>
      </div>
      <Accordion activeKey={isAccordionOpen ? "1" : "0"}>
        <Accordion.Item eventKey="1">
          <Accordion.Header
            onClick={() => toggleAccordion()}
            className="accordionheader"
          >
            SEARCH
          </Accordion.Header>
          <Accordion.Body className="visible text-blue-700 accordionnew">
            <img
              className="resetIconDX"
              style={{ color: "#1658a0", cursor: "pointer" }}
              title="Reset"
              src={reset}
              onClick={() => searchReset()}
            />

            <Form>
              <div className="flex flex-col justify-center gap-4 lg:justify-between lg:flex-row">
                <div className="flex-1">
                  <Form.Group>
                    <Form.Label>Client</Form.Label>
                    <div className="dropdown-container">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="inputIconCont input-group-text icon-container">
                            <img src={ClientNameIcon} className="input-icon" />
                          </span>
                        </div>
                        <Select
                          className="selectOptions"
                          options={clientLookup}
                          placeholder=""
                          value={selectVal.client}
                          onChange={(e) => {
                            setSelectVal({ ...selectVal, client: e });
                          }}
                        />
                      </div>
                    </div>
                  </Form.Group>
                </div>
                <div className="flex-1">
                  <Form.Group>
                    <Form.Label>Industry</Form.Label>
                    <div className="dropdown-container">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="inputIconCont input-group-text icon-container">
                            <img src={IndustryIcon} className="input-icon" />
                          </span>
                        </div>
                        <Select
                          className="selectOptions"
                          options={industryLookup}
                          placeholder=""
                          value={selectVal.industry}
                          onChange={(e) => {
                            setSelectVal({ ...selectVal, industry: e });
                          }}
                        />
                      </div>
                    </div>
                  </Form.Group>
                </div>
                <div className="flex-1">
                  <Form.Group id="industry">
                    <Form.Label>Location</Form.Label>
                    <div className="dropdown-container">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className=" inputIconCont input-group-text icon-container">
                            <img src={LocationIcon} className="input-icon" />
                          </span>
                        </div>
                        <Select
                          className="selectOptions"
                          options={locationLookup}
                          placeholder=""
                          value={selectVal.location}
                          onChange={(e) => {
                            setSelectVal({ ...selectVal, location: e });
                          }}
                        />
                      </div>
                    </div>
                  </Form.Group>
                </div>
                <div className="flex-1">
                  <Form.Group id="location">
                    <Form.Label>Capability</Form.Label>
                    <div className="dropdown-container">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="inputIconCont input-group-text icon-container">
                            <img src={CapabilityIcon} className="input-icon" />
                          </span>
                        </div>
                        <Select
                          className="selectOptions"
                          options={capabilityLookup}
                          placeholder=""
                          value={selectVal.capability}
                          onChange={(e) => {
                            setSelectVal({ ...selectVal, capability: e });
                          }}
                        />
                      </div>
                    </div>
                  </Form.Group>
                </div>
              </div>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="mt-2 maincontent__card--body">
        <div className="maincontent__card--header">
          <h2 className="maincontent__card--header-title text-black">
            Client Details
          </h2>
        </div>
        <div className="maincontent__card--content bg-purple-100 rdt_Pagination">
          <div className="flex items-center justify-center gap-4 mb-4 md:justify-end">
            <div className="relative search-containerKMArti kmarticle-seactform">
              <input
                type="search"
                placeholder="Search by Client , type , Industry"
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
            <Link className="flexVerandHorCenter">
              <img
                src={DownloadIcon}
                onClick={() => handleExport(filteredData)}
                className="p-2 bg-[rgba(0,0,0,60%)] rounded-md"
              ></img>
            </Link>
            <Button
              variant="info"
              className="mb-0 maincontent__btn maincontent__btn--primaryblue"
              onClick={() => {
                navigate(Routes.AddClient);
              }}
            >
              +Add Client
            </Button>
          </div>
          {loading ? (
            <div
              class="circle__loader"
              style={{ alignItems: "center", margin: "0 auto" }}
            ></div>
          ) : (
            <DataTable
              title=""
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
              paginationRowsPerPageOptions={[5, 10, 15]}
              paginationPerPage={5}
              className="clientDT_table bg-purple-100"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(SearchClient);
