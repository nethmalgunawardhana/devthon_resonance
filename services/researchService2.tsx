export interface ResearchProject {
  id: number;
  title: string;
  description: string;
  category: string;
  createdAt:  {_seconds: number, nanoseconds: number};
  fundingGoal: number;
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
    const response = await fetch(`http://localhost:5000/api/research/projects/category/${searchQuery}`); 

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
    const res = await fetch(`http://localhost:5000/api/research/projects/${id}`);
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
    const response = await fetch(`http://localhost:5000/api/research/projects/trending`); 
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

