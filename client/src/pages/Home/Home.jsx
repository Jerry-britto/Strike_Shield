import React from "react";
import Banner from "../../components/Home/Banner/Banner.jsx";
import Slide from "../../components/Home/Slide/Slide.jsx";
import Latest from "../../components/Home/Multi/Latest.jsx";
function Home() {
  return (
    <div className="w-full min-h-screen bg-slate-200">
      <Banner />
      <Slide />
      <Latest />
    </div>
  );
}

export default Home;
