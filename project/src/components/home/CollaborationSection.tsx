'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Collaborator {
  _id: string;
  name: string;
  logo: string;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const CollaborationSection = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [selected, setSelected] = useState<Collaborator | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const fetchCollaborators = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<Collaborator[]>('https://anantam-backend-7ezq.onrender.com/api/collaborators');
      setCollaborators(response.data);
    } catch (error) {
      console.error('Failed to fetch collaborators:', error);
      setError('Failed to load collaborators. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Create duplicated array for seamless scrolling
  const scrollingCollaborators = collaborators.length > 0 
    ? [...collaborators, ...collaborators] 
    : [];

  if (loading) {
    return (
      <section className="py-16 bg-dark-900">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading collaborators...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-dark-900">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchCollaborators}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (collaborators.length === 0) {
    return (
      <section className="py-16 bg-dark-900">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Our <span className="text-primary-500">Collaborators</span>
            </h2>
            <p className="text-gray-400">No collaborators found at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-dark-900 overflow-hidden relative">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Trusted by <span className="text-primary-500">Industry Leaders</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We're proud to collaborate with innovative companies across various industries.
          </p>
        </motion.div>

        {/* Horizontal Scrolling */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-dark-900 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-dark-900 to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-horizontal-scroll w-[200%] space-x-8">
            {scrollingCollaborators.map((collaborator, index) => (
              <div
                key={`${collaborator._id}-${index}`}
                onClick={() => setSelected(collaborator)}
                className="group flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
              >
                <div className="bg-dark-800 rounded-2xl p-8 w-178 h-64 border border-dark-600 hover:border-primary-600/40 shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center">
                  <div className="w-180 h-36 rounded-lg mb-4 overflow-hidden bg-dark-700 flex items-center justify-center">
                    {collaborator.logo ? (
                      <img
                        src={collaborator.logo}
                        alt={collaborator.name}
                        className="w-100 h-36 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`${collaborator.logo ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                      <div className="text-gray-400 text-sm font-medium">
                        {collaborator.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-md font-semibold text-white group-hover:text-primary-400 truncate w-full">
                    {collaborator.name}
                  </h3>
                  <p className="text-xs text-gray-500">{collaborator.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal / Details View */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800 text-white rounded-xl p-6 w-full max-w-md relative"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-3 text-xl text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
            <div className="w-20 h-20 rounded-lg mx-auto mb-4 overflow-hidden bg-dark-700 flex items-center justify-center">
              {selected.logo ? (
                <img
                  src={selected.logo}
                  alt={selected.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`${selected.logo ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                <div className="text-gray-400 text-lg font-bold">
                  {selected.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2 text-center">{selected.name}</h2>
            <p className="text-sm text-primary-500 text-center mb-2">{selected.category}</p>
            {selected.description && (
              <p className="text-gray-300 text-sm text-center">{selected.description}</p>
            )}
            <div className="text-xs text-gray-500 text-center mt-4">
              Added: {new Date(selected.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default CollaborationSection;