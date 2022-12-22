import useSession from "@/hooks/session";

export const useStoreId = () => {
    const { session, isLoading } = useSession();

    return {
        storeId: session?.user?.storeId,
        isLoading,
    };
};