import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { localize }        from 'App/i18n';
import { urlFor }          from '_common/url';
import Button              from '../../Form/button.jsx';

const DepositButton = ({ className }) => (
    <Button
        className={classNames(className, 'btn--primary btn--primary--orange')}
        has_effect
        text={localize('Deposit')}
        onClick={() => {
            window.open(urlFor('cashier', undefined, undefined, true), '_blank');
        }}
    />
);

DepositButton.propTypes = {
    className: PropTypes.string,
};

export { DepositButton };
