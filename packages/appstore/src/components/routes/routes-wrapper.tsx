import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const RoutesWrapper: React.FC<TRoutesWrapperProps> = ({ has_router, children }) => {
    if (has_router) {
        return <React.Fragment>{children}</React.Fragment>;
    }

    return <Router>{children}</Router>;
};

type TRoutesWrapperProps = React.PropsWithChildren<{
    has_router: boolean;
}>;

export default RoutesWrapper;
