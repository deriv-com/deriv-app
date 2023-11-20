type TServerError = {
    code: string;
    details?: { [key: string]: string };
    fields?: string[];
    message: string;
};

export const isServerError = (error: unknown): error is TServerError =>
    typeof error === 'object' && error !== null && 'code' in error;

export const defineViewportVh = () => {
    const viewportVh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--viewport-vh', `${viewportVh}px`);
};
