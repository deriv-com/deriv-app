import { TLiveChatWidget } from './livechat';

declare global {
    interface Window {
        clipboardData: DataTransfer;
        LiveChatWidget: TLiveChatWidget;
        LC_API: {
            close_chat: () => void;
        };
        TrackJS: { console: { log: (arg0: unknown[]) => void }; track: (arg0: object) => void };
        Blockly;
        Onfido: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            init: (args: any) => any;
        };
        DD_RUM: object | undefined;
        dataLayer: object[];
        fcWidget: {
            show: VoidFunction;
            hide: VoidFunction;
            open: VoidFunction;
            close: VoidFunction;
            on: (key: string, callback: VoidFunction) => void;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setConfig: (config: Record<string, Record<string, any>>) => void;
            isLoaded: () => boolean;
            isInitialized: () => boolean;
            user: {
                setLocale(locale: string): void;
            };
        };
        fcWidgetMessengerConfig: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            config: Record<string, Record<string, any>>;
        };
        fcSettings: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any;
        };
        FreshChat: {
            initialize: (config: FreshChatConfig) => void;
        };
        DerivInterCom: {
            initialize: (config: IntercomConfig) => void;
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Intercom: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Analytics: any;
        GrowthbookFeatures: { [key: string]: boolean };
        navigator: Navigator;
    }

    interface FreshChatConfig {
        token: string | null;
        locale?: string;
        hideButton?: boolean;
    }

    interface IntercomUserData {
        app_id: string;
        user_id?: string;
        name?: string;
        email?: string;
        created_at?: number;
    }
    interface IntercomConfig {
        userData?: interface;
        hideLauncher?: boolean;
    }
    interface Navigator {
        connection?: NetworkInformation;
    }
    interface NetworkInformation {
        effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
        rtt?: number;
        downlink?: number;
    }
}

export {};
