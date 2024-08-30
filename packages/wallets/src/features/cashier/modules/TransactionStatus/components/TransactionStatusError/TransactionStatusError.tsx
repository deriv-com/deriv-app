import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Button, Divider, Text } from '@deriv-com/ui';

type TTransactionStatusError = {
    refresh: VoidFunction;
};

const TransactionStatusError: React.FC<TTransactionStatusError> = ({ refresh }) => (
    <React.Fragment>
        <Text lineHeight='sm' size='xs'>
            <Localize i18n_default_text='Unfortunately, we cannot retrieve the information at this time.' />
        </Text>
        <Divider color='var(--general-active)' />
        <Button borderWidth='sm' color='black' isFullWidth={true} onClick={refresh} size='sm' variant='outlined'>
            <Localize i18n_default_text='Refresh' />
        </Button>
    </React.Fragment>
);

export default TransactionStatusError;
