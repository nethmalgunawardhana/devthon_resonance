export interface OpenAlexResearcher{
    name: string;
    affiliation: string;
    works_count: number;
    citation_count: number;
    orchid: string;
    openalex_id: string;
    works_api_url: string;
    summary: {"2yr_mean_citedness": number, "h_index": number, "i10_index": number};
    works: {
        title: string;
        url: string;
        publication_date: string;
        citation_count: number;
        type: string;
        authors: string[];
      }[];
}


export const getOpenAlexResearcher = async (query: string): Promise<OpenAlexResearcher> => {
    try {
        const response = await fetch(`http://localhost:5000/api/alex/researchers?name=${query}`);
        if (!response.ok) {
        throw new Error('Failed to fetch researchers from OpenAlex');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching researchers from OpenAlex:', error);
        throw error;
    }
}