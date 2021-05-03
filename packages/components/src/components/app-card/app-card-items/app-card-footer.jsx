import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import AppCardFooterItem from './app-card-footer-item.jsx';

const AppCardFooter = ({ broker, card_labels, getFontColor, login_id, server, variant }) => (
    <div
        className={classNames('dc-app-card-footer__wrapper', {
            'dc-app-card-footer__wrapper--default': variant === 'default',
            'dc-app-card-footer__wrapper--mini': variant === 'mini',
            'dc-app-card-footer__wrapper--micro': variant === 'micro',
        })}
    >
        <AppCardFooterItem info={login_id} getFontColor={getFontColor} label={card_labels.LOGIN_ID} />
        <AppCardFooterItem info={broker} getFontColor={getFontColor} label={card_labels.BROKER} />
        <AppCardFooterItem info={server} getFontColor={getFontColor} label={card_labels.SERVER} />
    </div>
);

AppCardFooter.propTypes = {
    broker: PropTypes.string,
    card_labels: PropTypes.object,
    getFontColor: PropTypes.func,
    login_id: PropTypes.string,
    server: PropTypes.string,
    variant: PropTypes.oneOf(['default', 'mini', 'micro']),
};

export default AppCardFooter;
