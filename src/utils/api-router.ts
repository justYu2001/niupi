import {
    NextApiRequest,
    type NextApiResponse,
    type NextApiHandler,
} from "next";
import { Method } from "axios";

type HTTPMethod = Uppercase<Method>;

type HTTPMethodHandler = {
    [key in HTTPMethod]?: NextApiHandler;
};

function APIRouter(handlers: HTTPMethodHandler) {
    return async (request: NextApiRequest, response: NextApiResponse) => {
        const method = request.method?.toUpperCase() as HTTPMethod;

        if (!handlers[method]) {
            return response.status(405);
        }

        return handlers[method]?.(request, response);
    };
}

export default APIRouter;
