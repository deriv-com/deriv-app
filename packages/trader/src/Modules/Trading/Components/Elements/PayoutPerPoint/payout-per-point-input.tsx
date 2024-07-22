import React from 'react';
import WheelPicker from '../../Form/WheelPicker';
import { Popover, Text, useDevice } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset';
import { Localize, localize } from '@deriv/translations';
import './payout-per-point.scss';
import { LabelPairedChevronsDownCaptionRegularIcon, LabelPairedChevronsUpCaptionRegularIcon } from '@deriv/quill-icons';

const PayoutPerPointInput = ({
    payoutOptions,
    onPayoutClick,
    selectedBarrier,
    defaultPayout,
    currency,
    tooltipText,
}: {
    payoutOptions: number[];
    onPayoutClick: (option: number) => void;
    selectedBarrier: string;
    defaultPayout: number;
    currency: string;
    tooltipText?: React.ReactNode;
}) => {
    const { is_desktop } = useDevice();
    const turbos_payout_message = (
        <Localize i18n_default_text='This is the amount you’ll receive at expiry for every point of change in the underlying price, if the spot price never touches or breaches the barrier throughout the contract duration.' />
    );
    return is_desktop ? (
        <Fieldset
            className={'trade-container__fieldset payout-per-point-input'}
            header={localize('Payout per Point')}
            header_tooltip={tooltipText}
            popover_wrapper_class='popover_wrapper_class'
        >
            <WheelPicker
                options={payoutOptions}
                defaultValue={defaultPayout}
                onClick={onPayoutClick}
                currency={currency}
            />
            <Fieldset className='actions-wrapper'>
                <Text size={'xxxs'} line_height='l' color='default' align='center' as='p'>
                    {localize('Distance to current spot')}
                </Text>
                <Popover
                    alignment='left'
                    className='popover-icon'
                    is_bubble_hover_enabled
                    margin={206}
                    disable_target_icon
                    icon='info'
                    zIndex='9999'
                    message={turbos_payout_message}
                >
                    <div className='distance-to-current-spot'>
                        <Text
                            size={'xxxs'}
                            line_height='l'
                            color={'default'}
                            align='center'
                            as='p'
                            className='barrier-value'
                        >
                            {selectedBarrier}
                            {Number(selectedBarrier) < 0 ? (
                                <LabelPairedChevronsDownCaptionRegularIcon
                                    width={12}
                                    height={12}
                                    className='indicator-icon'
                                />
                            ) : (
                                <LabelPairedChevronsUpCaptionRegularIcon
                                    width={12}
                                    height={12}
                                    className='indicator-icon'
                                />
                            )}
                        </Text>
                    </div>
                </Popover>
            </Fieldset>
        </Fieldset>
    ) : (
        <></>
    );
};

export default PayoutPerPointInput;
