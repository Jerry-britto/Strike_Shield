import React from "react";
import Navbar from "../../components/Home/Header/Navbar.jsx";
import Banner from "../../components/Home/Banner/Banner.jsx";
import Slide from "../../components/Home/Slide/Slide.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Latest from "../../components/Home/Multi/Latest.jsx";
function Home() {
  return (
    <div className="w-full min-h-screen bg-slate-200">
      <Navbar />
      <Banner />
      <Slide />
      <Latest />
      <Footer />
    </div>
  );
}

export default Home;
