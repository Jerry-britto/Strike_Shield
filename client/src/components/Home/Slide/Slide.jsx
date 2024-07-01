import { Divider } from "@mui/material";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function Slide() {
  return (
    <div className="p-8 rounded-lg bg-white  mx-10 my-5">
      <h2 className="text-3xl font-bold text-center mb-2">Popular Products</h2>
      <Divider/>
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode={false}
        className=""
        containerClass="container-with-dots"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass="center"
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024,
            },
            items: 3,
            partialVisibilityGutter: 40,
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0,
            },
            items: 1,
            partialVisibilityGutter: 30,
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464,
            },
            items: 2,
            partialVisibilityGutter: 30,
          },
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        <div>
            <img src="https://www.teamsports.co.nz/media/catalog/product/cache/fc866fa1157947dbcae7c204ef679120/a/d/adiaibag1-b_2.jpg" alt="" />
        </div>
        <div>
          <img
            src="https://www.windyfightgear.com/cdn/shop/files/Classic-Lace-Up-Leather-Boxing-Glove-Red.webp?v=1708012557"
            alt=""
          />
        </div>
        <div>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG86-eEzbVUrYjA-dTEGrVdJoLzO1n0uFOhQ&s" alt="" className="mt-24 h-80" />
        </div>
        <div>
            <img src="https://www.windyfightgear.com/cdn/shop/files/Classic-Lace-Up-Leather-Boxing-Glove-Red-3.webp?v=1708012578&width=1445" alt="" />
        </div>
      </Carousel>
    </div>
  );
}
