import { TClientStore } from '@deriv/stores/types';
import { Observable } from 'rxjs';

export type DerivAPIConstructorArgs = {
    language?: string;
    config?: Record<string, unknown>;
    client_store: TClientStore;
    wait: (api_call: string) => void;
    synchronize: (active_connection: ConnectionInstance) => void;
};

export interface DerivAPIBasic {
    (args: DerivAPIConstructorArgs): void;
    authorize: (token: string) => void;
    expectResponse: () => void;
    onOpen?: () => Observable<GenericResponse>;
    onMessage?: () => Observable<GenericResponse>;
    onClose?: () => Observable<GenericResponse>;
}

export type ConnectionInstance = {
    id: string;
    connection: WebSocket;
    deriv_api: DerivAPIBasic;
};

export type ConnectionConfig = {
    wsEvent?: (event: string) => void;
    onOpen?: (arg?: unknown) => void;
    onMessage?: (arg?: unknown) => void;
    onReconnect?: (arg?: unknown) => void;
    onDisconnect?: (arg?: unknown) => void;
};

export interface GenericResponse extends Record<string, unknown> {
    data: {
        echo_req: Record<string, unknown>;
        msg_type: string;
        req_id: number;
    };
}
