import { useEffect, useState } from "react";
import Review from "../../components/Card/Review.jsx";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/Loader/Loader.jsx";
import { useSelector } from "react-redux";

export default function ViewProduct() {
  const [productDetails, setProductDetails] = useState();
  const [reviews, setReviews] = useState([]);
  const { pid } = useParams();
  const [userRevew, setUserReview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const addReview = async (e) => {
    e.preventDefault();
    try {
      if (userRevew === "") {
        toast.warn("Kindly Provide a review before submitting a review", {
          position: "top-center",
        });
        return;
      }

      const res = await Axios.post(
        `http://localhost:8000/api/v1/product/review/${productDetails._id}`,
        { content: userRevew },
        { withCredentials: true }
      );

      const newReview = res.data?.productReview;
      setReviews((prevReviews) =>
        prevReviews.push(newReview.toString().trim())
      );
      window.location.reload();
    } catch (error) {
      toast.error(
        "Something went wrong ensure that you are logged in and try again",
        { position: "top-center" }
      );
    }
  };

  const getProductData = async () => {
    const res = await Axios.get(
      `http://localhost:8000/api/v1/product/getproduct/${pid}`
    );
    const details = res.data?.product;
    console.log(details);
    setProductDetails(details);

    const productReviews = await Axios.get(
      `http://localhost:8000/api/v1/product/review/${pid}`
    );

    const reviewsData = productReviews.data?.reviews;
    setReviews(reviewsData);
    console.log("Reviews " + reviewsData);
  };

  useEffect(() => {
    getProductData();
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const addToCart = async (pid) => {
    if (user && user.length === 0) {
      navigate("/login");
      return;
    }
    try {
      console.log(qty);
      console.log(pid);

      const res = await Axios.post(
        `http://localhost:8000/api/v1/cart/item/${pid}`,
        { quantity:qty },
        { withCredentials: true }
      );
      if (res.status === 200) {
        navigate("/carts");
      }
    } catch (error) {
      console.log(error);

      toast.error("Could not add to cart", { position: "top-center" });
    }
  };

  return isLoading ? (
    <div className="min-h-screen flex items-center">
      <Loader />
    </div>
  ) : (
    productDetails && (
      <section class="text-gray-600 body-font overflow-hidden">
        <div class="container px-5 py-24 mx-auto">
          <div class="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              alt="ecommerce"
              class="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src={productDetails.coverImage}
            />
            <div class="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h1 class="text-gray-900 text-3xl title-font font-medium mb-1">
                {productDetails.name}
              </h1>

              <p class="leading-relaxed">
                {productDetails.description.longDescription}
              </p>
              <div class="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                <div class="flex ml-6 items-center">
                  <span class="mr-3 font-semibold">Quantity</span>
                  <div class="relative">
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      id="quantity"
                      max={productDetails.stock}
                      className="ml-4 w-16 p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />{" "}
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
                  ₹{productDetails.price}
                </span>
                <button
                  className="w-full bg-orange-300 p-2 text-2xl hover:bg-orange-400 rounded-2xl text-white mt-2"
                  onClick={() => addToCart(productDetails._id)}
                >
                  Add To Cart
                </button>
                <button className="w-full bg-orange-500 text-2xl p-2 hover:bg-orange-600 rounded-xl text-white mt-2">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <form
              onSubmit={addReview}
              className="max-w-md mx-auto bg-white rounded-xl overflow-hidden md:max-w-2xl my-8 p-6"
            >
              <label htmlFor="review">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Add your Review
                </h2>
              </label>
              <textarea
                id="review"
                value={userRevew}
                onChange={(e) => setUserReview(e.target.value)}
                className="w-full h-32 p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                placeholder="Write your review here..."
              ></textarea>
              <button
                type="submit"
                className=" mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-700 focus:ring-opacity-50"
              >
                Submit
              </button>
            </form>

            <h1 className="text-4xl text-center font-semibold text-black">
              Reviews
            </h1>

            {reviews && reviews.length > 0 ? (
              reviews.map((review) => {
                return (
                  <Review
                    key={review._id}
                    message={review.content}
                    user={review.user}
                  />
                );
              })
            ) : (
              <h1 className="text-xl font-bold">No Reviews Available</h1>
            )}
          </div>
        </div>
        <ToastContainer />
      </section>
    )
  );
}
