  import { useNavigate } from "react-router-dom"
  import React  from 'react'
  import { Routes } from "../../routes";
  import Logo from '../../assets/img/new-dashboard/Logo.svg'; 

  function Newpage() {
      const navigate = useNavigate();
    return (
      <div className="fullscreen-container"> 
        <img src={Logo}  className="centered-svg" />

    <div className="content-container">
          <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Akash</h1>
          </div>
          <div className="button-container"></div>        <div className="button-container">
          <button className=" employee-button"  onClick={()=>navigate(Routes.NewDashboard)}>Executive View</button>
          <button className=" executive-button" onClick={()=>navigate(Routes.NewArticles)}>Employee View</button>
        </div>
  </div>
    )
  }

  export default Newpage