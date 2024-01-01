// react
// third-party
import { GetServerSideProps } from 'next';
// application
import { shopApi } from '~/api';
import ShopPageProduct from '~/components/shop/ShopPageProduct';
import { IProduct } from '~/interfaces/product';

interface Props {
    product: IProduct ;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => ({
    props: {
        product: await shopApi.getProductBySlug('test1-658d817333796'),
    },
});

// export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
//     const slug = typeof params?.slug === 'string' ? params?.slug : null;
//     return {
//         props: {
//             product: slug ? await shopApi.getProductBySlug(slug) : null,
//         },
//     };
// };

function Page(props: Props) {
    const { product } = props;


    return (
        <ShopPageProduct
            product={product}
            layout="full"
        />
    );
}

export default Page;
