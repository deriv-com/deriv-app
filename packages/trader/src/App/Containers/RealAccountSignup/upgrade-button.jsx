import classNames from 'classnames';
import { Button } from 'deriv-components';
import PropTypes  from 'prop-types';
import React      from 'react';

const UpgradeButton = ({ text, onClick, outlined }) => (
    <div className={classNames('acc-switcher__new-account', {
        'acc-switcher__new-account--outlined': outlined,
    })}
    >
        <Button
            id='upgrade-account'
            onClick={onClick}
            className='acc-switcher__new-account-link'
            text={text}
        />
    </div>
);

UpgradeButton.propTypes = {
    onClick : PropTypes.func,
    outlined: PropTypes.bool,
    text    : PropTypes.string,
};

export default UpgradeButton;
