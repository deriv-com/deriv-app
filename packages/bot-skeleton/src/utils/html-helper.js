export const importExternal = url => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => resolve(window.external_global_component);
        script.onerror = reject;

        document.body.appendChild(script);
    });
};
