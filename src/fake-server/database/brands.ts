/* eslint-disable import/prefer-default-export */

// application
import { IBrand } from '~/interfaces/brand';
import { ISettings } from '~/interfaces/settings';


export async function fetchBrands(): Promise<IBrand[]> {
    try {
        const response = await fetch('https://azantest.gmgsolution.com/api/brands');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data.brands as IBrand[];

    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
export async function fetchsettingsImages(): Promise<ISettings[]> {
    try {
        const response = await fetch('https://azantest.gmgsolution.com/api/front');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data.images as ISettings[];

    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
// Fetch and export brands data asynchronously
export let brands: IBrand[] = [];
export let FrontImages: ISettings[] = [];

(async () => {
    brands = await fetchBrands();
    FrontImages = await fetchsettingsImages();
})();