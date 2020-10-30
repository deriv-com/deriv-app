import React from 'react';
import PropTypes from 'prop-types';
import { MobileFullPageModal } from '@deriv/components';
import { isMobile } from '@deriv/shared';

const OrderDetailsWrapper = ({ children }) =>
    isMobile() ? (
        <MobileFullPageModal className='order-details' height_offset='80px' is_flex is_modal_open>
            {children}
        </MobileFullPageModal>
    ) : (
        <React.Fragment>{children}</React.Fragment>
    );

OrderDetailsWrapper.propTypes = {
    children: PropTypes.any,
};

export default OrderDetailsWrapper;
