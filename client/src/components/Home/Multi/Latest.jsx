import React from "react";

export default function Latest() {
  const data = [
    {
      imageLink:
        "https://t3.ftcdn.net/jpg/05/40/14/74/360_F_540147475_OcIoB8xl5mHXSglIwncqumokZ19hkmLp.jpg",
      subtitle: "Professional Grade",
      name: "Elite Boxing Gloves",
      shortDescription:
        "Designed for professional boxers, these gloves offer superior protection and durability.",
    },
    {
      imageLink:
        "https://media.istockphoto.com/id/1250685727/vector/realistic-pairs-of-red-boxing-gloves.jpg?s=612x612&w=0&k=20&c=8_bpUgjGLFEy5WKkRMEaKmdpW9MRQFt6Z7wZ-Fq0MSY=",
      subtitle: "Best Seller",
      name: "Champion Boxing Gloves",
      shortDescription:
        "The top choice for champions, known for their comfort and fit.",
    },
    {
      imageLink:
        "https://anthonyjoshua.com/cdn/shop/articles/AJ_Fight_Insta_1.png?v=1662478898",
      subtitle: "New Arrival",
      name: "Ultra Boxing Gloves",
      shortDescription:
        "Our latest model with enhanced padding and wrist support.",
    },
    {
      imageLink:
        "https://c8.alamy.com/comp/E03GP9/red-boxing-gloves-isolated-on-white-background-E03GP9.jpg",
      subtitle: "Limited Edition",
      name: "Golden Boxing Gloves",
      shortDescription:
        "Exclusive golden gloves available for a limited time only.",
    },
  ];

  return (
    <section class="text-gray-600 body-font">
      <div class="container px-5 py-24 mx-auto">
        <div class="flex flex-wrap w-full mb-20">
          <div class="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
              Have A Look on what we provide
            </h1>
            <div class="h-1 w-20 bg-indigo-500 rounded"></div>
          </div>
        </div>
        <div class="flex flex-wrap -m-4">
          {data.map((ele, idx) => {
            return (
              <div class="xl:w-1/4 md:w-1/2 p-4" key={idx}>
                <div class="bg-gray-100 p-6 rounded-lg">
                  <img
                    class="h-40 rounded w-full object-cover object-center mb-6 mix-blend-multiply"
                    src={ele.imageLink}
                    alt={`${ele.name} Image`}
                  />
                  <h3 class="tracking-widest text-indigo-500 text-xs font-medium title-font">
                    {ele.subtitle}
                  </h3>
                  <h2 class="text-lg text-gray-900 font-medium title-font mb-4">
                    {ele.name}
                  </h2>
                  <p class="leading-relaxed text-base">
                    {ele.shortDescription}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
