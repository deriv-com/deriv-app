import React, { FC, Fragment } from 'react';
import { useDxtradeAccountsList } from '@deriv/api';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../../components';
import { getStaticUrl } from '../../../../../../helpers/urls';
import DerivX from '../../../../../../public/images/cfd/derivx.svg';
import { PlatformDetails } from '../../../../constants';

const AddedDxtradeAccountsList: FC = () => {
    const { data: dxTradeAccounts } = useDxtradeAccountsList();

    const leading = () => (
        <div
            className='cursor-pointer'
            onClick={() => {
                window.open(getStaticUrl('/derivx'));
            }}
            // Fix sonarcloud issue
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    window.open(getStaticUrl('/derivx'));
                }
            }}
            role='button'
        >
            <DerivX />
        </div>
    );

    const trailing = () => (
        <div className='flex flex-col gap-y-200'>
            <Button
                // open transfer modal
                variant='secondary'
            >
                Transfer
            </Button>
            <Button>Open</Button>
        </div>
    );

    return (
        <TradingAccountCard leading={leading} trailing={trailing}>
            <div className='flex flex-col flex-grow'>
                {dxTradeAccounts?.map(account => (
                    <Fragment key={account?.account_id}>
                        <Text size='sm'>{PlatformDetails.dxtrade.title}</Text>
                        <Text bold size='sm'>
                            {account?.display_balance}
                        </Text>
                        <Text bold color='primary' size='xs'>
                            {account?.login}
                        </Text>
                    </Fragment>
                ))}
            </div>
        </TradingAccountCard>
    );
};

export default AddedDxtradeAccountsList;
