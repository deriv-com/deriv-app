export {};

declare global {
    interface Window {
        LC_API: {
            open_chat_window: VoidFunction;
        };
    }
}
