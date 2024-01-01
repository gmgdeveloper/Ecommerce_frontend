/* eslint-disable import/prefer-default-export */

// application
import { brands } from '~/fake-server/database/brands';
import { shopCategoriesList } from '~/fake-server/database/categories';
import { prepareCategory } from '~/fake-server/endpoints/categories';
import { IProductAttributesDef, IProductDef } from '~/fake-server/interfaces/product-def';
import { makeIdGenerator, nameToSlug } from '~/fake-server/utils';
import { IBrand } from '~/interfaces/brand';
import { IShopCategory } from '~/interfaces/category';
import { IProduct, IProductAttribute } from '~/interfaces/product';

const getNextId = makeIdGenerator();


function resolveProductAttributesDef(attributesDef: IProductAttributesDef): IProductAttribute[] {
    const attributes: IProductAttribute[] = [];
    const keys = Object.keys(attributesDef);

    for (let i = 0; i < keys.length; i += 1) {
        const attributeName = keys[i];
        const attribute: IProductAttribute = {
            name: attributeName,
            slug: nameToSlug(attributeName),
            featured: false,
            values: [],
        };

        const valuesDef = attributesDef[attributeName];
        let valueNames: string[] = [];

        if (typeof valuesDef === 'string') {
            valueNames = [valuesDef];
        } else {
            if (valuesDef[0] === true) {
                attribute.featured = true;
                valuesDef.splice(0, 1);
            }

            valueNames = valuesDef as string[];
        }

        valueNames.forEach((valueName) => {
            attribute.values.push({
                name: valueName,
                slug: nameToSlug(valueName),
            });
        });

        if (attribute.values.length > 0) {
            attributes.push(attribute);
        }
    }

    return attributes;
}

function makeProducts(defs: IProductDef[]): IProduct[] {
    return defs.map((def) => {
        let badges: string[] = [];

        if (def.badges) {
            if (typeof def.badges === 'string') {
                badges = [def.badges];
            } else {
                badges = def.badges.slice(0);
            }
        }

        let brand: IBrand = {
            slug: 'brandix',
            name: 'Brandix',
            image: '',
            country: 'JP',
        };

        if (def.brand) {
            brand = brands.find((x) => x.slug === def.brand) || brand;
        }

        const categorySlugs: string[] = def.categories || ['tools-garage'];
        const categories = categorySlugs
            .map((categorySlug) => shopCategoriesList.find((x) => x.slug === categorySlug))
            .map((x) => (x ? prepareCategory(x) : null))
            .filter((x) => x !== null) as IShopCategory[];

        const attributesDef: IProductAttributesDef = {
            Speed: [true, '750 RPM'],
            'Power Source': [true, 'Cordless-Electric'],
            'Battery Cell Type': [true, 'Lithium'],
            Voltage: [true, '20 Volts'],
            'Battery Capacity': [true, '2 Ah'],
            Material: ['Aluminium', 'Plastic'],
            'Engine Type': 'Brushless',
            Length: '99 mm',
            Width: '207 mm',
            Height: '208 mm',
        };

        return {
            id: getNextId(),
            name: def.name,
            excerpt: `
                Many philosophical debates that began in ancient times are still debated today. In one general sense,
                philosophy is associated with wisdom, intellectual culture and a search for knowledge.
            `,
            description: `
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas fermentum, diam non iaculis finibus,
                    ipsum arcu sollicitudin dolor, ut cursus sapien sem sed purus. Donec vitae fringilla tortor, sed
                    fermentum nunc. Suspendisse sodales turpis dolor, at rutrum dolor tristique id. Quisque pellentesque
                    ullamcorper felis, eget gravida mi elementum a. Maecenas consectetur volutpat ante, sit amet molestie
                    urna luctus in. Nulla eget dolor semper urna malesuada dictum. Duis eleifend pellentesque dui et
                    finibus. Pellentesque dapibus dignissim augue. Etiam odio est, sodales ac aliquam id, iaculis eget
                    lacus. Aenean porta, ante vitae suscipit pulvinar, purus dui interdum tellus, sed dapibus mi mauris
                    vitae tellus.
                </p>
                <h4>Etiam lacus lacus mollis in mattis</h4>
                <p>
                    Praesent mattis eget augue ac elementum. Maecenas vel ante ut enim mollis accumsan. Vestibulum vel
                    eros at mi suscipit feugiat. Sed tortor purus, vulputate et eros a, rhoncus laoreet orci. Proin sapien
                    neque, commodo at porta in, vehicula eu elit. Vestibulum ante ipsum primis in faucibus orci luctus et
                    ultrices posuere cubilia Curae; Curabitur porta vulputate augue, at sollicitudin nisl molestie eget.
                </p>
                <p>
                    Nunc sollicitudin, nunc id accumsan semper, libero nunc aliquet nulla, nec pretium ipsum risus ac
                    neque. Morbi eu facilisis purus. Quisque mi tortor, cursus in nulla ut, laoreet commodo quam.
                    Pellentesque et ornare sapien. In ac est tempus urna tincidunt finibus. Integer erat ipsum, tristique
                    ac lobortis sit amet, dapibus sit amet purus. Nam sed lorem nisi. Vestibulum ultrices tincidunt turpis,
                    sit amet fringilla odio scelerisque non.
                </p>
            `,
            slug: def.slug,
            sku: def.sku,
            partNumber: 'BDX-750Z370-S',
            stock: 'in-stock',
            price: def.price,
            compareAtPrice: def.compareAtPrice || null,
            images: def.images.slice(0),
            badges,
            rating: def.rating,
            reviews: def.reviews,
            availability: def.availability,
            compatibility: def.compatibility || 'all',
            brand,
            type: {
                slug: 'default',
                name: 'Default',
                attributeGroups: [
                    {
                        name: 'General',
                        slug: 'general',
                        attributes: [
                            'speed',
                            'power-source',
                            'battery-cell-type',
                            'voltage',
                            'battery-capacity',
                            'material',
                            'engine-type',
                        ],
                    },
                    {
                        name: 'Dimensions',
                        slug: 'dimensions',
                        attributes: [
                            'length',
                            'width',
                            'height',
                        ],
                    },
                ],
            },
            attributes: resolveProductAttributesDef(
                {
                    ...attributesDef,
                    ...def.attributes,
                },
            ),
            options: [
                {
                    type: 'default',
                    slug: 'material',
                    name: 'Material',
                    values: [
                        { slug: 'steel', name: 'Steel' },
                        { slug: 'aluminium', name: 'Aluminium' },
                        { slug: 'thorium', name: 'Thorium' },
                    ],
                },
                {
                    type: 'color',
                    slug: 'color',
                    name: 'Color',
                    values: [
                        { slug: 'white', name: 'White', color: '#fff' },
                        { slug: 'yellow', name: 'Yellow', color: '#ffd333' },
                        { slug: 'red', name: 'Red', color: '#ff4040' },
                        { slug: 'blue', name: 'Blue', color: '#4080ff' },
                    ],
                },
            ],
            tags: ['Brake Kit', 'Brandix', 'Filter', 'Bumper', 'Transmission', 'Hood'],
            categories,
            customFields: {},
        };
    });
}

async function fetchProductsFromAPI() {
    try {
        const response = await fetch('https://azantest.gmgsolution.com/api/Allproducts');
        const data = await response.json();
        console.log("data",data)
    localStorage.setItem("all_products_data", JSON.stringify(data))
    return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}
let products: IProduct[] = []; 

export async function transformAPIResponse() {
    const apiProducts = await fetchProductsFromAPI();

    const transformedProducts: IProductDef[] = apiProducts.all_products.map((apiProduct: any) => {
        return {
            name: apiProduct.name || 'Default Name',
            slug: apiProduct.slug || 'default-slug',
            sku: apiProduct.sku || 'default-sku',
            price: parseFloat(apiProduct.price) || 0,
            images: apiProduct.images || [],
            badges: apiProduct.badges || [],
            rating: apiProduct.rating || 0,
            reviews: parseInt(apiProduct.reviews) || 0,
            availability: apiProduct.availability || 'availability',
            compatibility: apiProduct.compatibility || [],
            attributes: apiProduct.attributes || {},
        };
    });

    products = makeProducts(transformedProducts);


    return products;
}
transformAPIResponse().then((transformedProducts) => {
    products = transformedProducts
});

export { fetchProductsFromAPI, makeProducts, products };
// const productsDef: IProductDef[] = [
//     {
//         name: 'Brandix Spark Plug Kit ASR-400',
//         slug: 'brandix-spark-plug-kit-asr-400',
//         sku: '140-10440-B',
//         price: 19,
//         images: [
//             '/images/products/product-1-1.jpg',
//             '/images/products/product-1-2.jpg',
//         ],
//         badges: ['sale', 'new', 'hot'],
//         rating: 4,
//         reviews: 3,
//         availability: 'in-stock',
//         compatibility: [1, 2],
//         attributes: {
//             Color: 'White',
//         },
//     },
   
// ];

// export const products: IProduct[] = makeProducts(productsDef);
