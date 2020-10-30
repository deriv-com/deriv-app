import React from 'react';
import { MobileFullPageModal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import PropTypes from 'prop-types';

const ChatWrapper = ({ children, is_modal_open }) =>
    isMobile() ? (
        <MobileFullPageModal className='order-chat' height_offset='80px' is_flex is_modal_open={is_modal_open}>
            {children}
        </MobileFullPageModal>
    ) : (
        <React.Fragment>{children}</React.Fragment>
    );

ChatWrapper.propTypes = {
    children: PropTypes.any,
    is_modal_open: PropTypes.bool,
};

export default ChatWrapper;
