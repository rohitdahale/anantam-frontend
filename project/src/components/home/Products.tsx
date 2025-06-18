import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Star, Eye, ShoppingCart } from 'lucide-react';
import axios from 'axios';

// TypeScript interfaces
interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  imageUrl: string;
  additionalImages: string[];
  brand: string;
  rating: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

interface Review {
  userId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<Product[]>('https://anantam-backend-7ezq.onrender.com/api/products');
      // Get only the first 4 products for the home page
      setProducts(response.data.slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating: number): JSX.Element => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={`${
              i < Math.floor(rating) 
                ? 'text-yellow-400 fill-current' 
                : i < rating 
                  ? 'text-yellow-400 fill-current opacity-50' 
                  : 'text-gray-400'
            }`}
          />
        ))}
        <span className="text-gray-400 text-xs ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const handleProductClick = (productId: string): void => {
    navigate(`/products/${productId}`);
  };

  const addToCart = (product: Product, e: React.MouseEvent): void => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    // Implement add to cart functionality
    console.log('Adding to cart:', product);
    // You can integrate with your cart system here
  };

  if (loading) {
    return (
      <section className="section-padding bg-dark-900">
        <div className="container-custom">
          <div className="section-title">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-accent-500">Products</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover our collection of high-quality drones and components crafted for professionals.
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading products...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding bg-dark-900">
        <div className="container-custom">
          <div className="section-title">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-accent-500">Products</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover our collection of high-quality drones and components crafted for professionals.
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">{error}</p>
              <button 
                onClick={fetchProducts}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-dark-900">
      <div className="container-custom">
        <div className="section-title">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Featured <span className="text-accent-500">Products</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Discover our collection of high-quality drones and components crafted for professionals.
          </motion.p>
        </div>

        {products.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
          >
            {products.map((product) => (
              <motion.div
                key={product._id}
                variants={item}
                className="card group cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              >
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={product.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-60"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                    {product.category}
                  </div>
                  
                  {/* Stock Status Badge */}
                  <div className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded ${
                    product.status === 'In Stock' 
                      ? 'bg-green-600' 
                      : product.status === 'Low Stock' 
                        ? 'bg-yellow-600' 
                        : 'bg-red-600'
                  }`}>
                    {product.status}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product._id);
                      }}
                      className="p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={(e) => addToCart(product, e)}
                      disabled={product.status === 'Out of Stock'}
                      className={`p-2 rounded-full transition-colors ${
                        product.status === 'Out of Stock'
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                      title="Add to Cart"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold truncate flex-grow mr-2">{product.name}</h3>
                    {product.brand && (
                      <span className="text-xs text-gray-400 flex-shrink-0">{product.brand}</span>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 2).map((feature, index) => (
                          <span key={index} className="text-xs bg-dark-600 text-gray-300 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {product.features.length > 2 && (
                          <span className="text-xs text-gray-400">+{product.features.length - 2}</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Rating */}
                  <div className="mb-3">
                    {renderStars(product.rating)}
                    {product.reviews && product.reviews.length > 0 && (
                      <span className="text-xs text-gray-400 ml-1">
                        ({product.reviews.length})
                      </span>
                    )}
                  </div>
                  
                  {/* Price and Stock */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-accent-400 font-semibold text-lg">
                        {formatPrice(product.price)}
                      </span>
                      {product.stock > 0 && (
                        <div className="text-xs text-gray-400">
                          {product.stock} in stock
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product._id);
                      }}
                      className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              No products available at the moment.
            </div>
            <button 
              onClick={fetchProducts}
              className="btn-primary"
            >
              Refresh
            </button>
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/products" className="btn-outline">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;