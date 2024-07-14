import React, { useEffect } from "react";
import Banner from "../../components/Home/Banner/Banner.jsx";
import Slide from "../../components/Home/Slide/Slide.jsx";
import Latest from "../../components/Home/Multi/Latest.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function Home() {

  const user = useSelector(state=>state.user);
  const navigate = useNavigate()
  useEffect(()=>{
    if(user && user.length > 0 && user[0]['isAdmin']){
      console.log("user is an admin");
      navigate("/admin")
    }
  })
  return (
    <div className="w-full min-h-screen bg-slate-200">
      <Banner />
      <Slide />
      <Latest />
    </div>
  );
}

export default Home;
