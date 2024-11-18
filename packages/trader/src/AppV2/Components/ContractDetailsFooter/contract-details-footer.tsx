import React from 'react';
import { Button, TButtonColor } from '@deriv-com/quill-ui';
import { RemainingTime } from '@deriv/components';
import { TContractInfo, getCardLabelsV2, isMultiplierContract, isValidToCancel, isValidToSell } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { observer } from 'mobx-react';
import { TRegularSizesWithExtraLarge } from '@deriv-com/quill-ui/dist/types';
import { FormatUtils } from '@deriv-com/utils';

type ContractInfoProps = {
    contract_info: TContractInfo;
};

type ButtonProps = {
    color: TButtonColor;
    size: TRegularSizesWithExtraLarge;
    fullWidth: boolean;
};

const ContractDetailsFooter = observer(({ contract_info }: ContractInfoProps) => {
    const {
        bid_price,
        currency,
        contract_id,
        cancellation: { date_expiry: cancellation_date_expiry } = {},
        profit,
        contract_type,
    } = contract_info;

    const { contract_replay, common } = useStore();
    const { server_time } = common;
    const { onClickCancel, onClickSell, is_sell_requested } = contract_replay;
    const is_valid_to_sell = isValidToSell(contract_info);
    const is_valid_to_cancel = isValidToCancel(contract_info);
    const is_multiplier = isMultiplierContract(contract_type);

    const card_labels = getCardLabelsV2();
    const formatted_bid_price = FormatUtils.formatMoney(bid_price || 0, {
        currency: currency as 'USD', // currency types mismatched between utils and shared
    });
    const is_close_button_disabled = Number(profit) < 0 && is_valid_to_cancel;
    const bid_details = is_close_button_disabled ? '' : `${formatted_bid_price} ${currency}`;
    const label = `${card_labels.CLOSE} ${bid_details}`;
    const button_props: ButtonProps = {
        color: 'black-white',
        size: 'lg',
        fullWidth: true,
    };

    return (
        <div className='contract-details-footer--container'>
            {is_multiplier ? (
                <>
                    <span className='contract-details-footer-button__wrapper'>
                        <Button
                            label={label}
                            isLoading={is_sell_requested}
                            disabled={is_close_button_disabled}
                            onClick={() => onClickSell(contract_id)}
                            {...button_props}
                        />
                    </span>
                    {is_valid_to_cancel && (
                        <span className='contract-details-footer-button__wrapper'>
                            <Button
                                onClick={() => onClickCancel(contract_id)}
                                label={
                                    <>
                                        {card_labels.CANCEL}{' '}
                                        <RemainingTime
                                            as='span'
                                            end_time={cancellation_date_expiry}
                                            format='mm:ss'
                                            getCardLabels={getCardLabelsV2}
                                            start_time={server_time}
                                        />
                                    </>
                                }
                                disabled={Number(profit) >= 0}
                                variant='secondary'
                                {...button_props}
                            />
                        </span>
                    )}
                </>
            ) : (
                <span className='contract-details-footer-button__wrapper'>
                    <Button
                        label={
                            is_valid_to_sell
                                ? `${card_labels.CLOSE} ${formatted_bid_price} ${currency}`
                                : card_labels.RESALE_NOT_OFFERED
                        }
                        isLoading={is_sell_requested && is_valid_to_sell}
                        isOpaque
                        onClick={is_valid_to_sell ? () => onClickSell(contract_id) : undefined}
                        disabled={!is_valid_to_sell}
                        variant='primary'
                        {...button_props}
                    />
                </span>
            )}
        </div>
    );
});

export default ContractDetailsFooter;
