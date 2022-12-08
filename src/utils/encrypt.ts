import { env } from "@/env/client.mjs";

const encrypt = async (value: string) => {
    const JSEncrypt = (await import("jsencrypt")).default;

    const key = new JSEncrypt();
    key.setPublicKey(env.NEXT_PUBLIC_KEY);

    const encryptedString = key.encrypt(value);

    /*
     * JSEncrypt.encrypt() will return false if something goes wrong while encrypting the string,
     * otherwise it will return the encrypted string.
     * Source Code: https://github.com/travist/jsencrypt/blob/master/src/JSEncrypt.ts#L99
     */
    if (typeof encryptedString === "string") {
        return encryptedString;
    } else {
        throw new Error("Something went wrong when encrypting the string.");
    }
};

export default encrypt;
