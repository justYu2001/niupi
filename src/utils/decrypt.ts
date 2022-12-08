import NodeRSA from "node-rsa";

import { env } from "@/env/server.mjs";

const decrypt = (value: string) => {
    const key = new NodeRSA(env.PRIVATE_KEY);
    key.setOptions({
        encryptionScheme: "pkcs1",
    });

    return key.decrypt(value, "utf8");
};

export default decrypt;
