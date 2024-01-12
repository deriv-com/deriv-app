import React from 'react';
import { FormikHandlers, FormikValues, useFormikContext } from 'formik';
import { Dropdown, Icon, Popover, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { order_completion_time_list } from 'Constants/order-list';
import { useStore } from '@deriv/stores';

type TFormikContext = {
    handleChange: FormikHandlers['handleChange'];
    values: FormikValues;
};

const order_time_info_message = (
    <Localize i18n_default_text='Orders will expire if they aren’t completed within this time.' />
);

const OrderTimeSelection = ({ ...field }: FormikValues) => {
    const { values, handleChange }: TFormikContext = useFormikContext<TFormikContext>();
    const { showModal } = useModalManagerContext();
    const { ui } = useStore();
    const { is_mobile } = ui;

    return (
        <div className='order-time-selection'>
            <div className='order-time-selection__title'>
                <Text color='prominent' size='xs' line_height='xl'>
                    <Localize i18n_default_text='Orders must be completed in' />
                </Text>
                <Popover
                    alignment='top'
                    classNameBubble='order-time-selection__popover'
                    message={order_time_info_message}
                >
                    <Icon
                        data_testid='dt_order_time_selection_info_icon'
                        icon='IcInfoOutline'
                        onClick={() =>
                            is_mobile && showModal({ key: 'OrderTimeTooltipModal', props: { order_time_info_message } })
                        }
                    />
                </Popover>
            </div>
            <Dropdown
                {...field}
                className='order-time-selection__time-dropdown'
                is_align_text_left
                list={order_completion_time_list}
                onChange={handleChange}
                value={values.order_completion_time}
            />
        </div>
    );
};

export default OrderTimeSelection;
