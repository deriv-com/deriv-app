import React from 'react';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../../components';
import { getStaticUrl } from '../../../../../../helpers/urls';
import DerivX from '../../../../../../public/images/cfd/derivx.svg';

const leadingComponent = () => {
    return (
        <div
            className='cursor-pointer'
            onClick={() => {
                window.open(getStaticUrl('/derivx'));
            }}
            onKeyDown={e => {
                if (e.key === 'Enter') {
                    window.open(getStaticUrl('/derivx'));
                }
            }}
            role='button'
        >
            <DerivX />
        </div>
    );
};

const trailingComponent = () => {
    return <Button color='primary-light' /* open <DxtradeEnterPasswordModal /> */>Get</Button>;
};

const AvailableDxtradeAccountsList: React.FC = () => {
    return (
        <TradingAccountCard leading={leadingComponent} trailing={trailingComponent}>
            <div className='flex-grow'>
                <p>
                    <Text size='sm' weight='bold'>
                        Deriv X
                    </Text>
                </p>
                <Text size='xs'>This account offers CFDs on a highly customisable CFD trading platform.</Text>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableDxtradeAccountsList;
