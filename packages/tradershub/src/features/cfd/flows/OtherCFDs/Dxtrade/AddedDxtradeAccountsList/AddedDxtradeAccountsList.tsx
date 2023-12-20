import React from 'react';
import { useDxtradeAccountsList } from '@deriv/api';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../../components';
import { getStaticUrl } from '../../../../../../helpers/urls';
import DerivX from '../../../../../../public/images/cfd/derivx.svg';
import { PlatformDetails } from '../../../../constants';

const AddedDxtradeAccountsList: React.FC = () => {
    const { data } = useDxtradeAccountsList();

    const leadingComponent = () => (
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

    const trailingComponent = () => (
        <div className='flex flex-col space-y-1'>
            <Button
                // open transfer modal
                variant='outlined'
            >
                Transfer
            </Button>
            <Button /* show <MT5TradeModal/> */>Open</Button>
        </div>
    );

    return (
        <TradingAccountCard leading={leadingComponent} trailing={trailingComponent}>
            <div className='flex flex-col fles-grow'>
                {data?.map(account => (
                    <React.Fragment key={account?.account_id}>
                        <Text size='sm'>{PlatformDetails.dxtrade.title}</Text>
                        <Text size='sm' weight='bold'>
                            {account?.display_balance}
                        </Text>
                        <Text color='primary' size='xs' weight='bold'>
                            {account?.login}
                        </Text>
                    </React.Fragment>
                ))}
            </div>
        </TradingAccountCard>
    );
};

export default AddedDxtradeAccountsList;
