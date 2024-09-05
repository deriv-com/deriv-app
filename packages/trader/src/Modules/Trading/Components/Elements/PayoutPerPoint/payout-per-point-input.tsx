import React from 'react';
import WheelPicker from '../../Form/WheelPicker';
import { Popover, Text, useDevice } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset';
import { Localize } from '@deriv/translations';
import './payout-per-point.scss';
import { LabelPairedChevronsDownCaptionRegularIcon, LabelPairedChevronsUpCaptionRegularIcon } from '@deriv/quill-icons';

const PayoutPerPointInput = ({
    payoutOptions,
    onPayoutClick,
    selectedBarrier,
    defaultPayout,
    currency,
    tooltipText,
    contract_type,
}: {
    payoutOptions: string[];
    onPayoutClick: (option: string) => void;
    selectedBarrier: string;
    defaultPayout: string;
    currency: string;
    contract_type: string;
    tooltipText?: React.ReactNode;
}) => {
    const { is_desktop } = useDevice();
    const turbos_up_payout_message = (
        <Localize i18n_default_text='The amount you will receive at expiry for every point of change above the barrier.' />
    );
    const turbos_down_payout_message = (
        <Localize i18n_default_text='The amount you’ll receive at expiry for every point of change below the barrier.' />
    );
    if (!is_desktop) {
        return null;
    }
    return (
        <Fieldset
            className='trade-container__fieldset payout-per-point-input'
            header={<Localize i18n_default_text='Payout per Point' />}
            header_tooltip={contract_type == 'turboslong' ? turbos_up_payout_message : turbos_down_payout_message}
            popover_wrapper_class='popover_wrapper_class'
        >
            <WheelPicker
                options={payoutOptions}
                defaultValue={defaultPayout}
                onClick={onPayoutClick}
                currency={currency}
            />
            <Fieldset className='actions-wrapper'>
                <Text size='xxxs' line_height='l' color='default' align='center' as='p'>
                    <Localize i18n_default_text='Distance to current spot' />
                </Text>
                <Popover
                    alignment='left'
                    className='popover-icon'
                    is_bubble_hover_enabled
                    margin={206}
                    disable_target_icon
                    icon='info'
                    zIndex='9999'
                    message={tooltipText}
                >
                    <div className='distance-to-current-spot'>
                        <Text
                            size='xxxs'
                            line_height='l'
                            color='default'
                            align='center'
                            as='p'
                            className='barrier-value'
                        >
                            {selectedBarrier}
                            {Number(selectedBarrier) < 0 ? (
                                <LabelPairedChevronsDownCaptionRegularIcon
                                    width={12}
                                    height={12}
                                    stroke='var(--text-prominent)'
                                    className='indicator-icon'
                                />
                            ) : (
                                <LabelPairedChevronsUpCaptionRegularIcon
                                    width={12}
                                    height={12}
                                    stroke='var(--text-prominent)'
                                    className='indicator-icon'
                                />
                            )}
                        </Text>
                    </div>
                </Popover>
            </Fieldset>
        </Fieldset>
    );
};

export default PayoutPerPointInput;
