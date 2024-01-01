// react
// third-party
import { GetServerSideProps } from 'next';
// application
import { shopApi } from '~/api';
import ShopPageProduct from '~/components/shop/ShopPageProduct';
import SitePageNotFound from '~/components/site/SitePageNotFound';
import { IProduct } from '~/interfaces/product';

interface Props {
    product: IProduct | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
    const slug = typeof params?.slug === 'string' ? params?.slug : null;
    return {
        props: {
            product: slug ? await shopApi.getProductBySlug(slug) : null,
        },
    };
};

function Page(props: Props) {
    const { product } = props;
    console.log(product,"/product")
    if (product === null) {
        return <SitePageNotFound />;
    }

    return (
        <ShopPageProduct
            product={product}
            layout="full"
        />
    );
}

export default Page;
