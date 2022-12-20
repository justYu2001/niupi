import { GetServerSideProps, type NextPageWithLayout } from "next";
import { unstable_getServerSession } from "next-auth";

import { getSellerDashboardLayout } from "@/layouts/SellerDashboardLayout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const Seller: NextPageWithLayout = () => {
    return <></>;
};

Seller.getLayout = getSellerDashboardLayout;

export default Seller;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (session) {
        return {
            props: {
                session,
            },
        };
    } else {
        return {
            redirect: {
                destination: "/signin",
                permanent: false,
            },
        };
    }
};
