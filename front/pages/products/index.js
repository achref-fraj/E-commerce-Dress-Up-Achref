import { CartContext } from "@/lib/CartContext";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

// Utility function to format price with a comma for thousands
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Products({ allProducts }) {
  const { addProduct } = useContext(CartContext);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const filterProducts = () => {
    if (searchQuery === "") {
      setFilteredProducts(allProducts);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = allProducts.filter((product) =>
        product.title.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredProducts(filtered);
    }
  };

  useEffect(() => {
    filterProducts();
  }, [searchQuery]);

  return (
    <div className="flex justify-center min-h-screen w-full">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen w-full">
          <Spinner />
        </div>
      ) : (
        <div className="mt-14 md:mt-6 w-full px-4 md:p-0">
          <input
            type="text"
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 px-4 py-2 rounded-lg border border-gray-300 w-full" // Increased the input size
          />

          {filteredProducts.length === 0 ? ( // Display a message when no matching searches
            <p className="text-center text-gray-600">
              No matching products found.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 md:gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 xl:gap-x-8 px-2">
              {filteredProducts.map((product) => (
                <div key={product._id}>
                  <div className="group block overflow-hidden border border-accent rounded-xl border-opacity-10">
                    <div className="">
                      <div className="relative md:h-[300px] h-[200px]">
                      <Link href={"/products/" + product._id}>
                        <img
                          src={product.images[0]}
                          alt=""
                          className="absolute inset-0 h-full w-full object-contain opacity-100 group-hover:opacity-0"
                        />
                        <img
                          src={product.images[1]}
                          alt=""
                          className="absolute inset-0 h-full w-full object-contain opacity-0 group-hover:opacity-100"
                        />
                        </Link>
                      </div>

                      <div className="relative p-3 border-t">
                        
                          <h3 >
                            {product.title}<div className="mt-1.5 flex items-center justify-between text-text">
                    <p className="tracking-wide text-black">DT. {formatPrice(product.price)}</p>


                      <button onClick={() => {addProduct(product._id);
                         toast.success('Item added to cart!!')}} type="button" class="flex items-center divide-x rounded-lg border bg-white text-center text-md font-medium text-secondary-700 shadow-sm hover:bg-gray-100">
                        <div class="flex items-center space-x-2 py-2.5 px-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>


                          <span>Add</span>
                        </div>
                        {/* <div class="py-2.5 px-3">18</div> */}
                      </button>

                    </div>
                          </h3>
                       

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const allProducts = await Product.find({}, null, { sort: { _id: 1 } });

  return {
    props: {
      allProducts: JSON.parse(JSON.stringify(allProducts)),
    },
  };
}

// initial code
// import { CartContext } from "@/lib/CartContext";
// import { mongooseConnect } from "@/lib/mongoose";
// import { Product } from "@/models/Product";
// import Link from "next/link";
// import { useContext, useEffect, useState } from "react";
// import Spinner from "../components/Spinner";
// import toast from "react-hot-toast";

// // Utility function to format price with a comma for thousands
// const formatPrice = (price) => {
//   return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };

// export default function Products({ allProducts }) {
//   const { addProduct } = useContext(CartContext)

//   const [loading, setLoading] = useState(true); // Step 1: Initialize loading state

//   useEffect(() => {
//     // Simulate loading effect with a delay (you can replace this with your API fetch)
//     setTimeout(() => {
//       setLoading(false); // Step 3: Set loading to false after fetching data (replace with your data fetching logic)
//     }, 2000); // Delay for 2 seconds (adjust as needed)
//   }, []); // Empty dependency array to run once on component mount
//   return (
//     <div className="flex justify-center items-center min-h-screen w-full">
//       {loading ? (
//         <Spinner />
//       ) : (
//         <div className="mt-14 md:mt-6 grid grid-cols-2 gap-x-3 md:gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 xl:gap-x-8 px-2">
//           {allProducts.map((product) => (
//             <div key={product._id}>
//               <div className="group block overflow-hidden border border-accent rounded-xl border-opacity-10">
//                 <div className="">
//                   <div className="relative md:h-[300px] h-[200px]">
//                     <img
//                       src={product.images[0]}
//                       alt=""
//                       className="absolute inset-0 h-full w-full object-contain opacity-100 group-hover:opacity-0"
//                     />
//                     <img
//                       src={product.images[1]}
//                       alt=""
//                       className="absolute inset-0 h-full w-full object-contain opacity-0 group-hover:opacity-100"
//                     />
//                   </div>

//                   <div className="relative p-3 border-t">
//                     <Link href={'/products/'+ product._id}>
//                       <h3 className="text-md text-gray-700 group-hover:underline group-hover:underline-offset-4 truncate">
//                         {product.title}
//                       </h3>
//                     </Link>

//                     <div className="mt-1.5 flex flex-col   items-center justify-between text-text">
//                       <p className="tracking-wide text-primary text-sm md:text-md">ksh. {formatPrice(product.price)}</p>

//                       <div class="col-span-12 text-center w-full mt-3">
//                         <button
//                           onClick={() => {addProduct(product._id); toast.success('Item added to cart!')}}
//                           className="disabled block rounded bg-secondary px-5 py-3 text-md text-text w-full transition hover:bg-purple-300"
//                         >
//                           Add to cart
//                         </button>
//                       </div>
                      
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

// }


// export async function getServerSideProps() {
//   await mongooseConnect();
//   const allProducts = await Product.find({}, null, { sort: { '_id': 1 } })

//   return {
//     props: {
//       allProducts: JSON.parse(JSON.stringify(allProducts))
//     },
//   };
// }
