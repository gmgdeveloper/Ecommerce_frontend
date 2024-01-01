import { IBrand } from "~/interfaces/brand";

export async function fetchBrands(): Promise<IBrand[]> {
    try {
        const response = await fetch('https://azantest.gmgsolution.com/api/brands');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data as IBrand[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}