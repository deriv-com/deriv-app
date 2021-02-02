import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { TReactChildren } from 'Types'

const RoutesWrapper: React.FC<TRoutesWrapperProps> = ({ has_router, children }) => {
    console.log('');
    console.warn('RoutesWrapper');
    console.log(has_router);
    if (has_router) {
        return <React.Fragment>{children}</React.Fragment>;
    }

    return <Router>{children}</Router>;
};

type TRoutesWrapperProps = {
    has_router: boolean;
    children: TReactChildren;
};

export default RoutesWrapper;
