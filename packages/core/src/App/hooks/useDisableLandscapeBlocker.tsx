import React from 'react';
import { useLocation } from 'react-router-dom';

const DISABLE_LANDSCAPE_BLOCKER_ROUTES = ['/appstore'];

export const useDisableLandscapeBlocker = () => {
    const location = useLocation();

    React.useEffect(() => {
        const pathname = location?.pathname;
        const landscapeBlocker = document.getElementById('landscape_blocker');
        if (!landscapeBlocker) return;

        if (DISABLE_LANDSCAPE_BLOCKER_ROUTES.some(route => pathname.startsWith(route)))
            landscapeBlocker.classList.remove('landscape-blocker');
        else landscapeBlocker.classList.add('landscape-blocker');
    }, [location]);
};
