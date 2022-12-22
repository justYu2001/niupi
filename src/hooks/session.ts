import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";

export const fetchSession = async () => {
    const { data: session } = await axios.get("/api/auth/session");

    if (Object.keys(session).length) {
        return session;
    }

    return null;
};

interface UseSessionOptions {
    required: boolean;
    onUnauthenticated?: () => void;
}

const useSession = (
    { required, onUnauthenticated }: UseSessionOptions = { required: false }
) => {
    const router = useRouter();

    const { data, isLoading } = useQuery<Session>(["session"], fetchSession, {
        onSettled(data) {
            if (data || !required) {
                return;
            }

            if (onUnauthenticated) {
                onUnauthenticated();
            } else {
                router.push("/signin");
            }
        },
    });

    return {
        session: data,
        isLoading,
    };
};

export default useSession;