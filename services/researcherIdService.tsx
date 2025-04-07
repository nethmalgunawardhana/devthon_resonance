export interface Researcher {
    firstName: string;
    lastName: string;
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