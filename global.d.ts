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
    }
}

declare module '*.svg' {
    const content: React.SVGAttributes<SVGElement>;
    export default content;
}

export {};
