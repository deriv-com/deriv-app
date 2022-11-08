declare global {
    interface Window {
        safari?: { pushNotification: () => void };
        HTMLElement: HTMLElement & string;
    }
}

export const isSafari = () => {
    return (
        /constructor/i.test(window.HTMLElement) ||
        (function (p) {
            return p.toString() === '[object SafariRemoteNotification]';
        })(!window.safari || (typeof window.safari !== 'undefined' && window.safari.pushNotification))
    );
};

export const isFirefox = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return typeof InstallTrigger !== 'undefined';
};
