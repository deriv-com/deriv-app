import PropTypes    from 'prop-types';
import React        from 'react';
import { Button }   from '@deriv/components';
import { Localize } from '@deriv/translations';

const MissingRealAccount = ({ onClick }) => (
    <div className='mt5-dashboard__missing-real'>
        <h1 className='mt5-dashboard__missing-real--heading'>
            <Localize
                i18n_default_text='You need a real account (fiat currency or cryptocurrency) in Deriv to create a real DMT5 account.'
            />
        </h1>
        <Button
            className='mt5-dashboard__missing-real--button'
            onClick={onClick}
            type='button'
            primary
        >
            <span className='btn__text'>
                <Localize i18n_default_text='Create a Deriv account' />
            </span>
        </Button>
    </div>
);

MissingRealAccount.propTypes = {
    onClick: PropTypes.func,
};

export default MissingRealAccount
