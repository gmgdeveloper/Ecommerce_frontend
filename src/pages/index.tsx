"use client"
// react
import React, { useEffect, useMemo, useState } from 'react';
// third-party
import { useIntl } from 'react-intl';
// application
import { blogApi, shopApi } from '~/api';
import BlockBanners from '~/components/blocks/BlockBanners';
import BlockBrands from '~/components/blocks/BlockBrands';
import BlockFeatures from '~/components/blocks/BlockFeatures';
import BlockFinder from '~/components/blocks/BlockFinder';
import BlockPosts from '~/components/blocks/BlockPosts';
import BlockProductsCarousel from '~/components/blocks/BlockProductsCarousel';
import BlockProductsColumns from '~/components/blocks/BlockProductsColumns';
import BlockSale from '~/components/blocks/BlockSale';
import BlockSpace from '~/components/blocks/BlockSpace';
import BlockZone from '~/components/blocks/BlockZone';
import { fetchsettingsImages } from '~/fake-server/database/brands';
import { fetchProductsFromAPI, makeProducts } from '~/fake-server/database/products';
import { useDeferredData, useProductColumns, useProductTabs } from '~/services/hooks';
import url from '~/services/url';

function Page() {
    const intl = useIntl();
    const [products, setProducts] = useState([]);
    const [featuredProductsState, setFeaturedProducts] = useState([]);
    const [bestSellerProducts, setBestSellerProducts] = useState([]);
    const [topRatedProducts, setTopRatedProducts] = useState([]);
    const [specialOfferPorducts, setSpecialOfferProducts] = useState([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [mobileImage1, setMobileImage1] = useState<any>();
    const [mobileImage2, setMobileImage2] = useState<any>();
    const [mobileImage3, setMobileImage3] = useState<any>();

    useEffect(() => {
      async function fetchData() {
        try {
          const imagesData : any = await fetchsettingsImages();
          setMobileImage1(imagesData.wheel_image)
          setMobileImage2(imagesData.interior_image)
          setMobileImage3(imagesData.engine_image)
          setImagesLoaded(true);
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      }
      fetchData();
    }, []);
    
    const transformProducts = (products: any) => {
        let transformed = products.map((apiProduct: any) => ({
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
        }));   
        return transformed
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiProducts = await fetchProductsFromAPI();
                const transformedProducts = transformProducts(apiProducts.all_products)
                let transformed: any = makeProducts(transformedProducts);
                setProducts(transformed);
                
    
                const transformedFeaturedProducts = transformProducts(apiProducts.featured_products)
                let transformedFeatured: any = makeProducts(transformedFeaturedProducts);
                setFeaturedProducts(transformedFeatured);

                const transformedBestSellerProducts = transformProducts(apiProducts.best_seller_products)
                let transformedBestSeller: any = makeProducts(transformedBestSellerProducts);
                setBestSellerProducts(transformedBestSeller);
                
                const transformedTopRatedProducts = transformProducts(apiProducts.top_rated_products)
                let transformedTopRated: any = makeProducts(transformedTopRatedProducts);
                setTopRatedProducts(transformedTopRated);

                const transformedSpecialOfferProducts = transformProducts(apiProducts.special_products)
                let transformedSpecialOffer: any = makeProducts(transformedSpecialOfferProducts);
                setSpecialOfferProducts(transformedSpecialOffer);
            } catch (error) {
                // Handle fetch error here
                console.error('Error fetching products:', error);
            }
        };
    
        fetchProducts();
    }, []);
    console.log('productsproductsproducts',products)

    
    /**
     * Featured products.
     */
    const featuredProducts = useProductTabs(
        useMemo(() => [
            { id: 1, name: 'All', categorySlug: null },
            { id: 2, name: 'Power Tools', categorySlug: 'power-tools' },
            { id: 3, name: 'Hand Tools', categorySlug: 'hand-tools' },
            { id: 4, name: 'Plumbing', categorySlug: 'plumbing' },
        ], []),
        (tab) => shopApi.getFeaturedProducts(tab.categorySlug, 8),
    );

    const blockSale = useDeferredData(() => shopApi.getSpecialOffers(8), []);

    useEffect(()=>{
    }, [blockSale.data])
    const blockZones = useMemo(() => [
        {
            image: mobileImage1,
            mobileImage: mobileImage1,
            categorySlug: 'tires-wheels',
        },
        {
            image: mobileImage2,
            mobileImage: mobileImage2,
            categorySlug: 'interior-parts',
        },
        {
            image: mobileImage3,
            mobileImage: mobileImage3,
            categorySlug: 'engine-drivetrain',
        },
    ], []);

    const newArrivals = useDeferredData(() => shopApi.getLatestProducts(12), []);
    const newArrivalsLinks = useMemo(() => [
        { title: 'Wheel Covers', url: url.products() },
        { title: 'Timing Belts', url: url.products() },
        { title: 'Oil Pans', url: url.products() },
        { title: 'Show All', url: url.products() },
    ], []);

    const latestPosts = useDeferredData(() => blogApi.getLatestPosts(8), []);
    const latestPostsLinks = useMemo(() => [
        { title: 'Special Offers', url: url.blog() },
        { title: 'New Arrivals', url: url.blog() },
        { title: 'Reviews', url: url.blog() },
    ], []);

    const brands = useDeferredData(() => shopApi.getBrands({ limit: 16 }), []);

    /**
     * Product columns.
     */
    const columns = useProductColumns(
        useMemo(() => [
            {
                title: 'Top Rated Products',
                source: () => shopApi.getTopRatedProducts(null, 3),
            },
            {
                title: 'Special Offers',
                source: () => shopApi.getSpecialOffers(3),
            },
            {
                title: 'Bestsellers',
             source: () => shopApi.getPopularProducts("bestsellers", 3),
            },
        ], []),
    );

//     bestSellerProducts
// topRatedProducts
// specialOfferPorducts
//         console.log(products, '/see here coming')
//         console.log(featuredProducts, '/see here coming')

    return (
        <React.Fragment>
            <BlockFinder />
            <BlockFeatures layout="top-strip" />
            <BlockSpace layout="divider-nl" />
            <BlockProductsCarousel
                blockTitle={intl.formatMessage({ id: 'HEADER_FEATURED_PRODUCTS' })}
                layout="grid-5"
                loading={featuredProducts.isLoading}
                products={featuredProductsState}
                groups={featuredProducts.tabs}
                currentGroup={featuredProducts.tabs.find((x) => x.current)}
                onChangeGroup={featuredProducts.handleTabChange}
            />
            <BlockSpace layout="divider-nl" />
            <BlockSale
                products={products}
                loading={blockSale.isLoading}
            />
            <BlockSpace layout="divider-lg" />

            {blockZones.map((blockZone, blockZoneIdx) => (
                <React.Fragment key={blockZoneIdx}>
                    <BlockZone
                        image={blockZone.image}
                        mobileImage={blockZone.mobileImage}
                        categorySlug={blockZone.categorySlug}
                    />
                    {blockZoneIdx < blockZones.length - 1 && (
                        <BlockSpace layout="divider-sm" />
                    )}
                </React.Fragment>
            ))}

            <BlockSpace layout="divider-nl" />
            <BlockBanners />
            <BlockSpace layout="divider-nl" />
            <BlockProductsCarousel
                blockTitle={intl.formatMessage({ id: 'HEADER_NEW_ARRIVALS' })}
                layout="horizontal"
                rows={2}
                loading={newArrivals.isLoading}
                products={products}
                links={newArrivalsLinks}
            />
            <BlockSpace layout="divider-nl" />
            <BlockPosts
                blockTitle={intl.formatMessage({ id: 'HEADER_LATEST_NEWS' })}
                layout="grid"
                loading={latestPosts.isLoading}
                posts={latestPosts.data}
                links={latestPostsLinks}
            />
            <BlockSpace layout="divider-nl" />
            <BlockBrands
                layout="columns-8-full"
                brands={brands.data}
            />
            <BlockSpace layout="divider-nl" className="d-xl-block d-none" />
            <BlockProductsColumns columns={columns} />
            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

