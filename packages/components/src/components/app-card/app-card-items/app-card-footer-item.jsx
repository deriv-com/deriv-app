import React from 'react';
import PropTypes from 'prop-types';
import { isMobile } from '@deriv/shared';
import Text from '../../text';

const AppCardFooterItem = ({ info, getFontColor, label }) => {
    return (
        <div className='dc-app-card-footer__info'>
            <Text color={getFontColor()} size={isMobile() ? 'xxxxs' : 'xxxs'}>
                {label}
            </Text>
            <Text color={getFontColor()} size={isMobile() ? 'xxxxs' : 'xxxs'} weight='bold'>
                {info}
            </Text>
        </div>
    );
};

AppCardFooterItem.propTypes = {
    info: PropTypes.string,
    getFontColor: PropTypes.func,
    label: PropTypes.string,
};

export default AppCardFooterItem;
