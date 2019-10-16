import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import { Button }   from 'deriv-components';
import { localize } from 'App/i18n';

const UpgradeButton = ({ className, onClick }) => (
    <Button
        id='acc-balance-btn'
        className={className}
        has_effect
        text={localize('Upgrade')}
        onClick={onClick}
        primary
    />
);

UpgradeButton.propTypes = {
    className: PropTypes.string,
    onClick  : PropTypes.func,
};

export { UpgradeButton };
