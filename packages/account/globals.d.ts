export {};
declare global {
    interface Window {
        LC_API: any;
    }
}
declare module '*.svg' {
    const content: any;
    export default content;
}
