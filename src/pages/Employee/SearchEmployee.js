import React, {useState,useEffect}from 'react'
import { Form,Col,Row, Accordion } from '@themesberg/react-bootstrap'
import { faCalendarDays, faCircleUser, faEnvelopeCircleCheck, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from "react-select";

const SearchEmployee =()=>{
const [sequencetype,setsequencetype]=useState();
const [autoCreateLogin, setAutoCreateLogin] = useState();
const [sequence, setSequence] = useState();
const [loginId, setLoginId] = useState();
const [firstName, setFirstName] = useState();
const [middleName, setMiddleName] = useState();
const[lastname,setLastName] =useState();
const [dateOfBirth, setDateOfBirth] = useState();
const [dateOfJoining, setDateOfJoining] = useState();
const [email, setEmail] = useState();
const [company, setCompany] = useState();
const [department, setDepartment] = useState();
const [designation, setDesignation] = useState();
const [role, setRole] = useState();
const [managerId, setManagerId] = useState();
const [managerName, setManagerName] = useState();
const[sequencetypeList,setsequencetypeList] =useState();
const[autoCreateLoginList,setAutoCreateLoginlist]=useState(); 
const [sequenceList,setSequenceList] = useState();
const[loginIdList ,setLoginIdList]=useState();
const[companyList,setCompanyList] = useState();
const[departmentList,setDepartmentList]=useState();
const[designationList,setDesignationList] = useState();
const[roleList,setRoleList]=useState();
const [isDisabled, setIsDisabled] = useState(false);
const [formErrors, setFormErrors] = useState({});

const handleInputFocus =  (fieldName)=>{
    setFormErrors((errors)=>({
      ...errors,
      [fieldName]:"",
  }));
  }
let handleSubmit = async(e) =>{
    e.preventDefault();
    
    
const savesearch = ()=>{
    setIsDisabled(true);
    const errors={};
    let isValid=false;


    if(!sequencetype){
        errors.sequencetype="Sequence Type is required";
        isValid=false;
    }
    if(!autoCreateLogin){
        errors.autoCreateLogin="Auto Create Login is required";
        isValid=false;
    }
    if(!sequence){
        errors.sequence="Sequence is required";
        isValid=false;
    }
    if(!loginId){
        errors.loginId="Login ID is required";
        isValid=false;
    }
    if(!firstName){
        errors.firstName="First Name is required";
        isValid=false;
    }
    if(!middleName){
        errors.middleName="Middle Name is required";
        isValid=false;
    }
    if(!lastname){
        errors.lastname="Last Name is required";
        isValid=false;
    }
    if(!dateOfBirth){
        errors.dateOfBirth="DOB is required";
        isValid=false;
    }
    if(!dateOfJoining){
        errors.dateOfJoining="DOJ is required"
        isValid=false;
    }
    if(!email){
        errors.email="EmailId is required";
        isValid=false;
    }
    if(!company){
        errors.company="Company Name is required";
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
    if(!role){
        errors.role="Role is required";
        isValid=false;
    }
    if(!managerId){
        errors.managerId="Manager ID is required";
        isValid=false;
    }
    if(!managerName){
        errors.managerName="Manager Name is required";
        isValid=false;
    }
    setFormErrors(errors);

};
savesearch();
}


return(
    <div>
    <h2>PERSONAL DETAILS</h2>
    <div className="mt-4 maincontent__card--header">
        <h2
          className="maincontent__card--header-title"
          style={{ display: "inline-block" }}
        >
          Employee ID:
        </h2>
      </div>
      <div className='maincontent__card--content'>
      <Form onSubmit={handleSubmit}>
        <Row>
            <Col md={4} className="mb-3">
            <Form.Group>
                <Form.Label>Sequence Type</Form.Label>
                
                <Select
                options={sequencetypeList}
                value={sequencetype}
                onChange={(e) =>setsequencetype(e)}
                onFocus={()=>handleInputFocus("sequencetype")}
                />
                 {formErrors.sequencetype && (
                      <div className="text-danger">
                        {formErrors.sequencetype}
                      </div>
                    )}
                
            </Form.Group>
            </Col>
        </Row>
        
        <Row>
            <Col md={4} className="mb-3">
                <Form.Group>
                    <Form.Label>
                        Auto Create Login
                    </Form.Label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                       <span className="input-group-text icon-container">
                  {/* <img src="img/login(1).png" className="input-icon"/> */}
                  </span>
                  </div>
                    <Select
                    options={autoCreateLoginList}
                    value={autoCreateLogin}
                    onChange={(e)=>setAutoCreateLogin(e)}
                    onFocus={()=>handleInputFocus("autoCreateLogin")}
                    />
                    </div>
                    {formErrors.autoCreateLogin&& (
                      <div className="text-danger">
                        {formErrors.autoCreateLogin}
                      </div>
                    )}
                </Form.Group>
            </Col>


            <Col md={4} className="mb-3">
                <Form.Group>
                    <Form.Label>
                        Sequence
                    </Form.Label>
                    <Select
                    value={sequence}
                    onChange={(e)=>setSequence(e)}
                    onFocus={()=>handleInputFocus("sequence")}
                    />
                      {formErrors.sequence && (
                      <div className="text-danger">
                        {formErrors.sequence}
                      </div>
                    )}
                </Form.Group>
            </Col>


            <Col md={4} className="mb-3">
                <Form.Group>
                    <Form.Label>    
                        Login ID
                    </Form.Label>
            <Select
                 value={loginId}
                onChange={(e)=>setLoginId(e.target.value)}
                 onFocus={()=>handleInputFocus("loginId")}/>
                {formErrors.loginId && (
                      <div className="text-danger">
                        {formErrors.loginId}
                      </div>
                    )}
                    </Form.Group>
            </Col>
        </Row>
        <hr/>
        <Row>
            <Col md={4} className="mb-3">
                <Form.Group>
                    <Form.Label>FirstName</Form.Label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                       <span className="input-group-text icon-container">
                  <FontAwesomeIcon  className="input-icon" icon={faCircleUser} />
                  </span>
                  </div>
                    <Form.Control
                     placeholder="Enter First Name"
                     value={firstName}
                     onChange={(e)=>setFirstName(e.target.value)}
                     onFocus={()=>handleInputFocus("firstName")}/>
                    </div>
                    {formErrors.firstName && (
                      <div className="text-danger">
                        {formErrors.firstName}
                      </div>
                    )}
                </Form.Group>
            </Col>

            <Col md={4} className="mb-3">
                <Form.Group>
                    <Form.Label>MiddleName</Form.Label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                       <span className="input-group-text icon-container">
                  <FontAwesomeIcon  className="input-icon" icon={faCircleUser} />
                  </span>
                  </div>
                    <Form.Control
                    placeholder="Enter Middle Name"
                    value={middleName}
                    onChange={(e)=>setMiddleName(e.target.value)}
                    onFocus={()=>handleInputFocus("middleName")}/>
                    </div>
                    {formErrors.middleName && (
                      <div className="text-danger">
                        {formErrors.middleName}
                      </div>
                    )}
                </Form.Group>
            </Col>

            <Col md={4} className="mb-3">
                <Form.Group>
                    <Form.Label>LastName</Form.Label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                       <span className="input-group-text icon-container">
                  <FontAwesomeIcon  className="input-icon" icon={faCircleUser} />
                  </span>
                  </div>
                    <Form.Control
                    placeholder="Enter Last Name"
                    value={lastname}
                    onChange={(e)=>setLastName(e.target.value)}
                    onFocus={()=>handleInputFocus("lastname")}/>
                    </div>
                    {formErrors.lastname && (
                      <div className="text-danger">
                        {formErrors.lastname}
                      </div>
                    )}
                </Form.Group>
            </Col>
        </Row>

        <Row>
            <Col md={4} className="mb-3">
                <Form.Group>
                    <Form.Label>Date Of Birth</Form.Label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                       <span className="input-group-text icon-container">
                  <FontAwesomeIcon  className="input-icon" icon={faCalendarDays} />
                  </span>
                  </div>
                    <Form.Control
                    type="date"
                    onChange={(e)=>setDateOfBirth(e.target.value)}
                    onFocus={()=>handleInputFocus("dateOfBirth")}/>
                    </div>
                    {formErrors.dateOfBirth && (
                      <div className="text-danger">
                        {formErrors.dateOfBirth}
                      </div>
                    )}
                </Form.Group>
            </Col>

            <Col md={4} className="mb-3">
                <Form.Group>
                    <Form.Label>
                        Date Of Joining
                    </Form.Label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                       <span className="input-group-text icon-container">
                  <FontAwesomeIcon  className="input-icon" icon={faCalendarDays} />
                  </span>
                  </div>
                        <Form.Control
                            type="date"
                            onchange={(e)=>setDateOfJoining(e.target.value)}
                            onFocus={()=>handleInputFocus("dateOfJoining")}
                        />
                        </div>
                        {formErrors.dateOfJoining && (
                      <div className="text-danger">
                        {formErrors.dateOfJoining}
                      </div>
                    )}
                </Form.Group>
            </Col>

            <Col md={4} className="mb-3">
                <Form.Group>
                    <Form.Label>
                        Email
                    </Form.Label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                       <span className="input-group-text icon-container">
                  <FontAwesomeIcon  className="input-icon" icon={faEnvelopeCircleCheck} />
                  </span>
                  </div>
                        <Form.Control
                        
                        placeholder="Enter email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        onFocus={()=>handleInputFocus("email")}/>
                        </div>
                        {formErrors.email && (
                      <div className="text-danger">
                        {formErrors.email}
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
          Work Assignments
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
                      onFocus={()=>handleInputFocus("company")}/>

                        {formErrors.company && (
                      <div className="text-danger">
                        {formErrors.company}
                      </div>
                    )}

                    </Form.Group>
                </Col>

                <Col md={4} className="mb-3">
                    <Form.Group>
                        <Form.Label>Department</Form.Label>
                <Select
                value={department}
                onChange={(e)=>setDepartment(e)}
                onFocus={()=>handleInputFocus("department")}
                />
                  {formErrors.department && (
                      <div className="text-danger">
                        {formErrors.department}
                      </div>
                    )}
                    </Form.Group>
                </Col>


                <Col md={4} className="mb-3">
                    <Form.Group>
                        <Form.Label>Designation</Form.Label>
               <Select
               value={designation}
               onChange={(e)=>setDesignation(e)}
               onFocus={()=>handleInputFocus("designation")}
               />
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
                    <Form.Label>Role</Form.Label>
                    <Select
                    value={role}
                    onChange={(e)=>setRole(e)}
                    onFocus={()=>handleInputFocus("role")}/>
                      {formErrors.role&& (
                      <div className="text-danger">
                        {formErrors.role}
                      </div>
                    )}
                </Form.Group>
            </Col>


            <Col md={4} className="mb-3">
                <Form.Group>
                    <Form.Label>Manager ID</Form.Label>
                    <Form.Control
                    value={managerId}
                    onChange={(e)=>setManagerId(e.target.value)}
                    onFocus={()=>handleInputFocus("managerId")}
                    />
                      {formErrors.managerId&& (
                      <div className="text-danger">
                        {formErrors.managerId}
                      </div>
                    )}
                </Form.Group>
            </Col>

            <Col md={4} className="mb-3">
                <Form.Group>
                    <Form.Label>Manager Name</Form.Label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                       <span className="input-group-text icon-container">
                  <FontAwesomeIcon  className="input-icon" icon={faCircleUser} />
                  </span>
                  </div>
                    <Form.Control
                    value={managerName}
                    onChange={(e)=>setManagerName(e.target.value)}
                    placeholder="Enter Manager Name"
                    onFocus={()=>handleInputFocus("managerName")}
                    />
                    </div>
                    {formErrors.managerName && (
                      <div className="text-danger">
                        {formErrors.managerName}
                      </div>
                    )}
                </Form.Group>
            </Col>
            </Row>
            
            <div className="flex gap-4 md:mt-8 lg:justify-end md:justify-center">
                <button
                  className="maincontent__btn maincontent__btn--primaryblue"
                //   disabled={isDisabled}
                  type="submit"
                  // onClick={() => savesearch()}
                >
                  Save and Continue
                </button>
      
                </div>
      </div>
        </Form>
        </div>
</div>
      
      
)
}
export default SearchEmployee