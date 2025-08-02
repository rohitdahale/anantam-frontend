import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

// Interface matching your backend About schema exactly
interface Value {
  title: string;
  description: string;
  icon: string;
}

interface TeamMember {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
}

interface AboutData {
  _id?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBackgroundImage: string;
  story: string[];
  storyImage: string;
  values: Value[];
  team: TeamMember[];
  createdAt?: string;
  updatedAt?: string;
}

// Available icons as per your backend enum
const AVAILABLE_ICONS = [
  'Zap', 'Award', 'Target', 'Users', 'Shield', 'Globe', 'Heart', 'Star'
];

const AboutAdmin = () => {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<{
    heroBackgroundImage?: File;
    storyImage?: File;
    teamImages?: FileList;
  }>({});
  const [activeTab, setActiveTab] = useState<'hero' | 'story' | 'values' | 'team'>('hero');

  const fetchAbout = async () => {
    try {
      const { data } = await axios.get<AboutData>('https://anantam-backend-7ezq.onrender.com/api/about');
      setAbout(data);
    } catch (err) {
      console.error('Error fetching about data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!about) return;
    setAbout(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleStoryChange = (index: number, value: string) => {
    if (!about) return;
    const updated = [...about.story];
    updated[index] = value;
    setAbout({ ...about, story: updated });
  };

  const addStoryParagraph = () => {
    if (!about) return;
    setAbout({ ...about, story: [...about.story, ''] });
  };

  const removeStoryParagraph = (index: number) => {
    if (!about || about.story.length <= 1) return;
    const updated = about.story.filter((_, i) => i !== index);
    setAbout({ ...about, story: updated });
  };

  const handleValueChange = (index: number, field: keyof Value, value: string) => {
    if (!about) return;
    const updated = [...about.values];
    updated[index] = { ...updated[index], [field]: value };
    setAbout({ ...about, values: updated });
  };

  const addValue = () => {
    if (!about) return;
    setAbout({
      ...about,
      values: [...about.values, { title: '', description: '', icon: 'Zap' }]
    });
  };

  const removeValue = (index: number) => {
    if (!about) return;
    const updated = about.values.filter((_, i) => i !== index);
    setAbout({ ...about, values: updated });
  };

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    if (!about) return;
    const updated = [...about.team];
    updated[index] = { ...updated[index], [field]: value };
    setAbout({ ...about, team: updated });
  };

  const addTeamMember = () => {
    if (!about) return;
    setAbout({
      ...about,
      team: [...about.team, { name: '', role: '', description: '', imageUrl: '' }]
    });
  };

  const removeTeamMember = (index: number) => {
    if (!about) return;
    const updated = about.team.filter((_, i) => i !== index);
    setAbout({ ...about, team: updated });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;

    if (name === 'teamImages') {
      setSelectedFiles(prev => ({
        ...prev,
        teamImages: files
      }));
    } else {
      setSelectedFiles(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!about) return;

    setSaving(true);
    try {
      const formData = new FormData();
      
      // Append basic fields
      formData.append('heroTitle', about.heroTitle);
      formData.append('heroSubtitle', about.heroSubtitle);
      formData.append('story', JSON.stringify(about.story));
      formData.append('values', JSON.stringify(about.values));
      formData.append('team', JSON.stringify(about.team));

      // Append file uploads
      if (selectedFiles.heroBackgroundImage) {
        formData.append('heroBackgroundImage', selectedFiles.heroBackgroundImage);
      }
      
      if (selectedFiles.storyImage) {
        formData.append('storyImage', selectedFiles.storyImage);
      }
      
      if (selectedFiles.teamImages) {
        for (let i = 0; i < selectedFiles.teamImages.length; i++) {
          formData.append('teamImages', selectedFiles.teamImages[i]);
        }
      }

      const { data } = await axios.post('https://anantam-backend-7ezq.onrender.com/api/about', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAbout(data.about);
      setSelectedFiles({});
      alert('About page updated successfully!');
    } catch (err: any) {
      console.error('Error saving about data:', err);
      alert(`Error updating About page: ${err.response?.data?.error || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSectionSave = async (section: string) => {
    if (!about) return;

    setSaving(true);
    try {
      const formData = new FormData();
      
      switch (section) {
        case 'hero':
          formData.append('heroTitle', about.heroTitle);
          formData.append('heroSubtitle', about.heroSubtitle);
          if (selectedFiles.heroBackgroundImage) {
            formData.append('heroBackgroundImage', selectedFiles.heroBackgroundImage);
          }
          break;
        case 'story':
          formData.append('story', JSON.stringify(about.story));
          if (selectedFiles.storyImage) {
            formData.append('storyImage', selectedFiles.storyImage);
          }
          break;
        case 'values':
          formData.append('values', JSON.stringify(about.values));
          break;
        case 'team':
          formData.append('team', JSON.stringify(about.team));
          if (selectedFiles.teamImages) {
            for (let i = 0; i < selectedFiles.teamImages.length; i++) {
              formData.append('teamImages', selectedFiles.teamImages[i]);
            }
          }
          break;
      }

      const { data } = await axios.put(`https://anantam-backend-7ezq.onrender.com/api/about/${section}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAbout(data.about);
      setSelectedFiles({});
      alert(`${section.charAt(0).toUpperCase() + section.slice(1)} section updated successfully!`);
    } catch (err: any) {
      console.error(`Error updating ${section} section:`, err);
      alert(`Error updating ${section} section: ${err.response?.data?.error || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">No about data found.</p>
          <button 
            onClick={fetchAbout}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Edit About Us Page</h1>
          <div className="text-sm text-gray-400">
            Last updated: {about.updatedAt ? new Date(about.updatedAt).toLocaleDateString() : 'Never'}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b border-gray-700 mb-6">
          {(['hero', 'story', 'values', 'team'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab === 'hero' ? 'Hero Section' : 
               tab === 'story' ? 'Our Story' :
               tab === 'values' ? 'Our Values' : 'Our Team'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Hero Section */}
          {activeTab === 'hero' && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Hero Section</h2>
                <button
                  type="button"
                  onClick={() => handleSectionSave('hero')}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Hero Section'}
                </button>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Hero Title</label>
                <input
                  type="text"
                  name="heroTitle"
                  value={about.heroTitle}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Hero Subtitle</label>
                <input
                  type="text"
                  name="heroSubtitle"
                  value={about.heroSubtitle}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Hero Background Image</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    name="heroBackgroundImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  {about.heroBackgroundImage && (
                    <div className="text-sm text-gray-400">
                      Current: {about.heroBackgroundImage.includes('http') ? 'External URL' : 'Uploaded file'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Story Section */}
          {activeTab === 'story' && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Our Story</h2>
                <button
                  type="button"
                  onClick={() => handleSectionSave('story')}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Story Section'}
                </button>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Story Image</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    name="storyImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  {about.storyImage && (
                    <div className="text-sm text-gray-400">
                      Current: {about.storyImage.includes('http') ? 'External URL' : 'Uploaded file'}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium text-gray-300">Story Paragraphs</label>
                  <button
                    type="button"
                    onClick={addStoryParagraph}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Add Paragraph
                  </button>
                </div>
                
                {about.story.map((paragraph, index) => (
                  <div key={index} className="mb-4 p-4 bg-gray-700 border border-gray-600 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-300">Paragraph {index + 1}</span>
                      {about.story.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStoryParagraph(index)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <textarea
                      value={paragraph}
                      onChange={(e) => handleStoryChange(index, e.target.value)}
                      className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                      rows={4}
                      placeholder={`Enter story paragraph ${index + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Values Section */}
          {activeTab === 'values' && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Our Values</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addValue}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Add Value
                  </button>
               
                </div>
              </div>

              {about.values.map((value, index) => (
                <div key={index} className="p-4 bg-gray-700 border border-gray-600 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-300">Value {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeValue(index)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-300">Title</label>
                      <input
                        type="text"
                        value={value.title}
                        onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                        className="w-full p-2 bg-gray-600 border border-gray-500 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-300">Icon</label>
                      <select
                        value={value.icon}
                        onChange={(e) => handleValueChange(index, 'icon', e.target.value)}
                        className="w-full p-2 bg-gray-600 border border-gray-500 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                        required
                      >
                        {AVAILABLE_ICONS.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="md:col-span-1">
                      <label className="block mb-1 text-sm font-medium text-gray-300">Description</label>
                      <textarea
                        value={value.description}
                        onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                        className="w-full p-2 bg-gray-600 border border-gray-500 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              {about.values.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>No values added yet. Click "Add Value" to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Team Section */}
          {activeTab === 'team' && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Our Team</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Add Team Member
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSectionSave('team')}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Team'}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-300">Team Images (Optional)</label>
                <input
                  type="file"
                  name="teamImages"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Upload images in the same order as team members. Leave empty to keep current images.
                </p>
              </div>

              {about.team.map((member, index) => (
                <div key={index} className="p-4 bg-gray-700 border border-gray-600 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-300">Team Member {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-300">Name</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                        className="w-full p-2 bg-gray-600 border border-gray-500 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-300">Role</label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                        className="w-full p-2 bg-gray-600 border border-gray-500 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-300">Description</label>
                      <textarea
                        value={member.description}
                        onChange={(e) => handleTeamMemberChange(index, 'description', e.target.value)}
                        className="w-full p-2 bg-gray-600 border border-gray-500 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-300">Image URL (Optional)</label>
                      <input
                        type="url"
                        value={member.imageUrl}
                        onChange={(e) => handleTeamMemberChange(index, 'imageUrl', e.target.value)}
                        className="w-full p-2 bg-gray-600 border border-gray-500 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                        placeholder="https://example.com/image.jpg or leave empty to use uploaded file"
                      />
                      {member.imageUrl && (
                        <div className="mt-2">
                          <img 
                            src={member.imageUrl} 
                            alt={member.name}
                            className="w-20 h-20 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {about.team.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>No team members added yet. Click "Add Team Member" to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Save All Button */}
          <div className="flex justify-center space-x-4 pt-6 border-t border-gray-700">
            <button
              type="submit"
              disabled={saving}
              className={`px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 transition-colors ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? 'Saving All Sections...' : 'Save All Changes'}
            </button>
            
            <button
              type="button"
              onClick={fetchAbout}
              className="px-8 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Reset Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AboutAdmin;