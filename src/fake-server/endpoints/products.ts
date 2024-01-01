// application
import {
    IAddProductReviewData,
    IGetSearchSuggestionsOptions,
    IGetSearchSuggestionsResult,
} from '~/api/base';
import { shopCategoriesList } from '~/fake-server/database/categories';
import { products as dbProducts } from '~/fake-server/database/products';
import { getNextReviewId, reviews } from '~/fake-server/database/reviews';
import { prepareCategory } from '~/fake-server/endpoints/categories';
import { AbstractFilterBuilder } from '~/fake-server/filters/abstract-filter-builder';
import { CategoryFilterBuilder } from '~/fake-server/filters/category-filter-builder';
import { CheckFilterBuilder } from '~/fake-server/filters/check-filter-builder';
import { ColorFilterBuilder } from '~/fake-server/filters/color-filter-builder';
import { RadioFilterBuilder } from '~/fake-server/filters/radio-filter-builder';
import { RangeFilterBuilder } from '~/fake-server/filters/range-filter-builder';
import { RatingFilterBuilder } from '~/fake-server/filters/rating-filter-builder';
import { VehicleFilterBuilder } from '~/fake-server/filters/vehicle-filter-builder';
import {
    clone,
    delayResponse,
    error,
    makeCursorBasedNavigation,
    makePageBasedNavigation,
} from '~/fake-server/utils';
import {
    IFilterValues,
    IListOptions,
    INavigation,
    IReviewsList,
} from '~/interfaces/list';
import { IProduct, IProductsList } from '~/interfaces/product';
import { IReview } from '~/interfaces/review';


function getProducts(shift: number, categorySlug: string | null = null): IProduct[] {
let shiftValue = shift;


    if (categorySlug === "bestsellers") {
        let apiProducts: any= localStorage.getItem("all_products_data")
        if (apiProducts) {
            let mainProducts = JSON.parse(apiProducts).best_seller_products
            return [...mainProducts.slice(shiftValue), ...mainProducts.slice(0, shiftValue)]
        }
    }
    if (categorySlug === "specialoffers") {
    let apiProducts: any= localStorage.getItem("all_products_data")

        if (apiProducts) {
            let mainProducts = JSON.parse(apiProducts).special_products
            return [...mainProducts.slice(shiftValue), ...mainProducts.slice(0, shiftValue)]
        }
    }

    if (categorySlug === "toprated") {
    let apiProducts: any= localStorage.getItem("all_products_data")

        if (apiProducts) {
            let mainProducts = JSON.parse(apiProducts).top_rated_products
            return [...mainProducts.slice(shiftValue), ...mainProducts.slice(0, shiftValue)]
        }
    }
    if (categorySlug === "featured") {
        let apiProducts: any= localStorage.getItem("all_products_data")
        if (apiProducts) {
            let mainProducts = JSON.parse(apiProducts).featured_products
            return [...mainProducts.slice(shiftValue), ...mainProducts.slice(0, shiftValue)]
        }
    }

    switch (categorySlug) {
    case 'tires-wheels':
    case 'power-tools': shiftValue += 5; break;
    case 'interior-parts':
    case 'hand-tools': shiftValue += 10; break;
    case 'engine-drivetrain':
    case 'plumbing': shiftValue += 15; break;
    default:
    }

    return [...dbProducts.slice(shiftValue), ...dbProducts.slice(0, shiftValue)];
}

export function getProductsList(
    options: IListOptions = {},
    filterValues: IFilterValues = {},
): Promise<IProductsList> {
    const filters: AbstractFilterBuilder[] = [
        new CategoryFilterBuilder('category', 'Categories'),
        new VehicleFilterBuilder('vehicle', 'Vehicle'),
        new RangeFilterBuilder('price', 'Price'),
        new CheckFilterBuilder('brand', 'Brand'),
        new RadioFilterBuilder('discount', 'With Discount'),
        new RatingFilterBuilder('rating', 'Rating'),
        new ColorFilterBuilder('color', 'Color'),
    ];

    let products = dbProducts.slice(0);

    filters.forEach((filter) => filter.makeItems(products, filterValues[filter.slug]));

    filters.forEach((filter) => filter.calc(filters));

    products = products.filter((product) => filters.reduce<boolean>((mr, filter) => mr && filter.test(product), true));

    const sort = options?.sort || 'default';

    products = products.sort((a, b) => {
        if (['name_asc', 'name_desc'].includes(sort)) {
            if (a.name === b.name) {
                return 0;
            }

            return (a.name > b.name ? 1 : -1) * (sort === 'name_asc' ? 1 : -1);
        }

        return 0;
    });

    const limit = options?.limit || 16;
    let result: [IProduct[], INavigation];

    if (filterValues.category === 'interior-parts') {
        result = makeCursorBasedNavigation(
            products,
            limit,
            options?.after,
            options?.before,
            (product) => product.id.toString(),
        );
    } else {
        result = makePageBasedNavigation(products, limit, options?.page || 1);
    }

    const [items, navigation] = result;

    return delayResponse(Promise.resolve({
        items,
        sort,
        navigation,
        filters: filters.map((x) => x.build()),
    }), 350);
}

export function getProductBySlug(slug: string): Promise<IProduct> {
    
    const product : any = dbProducts.find((x) => x.id === 2);

    if (!product) {
        return error('Page Not Found');
    }
    return Promise.resolve(clone(product));
}

export function getProductReviews(productId: number, options?: IListOptions): Promise<IReviewsList> {
    let items = reviews.slice(0);

    items.sort((a, b) => {
        if (a.date > b.date) {
            return -1;
        }
        if (a.date < b.date) {
            return 1;
        }

        return 0;
    });

    const limit = options?.limit || 8;
    const sort = options?.sort || 'default';                                                                                                     


    const [chunk, navigation] = makePageBasedNavigation(items, limit, options?.page || 1);

    items = chunk;

    return Promise.resolve({
        items,
        sort,
        navigation,
    });
}

export function addProductReview(productId: number, data: IAddProductReviewData): Promise<IReview> {
    const review: IReview = {
        id: getNextReviewId(),
        date: (new Date()).toISOString().substr(0, 10),
        author: data.author,
        avatar: '/images/avatars/avatar-2.jpg',
        rating: data.rating,
        content: data.content,
    };

    reviews.push(review);

    return delayResponse(Promise.resolve(review));
}

export function getProductAnalogs(productId: number): Promise<IProduct[]> {
    const slugs: string[] = [
        'sunset-brake-kit',
        'specter-brake-kit',
        'brake-kit',
    ];
    const analogs: IProduct[] = dbProducts.filter((x) => slugs.includes(x.slug));

    return Promise.resolve(clone(analogs));
}

export function getRelatedProducts(productId: number, limit: number): Promise<IProduct[]> {
    return Promise.resolve(clone(dbProducts.slice(0, limit)));
}

export function getFeaturedProducts(categorySlug: string | null, limit: number): Promise<IProduct[]> {
    return delayResponse(Promise.resolve(clone(getProducts(0, categorySlug).slice(0, limit))), 1000);
}

export function getPopularProducts(categorySlug: string | null, limit: number): Promise<IProduct[]> {
    return delayResponse(Promise.resolve(clone(getProducts(6, categorySlug).slice(0, limit))), 1000);
}

export function getTopRatedProducts(categorySlug: string | null, limit: number): Promise<IProduct[]> {
    return delayResponse(Promise.resolve(clone(getProducts(12, categorySlug).slice(0, limit))), 1000);
}

export function getSpecialOffers(limit: number): Promise<IProduct[]> {
    return delayResponse(Promise.resolve(clone(getProducts(8, "specialoffers").slice(0, limit))), 1000);
}

export function getLatestProducts(limit: number): Promise<IProduct[]> {
    return Promise.resolve(clone(dbProducts.slice(0, limit)));
}

export function getSearchSuggestions(
    query: string,
    options?: IGetSearchSuggestionsOptions,
): Promise<IGetSearchSuggestionsResult> {
    const queryVal = query.toLowerCase();
    const optionsVal = {
        limitProducts: 4,
        limitCategories: 4,
        ...options,
    };

    const resultProducts = dbProducts.filter((x) => x.name.toLowerCase().includes(queryVal));
    const resultCategories = shopCategoriesList.filter((x) => x.name.toLowerCase().includes(queryVal));

    return Promise.resolve({
        products: resultProducts.slice(0, optionsVal.limitProducts),
        categories: resultCategories.slice(0, optionsVal.limitCategories).map((x) => prepareCategory(x)),
    });
}
