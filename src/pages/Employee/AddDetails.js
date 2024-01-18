import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React,{useState} from 'react'
import { Form,Col,Row, Accordion } from '@themesberg/react-bootstrap'
import { faCalendarDays, faGraduationCap,faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Select from "react-select";
import StartDateIcon from "../../assets/img/icons/project-management/icon-start-date.svg";
import EndDateIcon from "../../assets/img/icons/project-management/icon-end-date.svg";
import ImgIcon from '../../components/ImageIcon';

const adddetails= ()=> {
    const [highestQualification, setHighestQualification] = useState();
    const [startDateEducation, setStartDateEducation] = useState();
    const [endDateEducation, setEndDateEducation] = useState();
    const [company, setCompany] = useState();
    const [department, setDepartment] = useState();
    const [designation, setDesignation] = useState();
    const [roleExperience, setRoleExperience] = useState();
    const [startDateExperience, setStartDateExperience] = useState();
    const [endDateExperience, setEndDateExperience] = useState();
    const [projectDescription, setProjectDescription] = useState();
    const [isDisabled, setIsDisabled] = useState(false);
    const [image, setImage] = useState([])  
const [formErrors, setFormErrors] = useState({});

// const removeFile = (i) => {
//     let sno = 0
//     let resarr = []
//     image.map((row, key) => {
//       if (i !== key) resarr[sno++] = row
//     })
//     setImage(resarr)
//   }
const handleInputFocus =  (fieldName)=>{
    setFormErrors((errors)=>({
      ...errors,
      [fieldName]:"",
  }));
  }
  let handleSubmit = async(e) =>{
    e.preventDefault();
    const saveaddDetails=()=>{
        setIsDisabled(true);
        const errors={};
        let isValid=false;

        if(!highestQualification){
            errors.highestQualification="Qualification is required";
            isValid=false;
        }
        if(!startDateEducation){
            errors.startDateEducation="Start Date is required";
            isValid=false;
        }
        if(!endDateEducation){
            errors.endDateEducation="End Date is required";
            isValid=false;
        }
        if(!company){
            errors.company="Company is required";
            isValid=false;
        }
        if(!department){
            errors.department="Department is required";
            isValid=false;
        }
        if(!designation){
            errors.designation="Designation is required";
            isValid=false;
        }
        if(!roleExperience){
            errors.roleExperience="Role is required";
            isValid=false;
        }
        if(!startDateExperience){
            errors.startDateExperience="StartDate is required";
            isValid=false;
        }
        if(!endDateExperience){
            errors.endDateExperience="EndDate is required";
            isValid=false;
        }
        if(!projectDescription){
            errors.projectDescription="About the Project is required";
            isValid=false;
        }
        setFormErrors(errors);

    };
    saveaddDetails();
  }
  return (
    <div>
         <div className="mt-4 maincontent__card--header">
        <h2
          className="maincontent__card--header-title"
          style={{ display: "inline-block" }}
        >
          Educational Details
        </h2>
      </div>
      <div className='maincontent__card--content'>
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col md={4} className="mb-3">
                    <Form.Group>
                        <Form.Label>Highest Qualification</Form.Label>
                        <div className="input-group">
                        <div className="input-group-prepend">
                       <span className="input-group-text icon-container">
                  <FontAwesomeIcon  className="input-icon" icon={faGraduationCap} />
                  </span>
                  </div>    
                      <Select
                     value={highestQualification}
                      onChange={(e)=>setHighestQualification(e)}
                      onFocus={()=>handleInputFocus("highestQualification")}
                    />
                    </div>
                    {formErrors.highestQualification && (
                      <div className="text-danger">
                        {formErrors.highestQualification}
                      </div>
                    )}

                    </Form.Group>
                </Col>

                <Col md={4} className="mb-3">
                    <Form.Group>
                        <Form.Label>StartDate</Form.Label>
                        <div className="input-group">
              <div className="input-group-prepend">
                  <span className="input-group-text icon-container">
                    <img
                      src={StartDateIcon}
                      alt="client name"
                      className="input-icon"
                    />
                  </span>
                </div>
                        <Form.Control
                        type="date"
                        value={startDateEducation}
                        onChange={(e)=>setStartDateEducation(e)}
                        onFocus={()=>handleInputFocus("startDateEducation")}
                        />
                        </div>
                        {formErrors.startDateEducation && (
                      <div className="text-danger">
                        {formErrors.startDateEducation}
                      </div>
                    )}
                    </Form.Group>
                </Col>


                <Col md={4} className="mb-3">
                    <Form.Group>
                        <Form.Label>EndDate</Form.Label>
                        <div className="input-group">
              <div className="input-group-prepend">
                  <span className="input-group-text icon-container">
                    <img
                      src={EndDateIcon}
                      alt="client name"
                      className="input-icon"
                    />
                  </span>
                </div>
                    <Form.Control
                    type="date"
                    value={endDateEducation}
                    onChange={(e)=>setEndDateEducation(e)}
                    onFocus={()=>handleInputFocus("endDateEducation")}
                    />
                    </div>
                    {formErrors.endDateEducation && (
                      <div className="text-danger">
                        {formErrors.endDateEducation}
                      </div>
                    )}
              </Form.Group>
                </Col>
            </Row>



            <div className="mt-4 maincontent__card--header">
        <h2
          className="maincontent__card--header-title"
          style={{ display: "inline-block" }}
        >
          Working Experience
        </h2>
      </div>
      <div className='maincontent__card--content'>
        <Row>
            <Col md={4} className="mb-3">
                <Form.Group>
                    <Form.Label>Company</Form.Label>
                    <Select
                    value={company}
                    onChange={(e)=>setCompany(e)}
                    onFocus={()=>handleInputFocus("company")}
                    />
                          {formErrors.company && (
                      <div className="text-danger">
                        {formErrors.company}
                      </div>
                    )}
                </Form.Group>
            </Col>


            <Col md={4} className="mb-3">
                <Form.Group>
                    <Form.Label>
                        Department
                    </Form.Label>
                    <Select
                    value={department}
                    onChange={(e)=>setDepartment(e)}
                    onFocus={()=>handleInputFocus("department")}/>
                          {formErrors.department && (
                      <div className="text-danger">
                        {formErrors.department}
                      </div>
                    )}
                </Form.Group>
            </Col>


            <Col md={4} className="mb-3">
            <Form.Group>
                    <Form.Label>
                        Designation
                    </Form.Label>
                    <Select
                    value={designation}
                    onChange={(e)=>setDesignation(e)}
                    onFocus={()=>handleInputFocus("designation")}/>
                          {formErrors.designation && (
                      <div className="text-danger">
                        {formErrors.designation}
                      </div>
                    )}
                </Form.Group>
            </Col>
        </Row>

        <Row>
            <Col md={4} className="mb-3">
            <Form.Group>
                    <Form.Label>
                        Role
                    </Form.Label>
                    <Select
                    value={roleExperience}
                    onChange={(e)=>setRoleExperience(e)}
                    onFocus={()=>handleInputFocus("roleExperience")}/>
                          {formErrors.roleExperience && (
                      <div className="text-danger">
                        {formErrors.roleExperience}
                      </div>
                    )}

                </Form.Group>
            </Col>

            <Col md={4} className="mb-3">
            <Form.Group>
                    <Form.Label>
                        StartDate
                    </Form.Label>
                    <div className="input-group">
              <div className="input-group-prepend">
                  <span className="input-group-text icon-container">
                    <img
                      src={StartDateIcon}
                      alt="client name"
                      className="input-icon"
                    />
                  </span>
                </div>
                    <Form.Control
                    type="date"
                    value={startDateExperience}
                    onChange={(e)=>setStartDateExperience(e)}
                    onFocus={()=>handleInputFocus("startDateExperience")}
                    />
                    </div>
                    {formErrors.startDateExperience && (
                      <div className="text-danger">
                        {formErrors.startDateExperience}
                      </div>
                    )}
                </Form.Group>
            </Col>

            <Col md={4} className="mb-3">
            <Form.Group>
                    <Form.Label>
                        EndDate
                    </Form.Label>
                    <div className="input-group">
              <div className="input-group-prepend">
                  <span className="input-group-text icon-container">
                    <img
                      src={EndDateIcon}
                      alt="client name"
                      className="input-icon"
                    />
                  </span>
                </div>
                    <Form.Control
                    type="Date"
                    value={endDateExperience}
                    onChange={(e)=>setEndDateExperience(e)}
                    onFocus={()=>handleInputFocus("endDateExperience")}/>
                    </div>
                    {formErrors.endDateExperience && (
                      <div className="text-danger">
                        {formErrors.endDateExperience}
                      </div>
                    )}
                </Form.Group>
            </Col>
        </Row>

        <Row>
            <Col md={12}>
            <Form.Group>
                    <Form.Label>
                        About the Project
                    </Form.Label>
                    <Form.Control
                    as="textarea"
                    rows={3}
                    value={projectDescription}
                    onChange={(e)=>setProjectDescription(e.target.value)}
                    onFocus={()=>handleInputFocus("projectDescription")}/>
                          {formErrors.projectDescription && (
                      <div className="text-danger">
                        {formErrors.projectDescription}
                      </div>
                    )}
                </Form.Group>
            </Col>
        </Row>
</div>

{/* <div className="flex items-center justify-between gap-4 mt-8">
                      <div className="flex items-center flex-1 gap-2">
                        <p>ProfileUpdate</p>
                        <div className="flex gap-2 imgiconKMD">
                          <ImgIcon
                            image={image}
                            setImage={setImage}
                            className="maincontent__postarticle--attachicon"
                          />
                        </div>
                      </div>
                    </div>


                    <div>
                      {image &&
                        image?.map((attachment, i) => (
                          <>
                            <div className="d-flex" key={i}>
                              <ul className="list-disc">
                                <li>
                                  <span>
                                    {attachment.name}
                                    <FontAwesomeIcon
                                      onClick={() => removeFile(i)}
                                      icon={faTrashAlt}
                                      style={{
                                        marginLeft: "15px",
                                        cursor: "pointer",
                                        color: "red"
                                      }}
                                    />
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </>
                        ))}
                    </div> */}
     
              
       

            <div className="flex gap-4 md:mt-8 lg:justify-end md:justify-center">
                <button
                  className="maincontent__btn maincontent__btn--primaryblue"
                //   disabled={isDisabled}
                  type="submit"
                  // onClick={() => saveaddDetails()}
                >
                  Save & Continue
                </button>
                </div>
        </Form>
   </div>


    </div>
  )
}

export default adddetails