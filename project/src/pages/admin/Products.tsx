import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Filter, X, Upload, Star } from 'lucide-react';
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

interface NewProduct {
  name: string;
  category: string;
  description: string;
  features: string;
  specifications: string;
  price: string;
  stock: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  brand: string;
  images: File[];
}

type Category = 'All' | 'Professional Drones' | 'Hobby Drones' | 'Components' | 'Accessories';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    category: 'Professional Drones',
    description: '',
    features: '',
    specifications: '',
    price: '',
    stock: '',
    status: 'In Stock',
    brand: '',
    images: [],
  });

  const categories: Category[] = [
    'All',
    'Professional Drones',
    'Hobby Drones',
    'Components',
    'Accessories',
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      const response = await axios.get<Product[]>('https://anantam-backend-7ezq.onrender.com/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    setNewProduct(prev => ({
      ...prev,
      images: files,
    }));
  };

  const resetForm = (): void => {
    setNewProduct({
      name: '',
      category: 'Professional Drones',
      description: '',
      features: '',
      specifications: '',
      price: '',
      stock: '',
      status: 'In Stock',
      brand: '',
      images: [],
    });
    setEditingProduct(null);
    
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleAddProduct = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.stock) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('category', newProduct.category);
      formData.append('description', newProduct.description);
      formData.append('features', newProduct.features);
      formData.append('specifications', newProduct.specifications);
      formData.append('price', newProduct.price);
      formData.append('stock', newProduct.stock);
      formData.append('status', newProduct.status);
      formData.append('brand', newProduct.brand);
      
      newProduct.images.forEach((image) => {
        formData.append('images', image);
      });

      if (editingProduct) {
        await axios.put(`https://anantam-backend-7ezq.onrender.com/api/products/${editingProduct._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('https://anantam-backend-7ezq.onrender.com/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setShowModal(false);
      resetForm();
      await fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product): void => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      description: product.description,
      features: product.features.join(', '),
      specifications: JSON.stringify(product.specifications || {}),
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status,
      brand: product.brand,
      images: [],
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`https://anantam-backend-7ezq.onrender.com/api/products/${productId}`);
        await fetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    resetForm();
  };

  const renderStars = (rating: number): JSX.Element => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={`${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-400">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const filteredProducts = products.filter((product) => {
    return (
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-dark-950 text-white p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-gray-400">Manage your product inventory</p>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="btn-primary flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name, brand, or description..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 appearance-none text-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Category)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.imageUrl || 'https://via.placeholder.com/150'}
                              alt={product.name}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/150';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{product.name}</div>
                            <div className="text-xs text-gray-400 max-w-xs truncate">
                              {product.description}
                            </div>
                            <div className="text-xs text-gray-500">#{product._id.slice(-4)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-200">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{product.brand || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">₹{product.price.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{product.stock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === 'In Stock'
                            ? 'bg-green-900 text-green-200'
                            : product.status === 'Low Stock'
                            ? 'bg-yellow-900 text-yellow-200'
                            : 'bg-red-900 text-red-200'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStars(product.rating)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-400 hover:text-blue-300 mr-3 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
              <button 
                onClick={handleCloseModal} 
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-4">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name *"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="brand"
                    placeholder="Brand"
                    value={newProduct.brand}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <select
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                >
                  {categories.filter(c => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <textarea
                  name="description"
                  placeholder="Product Description *"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500 resize-vertical"
                  required
                />

                <textarea
                  name="features"
                  placeholder="Features (comma-separated, e.g., 4K Camera, GPS, Auto-Return)"
                  value={newProduct.features}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500 resize-vertical"
                />

                <textarea
                  name="specifications"
                  placeholder='Specifications (JSON format, e.g., {"weight": "2kg", "battery": "30min", "range": "7km"})'
                  value={newProduct.specifications}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500 resize-vertical"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="number"
                    name="price"
                    placeholder="Price (₹) *"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock Quantity *"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                    required
                    min="0"
                  />
                  <select
                    name="status"
                    value={newProduct.status}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500 cursor-pointer flex items-center justify-center hover:bg-gray-600 transition-colors"
                  >
                    <Upload size={16} className="mr-2" />
                    {newProduct.images.length > 0 
                      ? `${newProduct.images.length} image(s) selected` 
                      : 'Upload Product Images (up to 5)'}
                  </label>
                  <div className="text-xs text-gray-400 mt-1">
                    Select multiple images. First image will be the main product image.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-3 rounded-lg transition-colors text-white font-medium"
                >
                  {loading 
                    ? (editingProduct ? 'Updating Product...' : 'Adding Product...') 
                    : (editingProduct ? 'Update Product' : 'Add Product')
                  }
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Products;