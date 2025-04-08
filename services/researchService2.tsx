export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt:  {_seconds: number, nanoseconds: number};
  fundingGoal: number;
  isEthereumFundingEnabled : boolean;
  ethereumAddress : string;
  onChainProjectId : string;
  onChainTransactionHash : string;
  team: string[];
  createdBy: string;
  allowCollaboratorRequests: boolean;
  thumbnailUrl: string;
  trailerVideoUrl: string;
  views: number; 
  keyInformation: string[];
  requestedSkills: string[];
}

export const fetchResearchProjects = async (searchQuery: string): Promise<ResearchProject[]> => {
  try {
    const response = await fetch(`https://resonance-backend.vercel.app/api/research/projects/category/${searchQuery}`); 

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error fetching research projects:', error);
    return [];
  }
}


export const fetchResearchProjectById = async (id: string): Promise<ResearchProject> => {
  try {
    const res = await fetch(`https://resonance-backend.vercel.app/api/research/projects/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch project with id: ${id}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const fetchTrendingResearchProjects = async (): Promise<ResearchProject[]> => {
  try {
    const response = await fetch(`https://resonance-backend.vercel.app/api/research/projects/trending`); 
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error fetching research projects:', error);
    return [];
  }
}

export const fetchResearchProjectForResearcher = async (id: string): Promise<ResearchProject[]> => {
  try {
    const response = await fetch(`https://resonance-backend.vercel.app/api/local-papers/${id}`); 
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error fetching research projects:', error);
    return [];
  }
}