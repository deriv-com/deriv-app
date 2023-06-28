declare global {
    interface Window {
        LiveChatWidget: {
            on: (key: string, callback: VoidFunction) => void;
            get: (key: string) => any;
            call: (key: string, value?: any) => void;
        };
        LC_API: {
            on_chat_ended: VoidFunction;
            open_chat_window: VoidFunction;
        };
        TrackJS: { console: { log: (arg0: unknown[]) => void }; track: (arg0: object) => void };
    }
}

export {};
