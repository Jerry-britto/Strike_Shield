import {NavLink} from "react-router-dom";

export default function Latest({ lowerViewProducts = [] }) {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap w-full mb-20">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
              Have A Look on what we provide
            </h1>
            <div className="h-1 w-20 bg-indigo-500 rounded"></div>
          </div>
        </div>
        <div className="flex flex-wrap -m-4">
          {lowerViewProducts && lowerViewProducts.length > 0 ? (
            lowerViewProducts.map((ele) => {
              return (
                <div className="xl:w-1/4 md:w-1/2 p-4" key={ele._id}>
                  <NavLink to={`/product/${ele._id}`}>
                  <div className="bg-gray-100 p-6 rounded-lg">
                    <img
                      className="h-40 rounded w-full object-cover object-center mb-6 mix-blend-multiply"
                      src={ele.coverImage}
                      alt={`${ele.name} Image`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://placehold.co/400x400?text=StrikeShield";
                      }}
                    />
                    <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font uppercase">
                      {ele.category || "Boxing Gear"}
                    </h3>
                    <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                      {ele.name}
                    </h2>
                    <p className="leading-relaxed text-base">
                      {ele.description?.shortDescription}
                    </p>
                  </div>
                  </NavLink>
                </div>
              );
            })
          ) : (
            <div className="font-bold text-xl">No items</div>
          )}
        </div>
      </div>
    </section>
  );
}
