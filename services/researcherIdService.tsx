export interface Researcher {
    uid: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
}

export const getResearcherById = async (id: string): Promise<Researcher> => {
  try {
    const response = await fetch(`http://localhost:5000/api/researchers/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch researcher with id: ${id}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching researcher:', error);
    throw error;
  }
}

export const getAllResearchers = async (): Promise<Researcher[]> => {
  try {
    const response = await fetch(`http://localhost:5000/api/researchers`);
    if (!response.ok) {
      throw new Error('Failed to fetch researchers');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching researchers:', error);
    throw error;
  }
}

