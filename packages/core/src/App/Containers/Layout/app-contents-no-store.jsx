import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, MobileWrapper, ThemedScrollbars } from '@deriv/components';

const AppContentsNoStore = ({ children }) => {
    const scroll_ref = React.useRef(null);
    const child_ref = React.useRef(null);

    return (
        <div id='app_contents' className={classNames('app-contents', {})} ref={scroll_ref}>
            <MobileWrapper>{children}</MobileWrapper>
            <DesktopWrapper>
                <ThemedScrollbars height='calc(100vh - 84px)' has_horizontal refSetter={child_ref}>
                    {children}
                </ThemedScrollbars>
            </DesktopWrapper>
        </div>
    );
};

AppContentsNoStore.propTypes = {
    children: PropTypes.any,
};

export default AppContentsNoStore;
