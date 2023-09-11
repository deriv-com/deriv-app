import { TClientStore } from '@deriv/stores/types';
import { Subject } from 'rxjs';

export type DerivAPIConstructorArgs = {
    onChangeActiveConnection: (active_connection: ConnectionInstance) => void;
    client_store: TClientStore;
    config: ConnectionConfig;
};

export interface DerivAPIBasic {
    (args: DerivAPIConstructorArgs): void;
    authorize: (token: string) => void;
    expectResponse: (responses: unknown) => void;
    onOpen?: () => Subject<GenericResponse>;
    onMessage?: () => Subject<GenericResponse>;
    onClose?: () => Subject<GenericResponse>;
    send: (payload: Record<string, unknown>) => Promise<Record<string, unknown> | void>;
    subscribe: (payload: Record<string, unknown>) => Subject<Record<string, unknown>>;
}

export type ConnectionInstance = {
    id: string;
    connection: WebSocket;
    deriv_api: DerivAPIBasic;
};

export type ConnectionConfig = {
    wsEvent: (event: string) => void;
    onOpen: (arg?: unknown) => void;
    onMessage: (arg?: unknown) => void;
    onReconnect: (arg?: unknown) => void;
    onDisconnect: (arg?: unknown) => void;
};

export interface GenericResponse extends Record<string, unknown> {
    data: {
        echo_req: Record<string, unknown>;
        msg_type: string;
        req_id: number;
    };
}
