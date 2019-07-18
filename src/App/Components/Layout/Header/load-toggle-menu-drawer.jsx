import React                from 'react';

const LoadToggleMenuDrawer = ({ is_mobile }) => {
    if (!is_mobile) {
        return null;
    }

    const ToggleMenuDrawer = React.lazy(() => import(/* webpackChunkName: "toggle-menu-drawer" */'./toggle-menu-drawer'));
    return (
        <React.Suspense fallback={<div />}>
            <ToggleMenuDrawer />
        </React.Suspense>
    );
};

export { LoadToggleMenuDrawer };
