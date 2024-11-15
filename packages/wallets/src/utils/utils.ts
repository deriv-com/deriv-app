type TServerError = {
    code: string;
    details?: { [key: string]: string };
    fields?: string[];
    message: string;
};

export const isServerError = (error: unknown): error is TServerError =>
    typeof error === 'object' && error !== null && 'code' in error;

export const defineViewportHeight = () => {
    const viewportHeight = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--wallets-vh', `${viewportHeight}px`);
};

export const defineSwitcherWidth = (realWidth: number, demoWidth: number) => {
    document.documentElement.style.setProperty('--wallets-real-width', `${realWidth}px`);
    document.documentElement.style.setProperty('--wallets-demo-width', `${demoWidth}px`);
    document.documentElement.style.setProperty('--wallets-switcher-width', `${demoWidth + realWidth + 16}px`);
};
