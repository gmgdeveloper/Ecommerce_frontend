// react
import React, { useEffect, useState } from 'react';
// application
import AppImage from '~/components/shared/AppImage';
import AppLink from '~/components/shared/AppLink';
import { fetchBrands } from '~/fake-server/database/brands';
import { IBrand } from '~/interfaces/brand';

export type IBlockBrandsLayout = 'columns-8-full' | 'columns-7-sidebar';

interface Props {
    layout: IBlockBrandsLayout;
    brands: IBrand[];
}

function BlockBrands(props: Props) {
    const { layout } = props;
    const [brands, setBrands] = useState<IBrand[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const fetchedBrands = await fetchBrands();
                setBrands(fetchedBrands);
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        }

        fetchData();
    }, []);
    return (
        <div className={`block block-brands block-brands--layout--${layout}`}>
            <div className="container">
                <ul className="block-brands__list">
                    {brands.map((brand, brandIdx) => (
                        <React.Fragment key={brandIdx}>
                            <li className="block-brands__item">
                                <AppLink href="/" className="block-brands__item-link">
                                    <AppImage src={brand.image} />
                                    <span className="block-brands__item-name">{brand.name}</span>
                                </AppLink>
                            </li>
                            <li className="block-brands__divider" role="presentation" />
                        </React.Fragment>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default React.memo(BlockBrands);
