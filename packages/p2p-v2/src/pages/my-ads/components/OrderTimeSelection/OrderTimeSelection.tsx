import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { OrderTimeTooltipModal } from '@/components/Modals';
import { ORDER_COMPLETION_TIME_LIST, ORDER_TIME_INFO_MESSAGE } from '@/constants';
import { LabelPairedChevronDownMdRegularIcon, LabelPairedCircleInfoCaptionRegularIcon } from '@deriv/quill-icons';
import { Button, Dropdown, Text, Tooltip, useDevice } from '@deriv-com/ui';

const OrderTimeSelection = () => {
    const { control } = useFormContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isMobile } = useDevice();

    return (
        <div className='my-4'>
            <div className='flex items-center gap-[0.8rem]'>
                <Text color='prominent' size={isMobile ? 'md' : 'sm'}>
                    Orders must be completed in
                </Text>
                <Text size='xs'>
                    <Tooltip className='max-w-none' message={ORDER_TIME_INFO_MESSAGE} position='top'>
                        <Button
                            color='white'
                            onClick={isMobile ? () => setIsModalOpen(true) : () => undefined}
                            variant='contained'
                        >
                            <LabelPairedCircleInfoCaptionRegularIcon
                                data-testid='dt_p2p_v2_order_info_icon'
                                height={24}
                                width={24}
                            />
                        </Button>
                    </Tooltip>
                </Text>
            </div>
            <Controller
                control={control}
                name='order-completion-time'
                render={({ field: { onChange, value } }) => (
                    <Dropdown
                        className='items-center h-16'
                        dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                        list={ORDER_COMPLETION_TIME_LIST}
                        name='order-completion-time'
                        onSelect={onChange}
                        value={value}
                        variant='comboBox'
                    />
                )}
            />

            {isModalOpen && (
                <OrderTimeTooltipModal isModalOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default OrderTimeSelection;
