"use client"
import React, { useState, useRef } from 'react';

interface AdvanceInfoProps {
  data: {
    thumbnail: File | null;
    trailerVideo: File | null;
    description: string;
    keyInformation: string[];
  };
  onChange: (data: any) => void;
  onSave: () => void;
  onSaveAndPreview: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const AdvanceInformation: React.FC<AdvanceInfoProps> = ({
  data,
  onChange,
  onSave,
  onSaveAndPreview,
  onNext,
  onPrevious
}) => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleUploadThumbnail = () => {
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.click();
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      onChange({ thumbnail: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadVideo = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      onChange({ trailerVideo: file });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ description: e.target.value });
  };

  const handleKeyInfoChange = (index: number, value: string) => {
    const updatedKeyInfo = [...data.keyInformation];
    updatedKeyInfo[index] = value;
    onChange({ keyInformation: updatedKeyInfo });
  };

  const handleAddKeyInfo = () => {
    onChange({ keyInformation: [...data.keyInformation, ''] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Advance Informations</h2>
        <div className="space-x-4">
          <button
            onClick={onSave}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
          >
            Save
          </button>
          <button
            onClick={onSaveAndPreview}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
          >
            Save & Preview
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Thumbnail Upload */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-2">Research Thumbnail</h3>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 h-48"
              onClick={handleUploadThumbnail}
            >
              {thumbnailPreview ? (
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="max-h-full object-contain"
                />
              ) : (
                <>
                  <div className="text-gray-400 mb-2">
                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-8m-4-26v22m0-22v-4a4 4 0 014-4h4m0 0h8a4 4 0 014 4v4m0 0h-8"/>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500">Upload your research Thumbnail here</p>
                </>
              )}
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
                onChange={handleThumbnailChange}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Important guidelines: 1200×800 pixels or 12:8 Ratio. Supported format: .jpg, .jpeg, or .png
            </p>
            <button
              type="button"
              onClick={handleUploadThumbnail}
              className="mt-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm"
            >
              Upload Image
            </button>
          </div>

          {/* Video Upload */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-2">Research Trailer</h3>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 h-48"
              onClick={handleUploadVideo}
            >
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 text-center">
                A video with information on the research explaining it, its goals and the team, can help you gain more funding and collaborators.
              </p>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoChange}
              />
            </div>
            <button
              type="button"
              onClick={handleUploadVideo}
              className="mt-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm"
            >
              Upload Video
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-base font-medium text-gray-700 mb-2">Description</h3>
          <textarea
            value={data.description}
            onChange={handleDescriptionChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 h-40"
            placeholder="Enter you description"
          />
          <div className="flex mt-2 space-x-4">
            <button type="button" className="text-gray-700">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
            <button type="button" className="text-gray-700">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Key Information */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium text-gray-700">Key Information</h3>
            <button 
              type="button" 
              onClick={handleAddKeyInfo}
              className="text-sm text-red-800 hover:text-red-900 flex items-center"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add new
            </button>
          </div>

          <div className="space-y-4">
            {data.keyInformation.map((info, index) => (
              <div key={index} className="relative">
                <div className="absolute left-3 top-3 text-gray-500">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <textarea
                  value={info}
                  onChange={(e) => handleKeyInfoChange(index, e.target.value)}
                  className="w-full pl-12 pr-16 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Key points about this research"
                  maxLength={50}
                  rows={1}
                />
                <span className="absolute right-3 top-3 text-xs text-gray-500">
                  {info.length}/50
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={onPrevious}
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-red-800 text-white rounded-md hover:bg-red-900"
          >
            Save & Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvanceInformation;