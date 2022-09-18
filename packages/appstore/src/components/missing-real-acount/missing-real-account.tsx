import React from 'react';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TMissingRealAccount } from 'Types';

const MissingRealAccount = ({ onClickSignup }: TMissingRealAccount) => (
    <div className='missing-real-aacount'>
        <Text weight='bold'>
            <Localize i18n_default_text={'You need an Options account to create a CFD account.'} />
        </Text>
        <Button onClick={onClickSignup} type='button' primary>
            <Localize i18n_default_text='Get an Options account' />
        </Button>
    </div>
);

export default MissingRealAccount;
