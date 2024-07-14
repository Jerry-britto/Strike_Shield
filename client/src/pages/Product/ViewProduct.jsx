import React from "react";
import Review from "../../components/Card/Review.jsx";

export default function ViewProduct() {
  return (
    <section class="text-gray-600 body-font overflow-hidden">
      <div class="container px-5 py-24 mx-auto">
        <div class="lg:w-4/5 mx-auto flex flex-wrap">
          <img
            alt="ecommerce"
            class="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
            src="https://t3.ftcdn.net/jpg/05/40/14/74/360_F_540147475_OcIoB8xl5mHXSglIwncqumokZ19hkmLp.jpg"
          />
          <div class="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h1 class="text-gray-900 text-3xl title-font font-medium mb-1">
              The Catcher in the Rye
            </h1>

            <p class="leading-relaxed">
              Fam locavore kickstarter distillery. Mixtape chillwave tumeric
              sriracha taximy chia microdosing tilde DIY. XOXO fam indxgo
              juiceramps cornhole raw denim forage brooklyn. Everyday carry +1
              seitan poutine tumeric. Gastropub blue bottle austin listicle
              pour-over, neutra jean shorts keytar banjo tattooed umami
              cardigan.
            </p>
            <div class="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
              <div class="flex ml-6 items-center">
                <span class="mr-3 font-semibold">Quantity</span>
                <div class="relative">
                  <select class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10">
                    <option defaultChecked>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                  <span class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      class="w-4 h-4"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <span class="title-font font-medium text-2xl text-gray-900">
                $58.00
              </span>
              <button className="w-full bg-orange-300 p-2 text-2xl hover:bg-orange-400 rounded-2xl text-white mt-2">
                Add To Cart
              </button>
              <button className="w-full bg-orange-500 text-2xl p-2 hover:bg-orange-600 rounded-xl text-white mt-2">
                Buy Now
              </button>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden md:max-w-2xl my-8 p-6">
            <label htmlFor="review">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Add your Review
              </h2>
            </label>
            <textarea
              id="review"
              className="w-full h-32 p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              placeholder="Write your review here..."
            ></textarea>
            <button className=" mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-700 focus:ring-opacity-50">
              Submit
            </button>
          </div>

          <h1 className="text-4xl text-center font-semibold text-black">
            Reviews
          </h1>
          <Review message="bad product" user="ryan" />
          <Review message="good product" user="jabba" />
          <Review message="unique product" user="eman" />
          <Review message="stylish product" user="emanuel" />
        </div>
      </div>
    </section>
  );
}
