import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from '../components/utils/Helmet';
import { User, LogIn } from 'lucide-react'; // Add LogIn icon
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  ArrowLeft, 
  Truck, 
  Shield, 
  RotateCcw,
  AlertCircle,
  Plus,
  Minus,
  Check,
  CreditCard
} from 'lucide-react';
import axios from 'axios';
import BuyNowModal from '../pages/BuyNowModal'; // Import the modal

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

interface OrderSuccess {
  orderId: string;
  paymentId: string;
  totalAmount: number;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  
  // Buy Now Modal States
  const [showBuyNowModal, setShowBuyNowModal] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<OrderSuccess | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await axios.get<Product>(`https://anantam-backend-7ezq.onrender.com/api/products/${productId}`);
      setProduct(response.data);
      setSelectedImage(response.data.imageUrl);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError('Product not found or failed to load.');
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

  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };
  
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const renderStars = (rating: number): JSX.Element => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
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

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = () => {
    if (!isAuthenticated()) {
      // Show sign-in prompt
      const shouldSignIn = window.confirm('Please sign in to add items to cart. Would you like to go to the sign-in page?');
      if (shouldSignIn) {
        navigate('/auth');
      }
      return;
    }
  
    if (product) {
      console.log('Adding to cart:', { product, quantity });
      // Implement cart functionality
      // You can add a toast notification here
      alert('Product added to cart successfully!');
    }
  };

  // Buy Now Handler
  const handleBuyNow = () => {
    if (!isAuthenticated()) {
      // Show sign-in prompt
      const shouldSignIn = window.confirm('Please sign in to purchase this product. Would you like to go to the sign-in page?');
      if (shouldSignIn) {
        navigate('/auth');
      }
      return;
    }
  
    if (product && product.status !== 'Out of Stock') {
      setShowBuyNowModal(true);
    }
  };

  // Order Success Handler
  const handleOrderSuccess = (orderData: OrderSuccess) => {
    setOrderSuccess(orderData);
    setShowBuyNowModal(false);

    // To:
navigate(`/payment-success/${orderData.orderId}`, { 
  state: { 
    paymentId: orderData.paymentId,
    totalAmount: orderData.totalAmount,
    productName: product?.name,
    quantity: quantity
  }
});
    // Show success message
    
    // Optionally redirect to order confirmation page
    // navigate(`/order-confirmation/${orderData.orderId}`);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Implement favorite functionality
  };

  const shareProduct = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      // Fallback to copy URL
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = [product.imageUrl, ...product.additionalImages].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-dark-900"
    >
      <Helmet title={`${product.name} | Anantam Aerial`} />
      
      {/* Breadcrumb & Back Button */}
      <div className="pt-28 pb-6 bg-dark-800">
        <div className="container-custom">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Products</span>
            </button>
          </div>
          <nav className="text-sm text-gray-400">
            <span>Products</span>
            <span className="mx-2">/</span>
            <span>{product.category}</span>
            <span className="mx-2">/</span>
            <span className="text-white">{product.name}</span>
          </nav>
        </div>
      </div>

      

      {/* Product Details */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative bg-dark-800 rounded-lg overflow-hidden">
                <img
                  src={selectedImage || product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                  }}
                />
                <div className={`absolute top-4 left-4 text-white text-sm px-3 py-1 rounded ${
                  product.status === 'In Stock' 
                    ? 'bg-green-600' 
                    : product.status === 'Low Stock' 
                      ? 'bg-yellow-600' 
                      : 'bg-red-600'
                }`}>
                  {product.status}
                </div>
              </div>
              
              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === image ? 'border-primary-500' : 'border-dark-600'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-primary-400 text-sm font-medium">{product.category}</span>
                  <span className="text-gray-400 text-sm">{product.brand}</span>
                </div>
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-4 mb-4">
                  {renderStars(product.rating)}
                  {product.reviews && product.reviews.length > 0 && (
                    <span className="text-gray-400 text-sm">
                      ({product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''})
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-accent-400">
                    {formatPrice(product.price)}
                  </span>
                  <div className="text-gray-400 text-sm mt-1">
                    Inclusive of all taxes
                  </div>
                </div>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check size={16} className="text-green-500" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Info */}
              <div className="bg-dark-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Availability:</span>
                  <span className={`font-medium ${
                    product.status === 'In Stock' 
                      ? 'text-green-400' 
                      : product.status === 'Low Stock' 
                        ? 'text-yellow-400' 
                        : 'text-red-400'
                  }`}>
                    {product.status}
                  </span>
                </div>
                {product.stock > 0 && (
                  <div className="text-gray-400 text-sm">
                    {product.stock} units available
                  </div>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              {product.status !== 'Out of Stock' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-300">Quantity:</span>
                    <div className="flex items-center border border-dark-600 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="p-2 hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Updated Buttons Section */}
                  <div className="flex items-center space-x-3 ">
                    {/* Buy Now Button - Primary */}
                    <button
                      onClick={handleBuyNow}
                      className={`w-full flex items-center justify-center space-x-2 py-3 border rounded-lg transition-colors ${
                        !isAuthenticated()
                          ? 'border-gray-600 bg-gray-600 text-gray-300 hover:bg-gray-500'
                          : 'border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white'
                      }`}                      
                   >
                      {!isAuthenticated() ? <LogIn size={18} /> : <CreditCard size={18} />}
                      <span>{!isAuthenticated() ? 'Sign In to Buy' : 'Buy Now'}</span>
                    </button>

                    {/* Add to Cart Button - Secondary */}
                    <button
                      onClick={addToCart}
                      className="w-full flex items-center justify-center space-x-2 py-3 border border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white rounded-lg transition-colors"
                    >
                      {!isAuthenticated() ? <LogIn size={18} /> : <ShoppingCart size={18} />}
  <span>{!isAuthenticated() ? 'Sign In to Add to Cart' : 'Add to Cart'}</span>
                    </button>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={toggleFavorite}
                        className={`flex-1 p-3 rounded-lg border transition-colors ${
                          isFavorite
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'border-dark-600 hover:border-red-500 hover:text-red-500'
                        }`}
                      >
                        <Heart size={18} className="mx-auto" />
                      </button>
                      <button
                        onClick={shareProduct}
                        className="flex-1 p-3 rounded-lg border border-dark-600 hover:border-primary-500 hover:text-primary-500 transition-colors"
                      >
                        <Share2 size={18} className="mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Out of Stock Message */}
              {product.status === 'Out of Stock' && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle size={20} className="text-red-400" />
                    <span className="text-red-400 font-medium">Currently Out of Stock</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    This product is currently unavailable. Please check back later or contact us for more information.
                  </p>
                </div>
              )}

              {/* Delivery Info */}
              <div className="bg-dark-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="text-primary-400" size={20} />
                  <div>
                    <div className="text-white font-medium">Free Delivery</div>
                    <div className="text-gray-400 text-sm">On orders above ₹5,000</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="text-green-400" size={20} />
                  <div>
                    <div className="text-white font-medium">1 Year Warranty</div>
                    <div className="text-gray-400 text-sm">Manufacturer warranty included</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="text-blue-400" size={20} />
                  <div>
                    <div className="text-white font-medium">7 Days Return</div>
                    <div className="text-gray-400 text-sm">Easy return policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <div className="border-b border-dark-600">
              <nav className="flex space-x-8">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'specifications', label: 'Specifications' },
                  { id: 'reviews', label: `Reviews (${product.reviews?.length || 0})` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-dark-700">
                      <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <div key={index} className="bg-dark-800 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium">{review.username}</h4>
                            <div className="flex items-center mt-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <span className="text-gray-400 text-sm">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Buy Now Modal */}
      {product && (
        <BuyNowModal
          isOpen={showBuyNowModal}
          onClose={() => setShowBuyNowModal(false)}
          product={product}
          quantity={quantity}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* Order Success Notification (Optional) */}
      {orderSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <Check size={20} />
            <div>
              <p className="font-medium">Order Placed Successfully!</p>
              <p className="text-sm">Order ID: {orderSuccess.orderId}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductDetailPage;