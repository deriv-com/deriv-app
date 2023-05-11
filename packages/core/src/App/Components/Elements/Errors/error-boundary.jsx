import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer, useStore } from '@deriv/stores';
import ErrorComponent from './index';

const ErrorBoundary = observer(({ children }) => {
    const root_store = useStore();
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);

    const handleError = (errorMsg, infoMsg) => {
        if (window.TrackJS) window.TrackJS.console.log(root_store);

        setHasError(true);
        setError(errorMsg);
        setInfo(infoMsg);
    };
    useEffect(() => {
        window.addEventListener('error', () => {
            handleError(error, info);
        });
        return () =>
            window.removeEventListener('error', () => {
                handleError(error, info);
            });
    }, [handleError]);

    return hasError ? <ErrorComponent should_show_refresh={true} /> : children;
});

ErrorBoundary.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default ErrorBoundary;
