"use client";
import React, { useEffect, useState } from 'react';
import { researchService } from '../../../services/researchService';

interface BasicInfoProps {
  data: {
    title: string;
    category: string;
    language: string;
    fundingGoal: number;
  };
  onChange: (data: any) => void;
  onSave: () => void;
  onSaveAndPreview: () => void;
  onNext: () => void;
}

const BasicInformation: React.FC<BasicInfoProps> = ({ 
  data, 
  onChange, 
  onSave, 
  onSaveAndPreview, 
  onNext 
}) => {
  const [categories, setCategories] = useState<string[]>([
    "Data Analysis",
    "Research Methods",
    "Theory",
    "Publications",
    "Career Advice"
  ]);
  
  const [languages, setLanguages] = useState<string[]>([
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Arabic",
    "Russian",
    "Portuguese",
    "Hindi"
  ]);
  
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // If you still want to fetch additional categories or languages from the service
        const [categoriesData, languagesData] = await Promise.all([
          researchService.getCategories(),
          researchService.getLanguages()
        ]);
        
        // Combine hardcoded categories with fetched categories (removing duplicates)
        setCategories(prevCategories => {
          const allCategories = [...prevCategories, ...categoriesData];
          return [...new Set(allCategories)];
        });
        
        // Combine hardcoded languages with fetched languages (removing duplicates)
        setLanguages(prevLanguages => {
          const allLanguages = [...prevLanguages, ...languagesData];
          return [...new Set(allLanguages)];
        });
      } catch (error) {
        console.error('Error fetching options:', error);
        // Even if fetch fails, we still have the hardcoded values
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    // Validate form - fixed condition for fundingGoal to be greater than 0
    const isFormValid = 
      data.title.trim().length > 0 && 
      data.category.trim().length > 0 && 
      data.language.trim().length > 0 && 
      data.fundingGoal > 0;
      
    setIsValid(isFormValid);
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'fundingGoal') {
      // Convert to number for the fundingGoal field
      const numericValue = value === '' ? 0 : parseFloat(value);
      onChange({ [name]: numericValue });
    } else {
      onChange({ [name]: value });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Basic Information</h2>
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

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Research Title
          </label>
          <div className="relative">
            <input
              type="text"
              id="title"
              name="title"
              value={data.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your research title"
              maxLength={80}
            />
            <span className="absolute right-3 top-2 text-xs text-gray-500">
              {data.title.length}/80
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Research Category
            </label>
            <select
              id="category"
              name="category"
              value={data.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>
                Select...
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fundingGoal" className="block text-sm font-medium text-gray-700 mb-1">
              Funding Goal
            </label>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500">
              <input
                type="number"
                id="fundingGoal"
                name="fundingGoal"
                value={data.fundingGoal || ''}
                onChange={handleInputChange}
                min="0"
                step="any"
                className="flex-1 px-4 py-2 border-none focus:outline-none focus:ring-0"
                placeholder="Your research funding goal"
                style={{ appearance: "textfield" }}
              />
              <div className="px-3 py-2 bg-gray-50 text-gray-500 font-medium">
                USD
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Research Language
          </label>
          <select
            id="language"
            name="language"
            value={data.language}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>
              Select...
            </option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onNext}
            disabled={!isValid}
            className={`px-6 py-3 rounded-md ${
              isValid 
                ? 'bg-red-800 text-white hover:bg-red-900' 
                : 'bg-red-300 text-white cursor-not-allowed'
            }`}
          >
            Save & Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;