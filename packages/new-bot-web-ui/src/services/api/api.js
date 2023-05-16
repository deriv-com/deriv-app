import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";

const isBrowser = typeof window !== "undefined";

export const generateDerivApiInstance = () => {
    if (!isBrowser) return;

    const server = "frontend.binaryws.com";
    const language = "EN";
    const app_id = "11780";
    const brand_name = "deriv";

    const socket_url = `wss://${server}/websockets/v3?app_id=${app_id}&l=${language}&brand=${brand_name}`;
    const deriv_socket = new WebSocket(socket_url);

    return new DerivAPIBasic({
        connection: deriv_socket,
    });
};

export const api = generateDerivApiInstance();