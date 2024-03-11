import React from 'react';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './FilterModalFooter.scss';

type TFilterModalFooterProps = {
    hasSameFilters: boolean;
    hasSamePaymentMethods: boolean;
    onApplyConfirm: () => void;
    onResetClear: () => void;
    paymentMethods: string[];
    showPaymentMethods: boolean;
};

const FilterModalFooter = ({
    hasSameFilters,
    hasSamePaymentMethods,
    onApplyConfirm,
    onResetClear,
    paymentMethods,
    showPaymentMethods,
}: TFilterModalFooterProps) => {
    const { isMobile } = useDevice();

    return (
        <div className='p2p-v2-filter-modal-footer'>
            <Button
                className='mr-[0.8rem] border-2 !border-[#999]'
                color='black'
                disabled={showPaymentMethods && paymentMethods.length === 0}
                isFullWidth={isMobile}
                onClick={onResetClear}
                size='lg'
                variant='outlined'
            >
                <Text lineHeight='6xl' size='sm' weight='bold'>
                    {showPaymentMethods ? 'Clear' : 'Reset'}
                </Text>
            </Button>
            <Button
                disabled={(showPaymentMethods && hasSamePaymentMethods) || (!showPaymentMethods && hasSameFilters)}
                isFullWidth={isMobile}
                onClick={onApplyConfirm}
                size='lg'
            >
                <Text lineHeight='6xl' size='sm' weight='bold'>
                    {showPaymentMethods ? 'Confirm' : 'Apply'}
                </Text>
            </Button>
        </div>
    );
};

export default FilterModalFooter;
