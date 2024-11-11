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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Analytics: any;
        GrowthbookFeatures: { [key: string]: boolean };
    }
    interface FreshChatConfig {
        token: string | null;
        locale?: string;
        hideButton?: boolean;
    }
}

export {};
