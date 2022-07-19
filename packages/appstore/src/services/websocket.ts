import { DerivWS } from 'Types';

let ws: DerivWS = null;

export const useWs = (): DerivWS => ws;

export const initWs = (ws_instance: DerivWS): void => (ws = ws_instance);
