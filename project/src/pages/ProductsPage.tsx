import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from '../components/utils/Helmet';
import { ShoppingCart, Filter, SlidersHorizontal, Star, Heart, Eye, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

type Category = 'All Products' | 'Professional Drones' | 'Hobby Drones' | 'Components' | 'Accessories' | 'Navigation' | 'Power';
type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All Products');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const navigate = useNavigate();

  // Get unique categories from products
  const getCategories = (): Category[] => {
    const uniqueCategories = Array.from(new Set(products.map(product => product.category))) as Category[];
    return ['All Products', ...uniqueCategories.sort()];
  };

  const categories = getCategories();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<Product[]>('https://anantam-backend-7ezq.onrender.com/api/products');
      setProducts(response.data);
      
      // Update price range based on actual product prices
      if (response.data.length > 0) {
        const prices = response.data.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([0, maxPrice]);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory !== 'All Products' && product.category !== selectedCategory) {
      return false;
    }
    
    // Price range filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Search filter
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.brand.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default: // featured
        return 0;
    }
  });

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
            size={14}
            className={`${
              i < Math.floor(rating) 
                ? 'text-yellow-400 fill-current' 
                : i < rating 
                  ? 'text-yellow-400 fill-current opacity-50' 
                  : 'text-gray-400'
            }`}
          />
        ))}
        <span className="text-gray-400 text-sm ml-2">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const toggleFavorite = (productId: string): void => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const addToCart = (product: Product): void => {
    // Implement add to cart functionality
    console.log('Adding to cart:', product);
    // You can integrate with your cart system here
  };

  const resetFilters = (): void => {
    setSelectedCategory('All Products');
    setPriceRange([0, products.length > 0 ? Math.max(...products.map(p => p.price)) : 200000]);
    setSortOption('featured');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
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
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet title="Products | Anantam Aerial" />
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-dark-900 opacity-80 z-0"></div>
        <div className='absolute inset-0'>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat"></div>
        <div className="absolute inset-0 bg-black opacity-60"></div>

        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Products</h1>
            <p className="text-xl text-gray-300">Browse our collection of high-quality drones and components.</p>
            
            {/* Search Bar */}
            <div className="mt-8 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-4 pr-10 py-3 bg-dark-800 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Content */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <div className="card p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-300 hover:bg-dark-600'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="card p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={products.length > 0 ? Math.max(...products.map(p => p.price)) : 200000}
                      step="5000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-primary-500"
                    />
                  </div>
                </div>
                
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Sort By</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'featured', label: 'Featured' },
                      { value: 'newest', label: 'Newest First' },
                      { value: 'price-low', label: 'Price: Low to High' },
                      { value: 'price-high', label: 'Price: High to Low' },
                      { value: 'rating', label: 'Highest Rated' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          sortOption === option.value
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-300 hover:bg-dark-600'
                        }`}
                        onClick={() => setSortOption(option.value as SortOption)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full btn-outline mt-4"
                >
                  Reset Filters
                </button>
              </div>
            </div>
            
            {/* Mobile Filters Button */}
            <div className="lg:hidden flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Products ({filteredProducts.length})</h2>
              <button
                className="btn-outline py-2 flex items-center space-x-2"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <Filter size={18} />
                <span>Filters</span>
              </button>
            </div>
            
            {/* Mobile Filters Modal */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 lg:hidden">
                <div className="bg-dark-700 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                  <div className="p-4 border-b border-dark-600 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <button
                      className="text-gray-400 hover:text-white text-2xl leading-none"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      &times;
                    </button>
                  </div>
                  
                  <div className="p-4 border-b border-dark-600">
                    <h4 className="font-medium mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedCategory === category
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-300 hover:bg-dark-600'
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 border-b border-dark-600">
                    <h4 className="font-medium mb-3">Price Range</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={products.length > 0 ? Math.max(...products.map(p => p.price)) : 200000}
                        step="5000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full accent-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 border-b border-dark-600">
                    <h4 className="font-medium mb-3">Sort By</h4>
                    <div className="space-y-2">
                      {[
                        { value: 'featured', label: 'Featured' },
                        { value: 'newest', label: 'Newest First' },
                        { value: 'price-low', label: 'Price: Low to High' },
                        { value: 'price-high', label: 'Price: High to Low' },
                        { value: 'rating', label: 'Highest Rated' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            sortOption === option.value
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-300 hover:bg-dark-600'
                          }`}
                          onClick={() => setSortOption(option.value as SortOption)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 flex space-x-4">
                    <button
                      className="btn-outline w-1/2"
                      onClick={resetFilters}
                    >
                      Reset
                    </button>
                    <button
                      className="btn-primary w-1/2"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Product Grid */}
            <div className="flex-grow">
              {/* Desktop Sort & Filter Bar */}
              <div className="hidden lg:flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold">Products ({filteredProducts.length})</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <SlidersHorizontal size={18} className="text-gray-400" />
                    <select
                      className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-primary-500"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as SortOption)}
                    >
                      <option value="featured">Featured</option>
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedProducts.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="card group relative"
                    >
                      
                      <div className="relative overflow-hidden h-48 cursor-pointer" onClick={() => navigate(`/products/${product._id}`)}>
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
                            onClick={() => toggleFavorite(product._id)}
                            className={`p-2 rounded-full transition-colors ${
                              favorites.has(product._id) 
                                ? 'bg-red-500 text-white' 
                                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                            }`}
                          >
                            <Heart size={16} />
                          </button>
                          <button 
  onClick={() => navigate(`/products/${product._id}`)}
  className="p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors"
>
  <Eye size={16} />
</button>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                        <button 
  onClick={() => navigate(`/products/${product._id}`)}
  className="text-lg font-semibold truncate flex-grow mr-2 text-left hover:text-primary-400 transition-colors"
>
  {product.name}
</button>
                          {product.brand && (
                            <span className="text-xs text-gray-400 flex-shrink-0">{product.brand}</span>
                          )}
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                        
                        {/* Features */}
                        {product.features && product.features.length > 0 && (
                          <div className="mb-4">
                            <div className="text-xs text-gray-500 mb-1">Key Features:</div>
                            <div className="flex flex-wrap gap-1">
                              {product.features.slice(0, 3).map((feature, index) => (
                                <span key={index} className="text-xs bg-dark-600 text-gray-300 px-2 py-1 rounded">
                                  {feature}
                                </span>
                              ))}
                              {product.features.length > 3 && (
                                <span className="text-xs text-gray-400">+{product.features.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Rating */}
                        <div className="mb-4">
                          {renderStars(product.rating)}
                          {product.reviews && product.reviews.length > 0 && (
                            <span className="text-xs text-gray-400 ml-1">
                              ({product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''})
                            </span>
                          )}
                        </div>
                        
                        {/* Price and Actions */}
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xl font-semibold text-accent-400">
                              {formatPrice(product.price)}
                            </span>
                            {product.stock > 0 && (
                              <div className="text-xs text-gray-400">
                                {product.stock} in stock
                              </div>
                            )}
                          </div>
                          
                          <button 
                            onClick={() => addToCart(product)}
                            disabled={product.status === 'Out of Stock'}
                            className={`p-2 rounded-lg transition-colors ${
                              product.status === 'Out of Stock'
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'btn-primary hover:bg-primary-700'
                            }`}
                          >
                            <ShoppingCart size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    {products.length === 0 
                      ? 'No products available at the moment.' 
                      : 'No products match your current filters.'
                    }
                  </div>
                  {filteredProducts.length === 0 && products.length > 0 && (
                    <button 
                      className="btn-outline"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ProductsPage;