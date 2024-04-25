import { useLayoutEffect } from 'react';

const useScript = (url: string) => {
    useLayoutEffect(() => {
        const script = document.createElement('script');

        script.src = url;
        script.type = 'text/javascript';
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [url]);
};

export default useScript;
