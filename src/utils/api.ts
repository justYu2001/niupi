import axios, { CreateAxiosDefaults } from "axios";

const config: CreateAxiosDefaults = {
    baseURL: process.env.API_URL,
};

const api = axios.create(config);

type PlainObject = Record<string, unknown>;

type TransformableObject = unknown[] & PlainObject;
interface RenameKeyFunction {
    (object: TransformableObject, oldKey: string, newKey: string): void;
}

const renameKey: RenameKeyFunction = (object, oldKey, newKey) => {
    const value = Object.getOwnPropertyDescriptor(object, oldKey);

    if (value && oldKey !== newKey) {
        Object.defineProperty(object, newKey, value);
        delete object[oldKey];
    }
};

const isPlainObject = (value: unknown): value is PlainObject => {
    if (!value) {
        return false;
    }

    const proto = Object.getPrototypeOf(value);
    return proto === null || proto === Object.prototype;
};

const isTransformableObject = (
    value: unknown
): value is TransformableObject => {
    return Array.isArray(value) || isPlainObject(value);
};

const camelToSnake = (value: string) => {
    return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

const convertKeysToSnakeCase = (data: TransformableObject) => {
    for (const key of Object.keys(data)) {
        const snakeCaseKey = camelToSnake(key);
        renameKey(data, key, snakeCaseKey);

        const subObject = data[snakeCaseKey];

        if (isTransformableObject(subObject)) {
            convertKeysToSnakeCase(subObject);
        }
    }
};

api.interceptors.request.use((request) => {
    const requestBody = request.data;

    if (isTransformableObject(requestBody)) {
        convertKeysToSnakeCase(requestBody);

        for (const key of Object.keys(requestBody)) {
            if (requestBody[key] === "") {
                requestBody[key] = null;
            }
        }
    }

    return request;
});

const snakeToCamel = (value: string) => {
    return value.replace(/([_][a-z])/g, (letters) =>
        letters.toUpperCase().replace("_", "")
    );
};

const convertKeysToCamelCase = (data: TransformableObject) => {
    for (const key of Object.keys(data)) {
        const camelCaseKey = snakeToCamel(key);
        renameKey(data, key, camelCaseKey);

        const subObject = data[camelCaseKey];

        if (isTransformableObject(subObject)) {
            convertKeysToCamelCase(subObject);
        }
    }
};

api.interceptors.response.use((response) => {
    const isJSONData = response.headers["content-type"] === "application/json";

    if (isJSONData) {
        convertKeysToCamelCase(response.data);
    }

    return response;
});

export default api;
