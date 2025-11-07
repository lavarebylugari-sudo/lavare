import React, { useState, useCallback } from 'react';
import { getGroomingRecommendations, transformPetImage, getRecommendationsFromProfile } from '../services/geminiService';

const AIVision: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recommend' | 'transform' | 'profile'>('recommend');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [petProfile, setPetProfile] = useState({ breed: '', age: '', coatType: '' });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Reset outputs when new image is selected
      setRecommendations(null);
      setTransformedImage(null);
      setError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        // Reset outputs when new image is selected
        setRecommendations(null);
        setTransformedImage(null);
        setError(null);
      } else {
        setError('Please upload an image file (PNG, JPG, GIF)');
      }
    }
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
  }

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    setTransformedImage(null);

    try {
        if (activeTab === 'profile') {
            if (!petProfile.breed || !petProfile.age || !petProfile.coatType) {
              setError('Please fill out all profile fields to get a recommendation.');
              setIsLoading(false);
              return;
            }
            const result = await getRecommendationsFromProfile(petProfile.breed, petProfile.age, petProfile.coatType);
            setRecommendations(result);
        } else {
            if (!imageFile) {
                setError('Please upload a photo of your pet.');
                setIsLoading(false);
                return;
            }
            const base64Image = await fileToBase64(imageFile);
            if (activeTab === 'recommend') {
                const result = await getGroomingRecommendations(base64Image);
                setRecommendations(result);
            } else { // 'transform'
                if (!prompt) {
                setError('Please describe the style you want to visualize.');
                setIsLoading(false);
                return;
                }
                const result = await transformPetImage(base64Image, prompt);
                setTransformedImage(`data:image/png;base64,${result}`);
            }
        }
    } catch (err) {
      console.error(err);
      setError('An error occurred while communicating with the AI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, imageFile, prompt, petProfile]);

  const handleTabChange = (tab: 'recommend' | 'transform' | 'profile') => {
    setActiveTab(tab);
    setError(null);
    setRecommendations(null);
    setTransformedImage(null);
  };

  const isGenerateDisabled = () => {
    if (isLoading) return true;
    if (activeTab === 'profile') {
        return !petProfile.breed || !petProfile.age || !petProfile.coatType;
    }
    return !imageFile;
  };

  const getButtonText = () => {
    if (isLoading) return 'Generating...';
    switch (activeTab) {
        case 'recommend': return 'Get Recommendations';
        case 'transform': return 'Visualize Style';
        case 'profile': return 'Analyze Profile';
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div><p className="mt-4">Our AI is thinking...</p></div>;
    }
    if (error) {
        return <div className="text-center p-10 bg-red-100 text-red-700 rounded-lg">{error}</div>;
    }
    if ((activeTab === 'recommend' || activeTab === 'profile') && recommendations) {
      return <div className="prose max-w-none p-6 bg-amber-50 rounded-lg whitespace-pre-wrap">{recommendations}</div>;
    }
    if (activeTab === 'transform' && transformedImage) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="text-center">
                <h4 className="font-display text-xl mb-2">Before</h4>
                <img src={imagePreview!} alt="Original pet" className="rounded-lg shadow-md mx-auto max-h-96" />
            </div>
            <div className="text-center">
                <h4 className="font-display text-xl mb-2">AI Vision</h4>
                <img src={transformedImage} alt="Transformed pet" className="rounded-lg shadow-md mx-auto max-h-96" />
            </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-display text-5xl">AI Pet Stylist</h2>
        <p className="mt-2 text-lg text-gray-600">Discover the perfect look for your beloved companion.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-center border-b mb-6">
          <button onClick={() => handleTabChange('recommend')} className={`px-6 py-3 font-medium text-lg ${activeTab === 'recommend' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-gray-500'}`}>Recommendations</button>
          <button onClick={() => handleTabChange('transform')} className={`px-6 py-3 font-medium text-lg ${activeTab === 'transform' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-gray-500'}`}>Visualize Style</button>
          <button onClick={() => handleTabChange('profile')} className={`px-6 py-3 font-medium text-lg ${activeTab === 'profile' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-gray-500'}`}>Profile Analysis</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {activeTab === 'profile' ? (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Describe Your Pet</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="breed" className="block text-sm font-medium text-gray-700">Breed</label>
                            <input type="text" id="breed" value={petProfile.breed} onChange={e => setPetProfile({...petProfile, breed: e.target.value})} className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]" placeholder="e.g., Golden Retriever, Siamese Cat" />
                        </div>
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                            <input type="text" id="age" value={petProfile.age} onChange={e => setPetProfile({...petProfile, age: e.target.value})} className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]" placeholder="e.g., 2 years old, Senior" />
                        </div>
                        <div>
                            <label htmlFor="coatType" className="block text-sm font-medium text-gray-700">Coat Type</label>
                             <select id="coatType" value={petProfile.coatType} onChange={e => setPetProfile({...petProfile, coatType: e.target.value})} className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]">
                                <option value="">Select coat type...</option>
                                <option>Short-haired</option>
                                <option>Long-haired</option>
                                <option>Curly-coated</option>
                                <option>Double-coated</option>
                                <option>Wire-haired</option>
                            </select>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">1. Upload a clear photo of your pet</label>
                    <div 
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#D4AF37] transition-colors cursor-pointer"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-upload')?.click()}
                    >
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <span className="font-medium text-[#D4AF37] hover:text-[#b3922e]">Click to upload</span>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                    <input id="file-upload" name="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    {imagePreview && <img src={imagePreview} alt="Pet preview" className="mt-4 rounded-lg shadow-sm max-h-60 mx-auto"/>}
                </div>
            )}

            <div>
                {activeTab === 'transform' && (
                    <div className="mb-4">
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">2. Describe the desired transformation</label>
                        <textarea id="prompt" rows={3} value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]" placeholder="e.g., 'a lion cut with a fluffy tail' or 'add a cute pink bow on its head'"></textarea>
                    </div>
                )}
                <div className={activeTab === 'transform' ? 'mt-0' : 'mt-7'}>
                    <button onClick={handleGenerate} disabled={isGenerateDisabled()} className="w-full bg-[#333333] text-white py-3 px-4 rounded-md hover:bg-[#D4AF37] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
                       {getButtonText()}
                    </button>
                </div>
            </div>
        </div>
        
        <div className="mt-8">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AIVision;