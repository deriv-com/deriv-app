import React from 'react';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../../components';
import { getStaticUrl } from '../../../../../../helpers/urls';
import DerivX from '../../../../../../public/images/cfd/derivx.svg';

const LeadingIcon = () => (
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

const TrailingButton = () => (
    <Button className='rounded-200' colorStyle='coral' variant='primary'>
        Get
    </Button>
);

const AvailableDxtradeAccountsList = () => (
    <TradingAccountCard leading={LeadingIcon} trailing={TrailingButton}>
        <div className='grow user-select-none'>
            <Text bold className='leading-200' size='sm'>
                Deriv X
            </Text>
            <Text className='text-[12px] leading-100 w-5/6 lg:w-full'>
                This account offers CFDs on a highly customisable CFD trading platform.
            </Text>
        </div>
    </TradingAccountCard>
);

export default AvailableDxtradeAccountsList;
