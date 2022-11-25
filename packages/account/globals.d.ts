export {};
declare global {
    interface Window {
        LC_API: {
            open_chat_window: VoidFunction;
        };
    }
}
declare module '*.svg' {
    const content: any;
    export default content;
}
