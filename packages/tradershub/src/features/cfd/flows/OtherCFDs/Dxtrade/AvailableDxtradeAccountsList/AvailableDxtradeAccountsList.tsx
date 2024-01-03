import React from 'react';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../../components';
import { getStaticUrl } from '../../../../../../helpers/urls';
import DerivX from '../../../../../../public/images/cfd/derivx.svg';

const leading = () => {
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

const trailing = () => {
    return (
        <Button className='rounded-200' colorStyle='coral' variant='primary'>
            Get
        </Button>
    );
};

const AvailableDxtradeAccountsList = () => {
    return (
        <TradingAccountCard leading={leading} trailing={trailing}>
            <div className='flex flex-col flex-grow'>
                <Text bold size='sm'>
                    Deriv X
                </Text>
                <Text size='sm'>This account offers CFDs on a highly customisable CFD trading platform.</Text>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableDxtradeAccountsList;
