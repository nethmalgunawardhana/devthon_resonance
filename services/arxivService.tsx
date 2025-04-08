export interface ResearchItem {
    title: string;
    authors: string;
    summary: string;
    published: string;
    link: string;
    pdfLink: string;
}

export const fetchPublishedResearches = async (query: string): Promise<ResearchItem[]> => {
    const response = await fetch(`https://resonance-backend.vercel.app/api/published-papers?category=${query.replace(' ', '%20')}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data from arXiv API');
    }

    const data = await response.text();
    const jsonData: ResearchItem[] = JSON.parse(data);

    return jsonData.map((item: ResearchItem) => ({
        title: item.title,
        authors: item.authors,
        summary: item.summary,
        published: item.published,
        link: item.link,
        pdfLink: item.pdfLink,
    }));
}