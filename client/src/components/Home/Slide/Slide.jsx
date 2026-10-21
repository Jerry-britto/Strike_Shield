import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "../../Product/ProductCard.jsx";
import { ProductCardSkeleton } from "../../Loader/Skeletons.jsx";

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4, partialVisibilityGutter: 24 },
  tablet: { breakpoint: { max: 1024, min: 568 }, items: 2, partialVisibilityGutter: 20 },
  mobile: { breakpoint: { max: 568, min: 0 }, items: 1, partialVisibilityGutter: 16 },
};

export default function Slide({ products = [], loading = false }) {
  return (
    <section className="container-page py-12 lg:py-16">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
          Best Sellers
        </span>
        <h2 className="mt-2 font-display text-4xl tracking-wide text-navy-900 sm:text-5xl">
          Popular Products
        </h2>
        <div className="mt-3 h-1 w-16 rounded bg-brand-600" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <Carousel
          responsive={responsive}
          infinite
          arrows
          draggable
          swipeable
          keyBoardControl
          pauseOnHover
          shouldResetAutoplay
          itemClass="px-3"
          containerClass="-mx-3"
        >
          {products.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </Carousel>
      ) : (
        <div className="card p-10 text-center text-navy-500">
          No products to show yet.
        </div>
      )}
    </section>
  );
}
