import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import url from "../../constants/url";

export default function Home() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [index, setIndex] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${url}/product/get-product`);
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const nextSlide = () => {
        if (products.length > 0) {
            setIndex((prevIndex) => (prevIndex + 1) % products.length);
        }
    };

    const prevSlide = () => {
        if (products.length > 0) {
            setIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
        }
    };

    return (
        <div className="bg-white">
            <Navbar />
            {/* ✅ Product Slider (Only show if products are loaded) */}
            {loading ? (
                <div className="h-[50vh] sm:h-[80vh] flex items-center justify-center">
                    <p className="text-gray-500">Loading products...</p>
                </div>
            ) : (
                products.length > 0 && (
                    <div className="relative w-full h-[50vh] sm:h-[80vh] overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={index}
                                src={products[index]?.imageUrl}
                                alt={`Slide ${index}`}
                                className="absolute w-full h-full object-cover cursor-pointer"
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                                onClick={() => setSelectedProduct(products[index])} // Open popup on click
                            />
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
                            onClick={prevSlide}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
                            onClick={nextSlide}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                )
            )}

            {/* ✅ Product Grid (Only show if products are loaded) */}
            {loading ? (
                <div className="p-10 text-center">
                    <p className="text-gray-500">Loading products...</p>
                </div>
            ) : (
                products.length > 0 && (
                    <div className="mx-auto w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
                        <h2 className="text-black text-2xl mb-6">Products</h2>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    onClick={() => setSelectedProduct(product)}
                                    className="group cursor-pointer"
                                >
                                    <img
                                        alt="Product"
                                        src={product.imageUrl}
                                        className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                                    />
                                    <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                                    <p className="mt-1 text-lg font-medium text-gray-900">₹{product.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            )}

            {/* ✅ Modal Popup */}
            {selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <img
                            src={selectedProduct.imageUrl}
                            alt={selectedProduct.name}
                            className="aspect-square w-full rounded-lg bg-gray-200 object-cover"
                        />
                        <h3 className="text-xl font-bold mt-4">{selectedProduct.name}</h3>
                        <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
                        <p className="text-lg font-semibold text-gray-900 mt-4">₹{selectedProduct.price}</p>
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
