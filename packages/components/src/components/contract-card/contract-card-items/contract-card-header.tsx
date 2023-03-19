import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { isHighLow, getCurrentTick, isBot } from '@deriv/shared';
import ContractTypeCell from './contract-type-cell';
import Button from '../../button';
import Icon from '../../icon';
import Text from '../../text';
import ProgressSlider from '../../progress-slider';
import DesktopWrapper from '../../desktop-wrapper';
import MobileWrapper from '../../mobile-wrapper';
import { TContractInfo } from '@deriv/shared/src/utils/contract/contract-types';
import { TGetCardLables, TGetContractTypeDisplay } from '../../types';

export type TContractCardHeaderProps = {
    contract_info: TContractInfo;
    display_name: string;
    getCardLabels: TGetCardLables;
    getContractTypeDisplay: TGetContractTypeDisplay;
    has_progress_slider: boolean;
    is_mobile: boolean;
    is_sell_requested: boolean;
    is_valid_to_sell: boolean;
    onClickSell: (contract_id?: number) => void;
    server_time: moment.Moment;
    id: number;
};

const ContractCardHeader = ({
    contract_info,
    display_name,
    getCardLabels,
    getContractTypeDisplay,
    has_progress_slider,
    id,
    is_mobile,
    is_sell_requested,
    is_valid_to_sell,
    onClickSell,
    server_time,
}: TContractCardHeaderProps) => {
    const current_tick = contract_info.tick_count ? getCurrentTick(contract_info) : null;
    const { underlying, multiplier, contract_type, shortcode, purchase_time, date_expiry, tick_count, is_sold } =
        contract_info;
    const { is_pathname_bot } = isBot();

    return (
        <>
            <div
                className={classNames('dc-contract-card__grid', 'dc-contract-card__grid-underlying-trade', {
                    'dc-contract-card__grid-underlying-trade--mobile': is_mobile && !multiplier,
                    'dc-contract-card__grid-underlying-trade--trader': !is_pathname_bot,
                })}
            >
                <div id='dc-contract_card_underlying_label' className='dc-contract-card__underlying-name'>
                    <Icon icon={underlying ? `IcUnderlying${underlying}` : 'IcUnknown'} width={40} size={32} />
                    <Text size='xxs' className='dc-contract-card__symbol' weight='bold'>
                        {display_name || contract_info.display_name}
                    </Text>
                </div>
                <div id='dc-contract_card_type_label' className='dc-contract-card__type'>
                    <ContractTypeCell
                        getContractTypeDisplay={getContractTypeDisplay}
                        is_high_low={isHighLow({ shortcode })}
                        multiplier={multiplier}
                        type={contract_type}
                    />
                </div>
                <MobileWrapper>
                    {is_valid_to_sell ? (
                        <CSSTransition
                            in={!!is_valid_to_sell}
                            timeout={250}
                            classNames={{
                                enter: 'dc-contract-card__sell-button--enter',
                                enterDone: 'dc-contract-card__sell-button--enter-done',
                                exit: 'dc-contract-card__sell-button--exit',
                            }}
                            unmountOnExit
                        >
                            <div className='dc-contract-card__sell-button-mobile'>
                                <Button
                                    id={`dc_contract_card_${id}_button`}
                                    className={classNames('dc-btn--sell', {
                                        'dc-btn--loading': is_sell_requested,
                                    })}
                                    is_disabled={!is_valid_to_sell || is_sell_requested}
                                    text={getCardLabels().SELL}
                                    onClick={() => onClickSell(id)}
                                    secondary
                                />
                            </div>
                        </CSSTransition>
                    ) : null}
                </MobileWrapper>
            </div>
            <MobileWrapper>
                <div className='dc-progress-slider--completed' />
            </MobileWrapper>
            <DesktopWrapper>
                {(!has_progress_slider || !!is_sold) && <div className='dc-progress-slider--completed' />}
                {has_progress_slider && !is_sold && (
                    <ProgressSlider
                        current_tick={current_tick}
                        expiry_time={date_expiry}
                        getCardLabels={getCardLabels}
                        is_loading={false}
                        server_time={server_time}
                        start_time={purchase_time}
                        ticks_count={tick_count}
                    />
                )}
            </DesktopWrapper>
        </>
    );
};

export default ContractCardHeader;
