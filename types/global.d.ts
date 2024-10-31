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
            init: (args: any) => any;
        };
        DD_RUM: object | undefined;
        fcWidget: {
            show: VoidFunction;
            hide: VoidFunction;
            open: VoidFunction;
            on: (key: string, callback: VoidFunction) => void;
            setConfig: (config: Record<string, Record<string, any>>) => void;
            isLoaded: () => boolean;
            isInitialized: () => boolean;
            user: {
                setLocale(locale: string): void;
            };
        };
        fcWidgetMessengerConfig: {
            config: Record<string, Record<string, any>>;
        };
        fcSettings: {
            [key: string]: any;
        };
        FreshChat: {
            initialize: (config: FreshChatConfig) => void;
        };
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
