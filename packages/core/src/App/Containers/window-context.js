import React from 'react';
import PropTypes from 'prop-types';

export const isBrowser = () => typeof window !== 'undefined';

export const WindowContext = React.createContext();

export const WindowContextWrapper = ({ children }) => {
    const [is_window_loaded, setWindowLoaded] = React.useState(false);

    React.useEffect(() => {
        if (isBrowser()) {
            window.addEventListener('load', () => setWindowLoaded(true));
        }
    }, []);

    return <WindowContext.Provider value={{ is_window_loaded }}>{children}</WindowContext.Provider>;
};

WindowContextWrapper.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
