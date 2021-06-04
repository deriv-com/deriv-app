import PropTypes from 'prop-types';
import React from 'react';
import { CFD_PLATFORMS } from '@deriv/shared';
import { Button } from '@deriv/components';
import { Localize } from '@deriv/translations';

const MissingRealAccount = ({ onClickSignup, platform }) => (
    <div className='cfd-dashboard__missing-real'>
        <h1 className='cfd-dashboard__missing-real--heading'>
            {platform === CFD_PLATFORMS.MT5 ? (
                <Localize i18n_default_text='You need a real account (fiat currency or cryptocurrency) in Deriv to create a real DMT5 account.' />
            ) : (
                <Localize i18n_default_text='To create a Deriv X real account, create a Deriv real account first.' />
            )}
        </h1>
        <Button className='cfd-dashboard__missing-real--button' onClick={onClickSignup} type='button' primary>
            <span className='btn__text'>
                <Localize i18n_default_text='Create a Deriv account' />
            </span>
        </Button>
    </div>
);

MissingRealAccount.propTypes = {
    onClickSignup: PropTypes.func,
    platform: PropTypes.string,
};

export default MissingRealAccount;
