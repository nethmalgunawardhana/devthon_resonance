import axios from 'axios';
import { ResearchFormData } from '../src/components/research/ResearchCreate';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const researchService = {
  async createResearch(data: ResearchFormData): Promise<any> {
    const formData = new FormData();
    
    // Add basic info
    formData.append('title', data.basicInfo.title);
    formData.append('category', data.basicInfo.category);
    formData.append('language', data.basicInfo.language);
    formData.append('fundingGoal', data.basicInfo.fundingGoal.toString());
    
    // Add advance info
    if (data.advanceInfo.thumbnail) {
      formData.append('thumbnail', data.advanceInfo.thumbnail);
    }
    
    if (data.advanceInfo.trailerVideo) {
      formData.append('trailerVideo', data.advanceInfo.trailerVideo);
    }
    
    formData.append('description', data.advanceInfo.description);
    data.advanceInfo.keyInformation.forEach((item, index) => {
      if (item) formData.append(`keyInformation[${index}]`, item);
    });
    
    // Add collaborative info
    formData.append('allowCollaboratorRequests', data.collaborativeInfo.allowCollaboratorRequests.toString());
    formData.append('allowUnlistedSkills', data.collaborativeInfo.allowUnlistedSkills.toString());
    
    data.collaborativeInfo.requestedSkills.forEach((skill, index) => {
      if (skill) formData.append(`requestedSkills[${index}]`, skill);
    });
    
    data.collaborativeInfo.team.forEach((member, index) => {
      formData.append(`team[${index}]`, member);
    });
    
    const response = await axios.post(`${API_BASE_URL}/research`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data;
  },
  
  async saveResearchDraft(data: ResearchFormData): Promise<any> {
    const formData = new FormData();
    
    // Similar to createResearch but with isDraft flag
    formData.append('isDraft', 'true');
    
    // Add basic info
    formData.append('title', data.basicInfo.title);
    formData.append('category', data.basicInfo.category);
    formData.append('language', data.basicInfo.language);
    formData.append('fundingGoal', data.basicInfo.fundingGoal.toString());
    
    // Add advance info
    if (data.advanceInfo.thumbnail) {
      formData.append('thumbnail', data.advanceInfo.thumbnail);
    }
    
    if (data.advanceInfo.trailerVideo) {
      formData.append('trailerVideo', data.advanceInfo.trailerVideo);
    }
    
    formData.append('description', data.advanceInfo.description);
    data.advanceInfo.keyInformation.forEach((item, index) => {
      if (item) formData.append(`keyInformation[${index}]`, item);
    });
    
    // Add collaborative info
    formData.append('allowCollaboratorRequests', data.collaborativeInfo.allowCollaboratorRequests.toString());
    formData.append('allowUnlistedSkills', data.collaborativeInfo.allowUnlistedSkills.toString());
    
    data.collaborativeInfo.requestedSkills.forEach((skill, index) => {
      if (skill) formData.append(`requestedSkills[${index}]`, skill);
    });
    
    data.collaborativeInfo.team.forEach((member, index) => {
      formData.append(`team[${index}]`, member);
    });
    
    const response = await axios.post(`${API_BASE_URL}/research/draft`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data;
  },
  
  async getCategories(): Promise<string[]> {
    const response = await axios.get(`${API_BASE_URL}/research/categories`);
    return response.data;
  },
  
  async getLanguages(): Promise<string[]> {
    const response = await axios.get(`${API_BASE_URL}/research/languages`);
    return response.data;
  }
};