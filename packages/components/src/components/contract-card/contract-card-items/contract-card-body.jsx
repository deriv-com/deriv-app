import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { isCryptocurrency, getIndicativePrice, getCurrentTick, getDisplayStatus } from '@deriv/shared';
import ContractCardItem from './contract-card-item.jsx';
import CurrencyBadge from '../../currency-badge';
import DesktopWrapper from '../../desktop-wrapper';
import Icon from '../../icon';
import MobileWrapper from '../../mobile-wrapper';
import Money from '../../money';
import { ResultStatusIcon } from '../result-overlay/result-overlay.jsx';
import ProgressSliderMobile from '../../progress-slider-mobile';
import AccumulatorCardBody from './accumulator-card-body.jsx';
import MultiplierCardBody from './multiplier-card-body.jsx';
import VanillaOptionsCardBody from './vanilla-options-card-body.jsx';

const ContractCardBody = ({
    addToast,
    connectWithContractUpdate,
    contract_info,
    contract_update,
    currency,
    current_focus,
    error_message_alignment,
    getCardLabels,
    getContractById,
    has_progress_slider,
    is_accumulator,
    is_mobile,
    is_multiplier,
    is_positions,
    is_sold,
    is_vanilla,
    onMouseLeave,
    removeToast,
    server_time,
    setCurrentFocus,
    should_show_cancellation_warning,
    status,
    toggleCancellationWarning,
}) => {
    const indicative = getIndicativePrice(contract_info);
    const { buy_price, sell_price, payout, profit, tick_count, date_expiry, purchase_time } = contract_info;
    const current_tick = tick_count ? getCurrentTick(contract_info) : null;
    const { INDICATIVE_PRICE, PAYOUT, POTENTIAL_PAYOUT, POTENTIAL_PROFIT_LOSS, PROFIT_LOSS, PURCHASE_PRICE } =
        getCardLabels();

    const progress_slider_mobile_el = (
        <ProgressSliderMobile
            current_tick={current_tick}
            expiry_time={date_expiry}
            getCardLabels={getCardLabels}
            is_loading={false}
            server_time={server_time}
            start_time={purchase_time}
            ticks_count={tick_count}
        />
    );

    let card_body;

    if (is_multiplier) {
        card_body = (
            <MultiplierCardBody
                addToast={addToast}
                connectWithContractUpdate={connectWithContractUpdate}
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency}
                current_focus={current_focus}
                error_message_alignment={error_message_alignment}
                getCardLabels={getCardLabels}
                getContractById={getContractById}
                has_progress_slider={has_progress_slider}
                progress_slider={progress_slider_mobile_el}
                is_mobile={is_mobile}
                is_sold={is_sold}
                onMouseLeave={onMouseLeave}
                status={status}
                removeToast={removeToast}
                setCurrentFocus={setCurrentFocus}
                should_show_cancellation_warning={should_show_cancellation_warning}
                toggleCancellationWarning={toggleCancellationWarning}
            />
        );
    } else if (is_accumulator) {
        card_body = (
            <AccumulatorCardBody
                addToast={addToast}
                connectWithContractUpdate={connectWithContractUpdate}
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency}
                current_focus={current_focus}
                error_message_alignment={error_message_alignment}
                getCardLabels={getCardLabels}
                getContractById={getContractById}
                indicative={indicative}
                is_sold={is_sold}
                onMouseLeave={onMouseLeave}
                status={status}
                removeToast={removeToast}
                setCurrentFocus={setCurrentFocus}
                is_positions={is_positions}
            />
        );
    } else if (is_vanilla) {
        card_body = (
            <VanillaOptionsCardBody
                contract_info={contract_info}
                currency={currency}
                getCardLabels={getCardLabels}
                is_sold={is_sold}
                has_progress_slider={has_progress_slider}
                progress_slider={progress_slider_mobile_el}
                status={status}
            />
        );
    } else {
        card_body = (
            <React.Fragment>
                <div className='dc-contract-card-items-wrapper'>
                    <ContractCardItem
                        header={is_sold ? PROFIT_LOSS : POTENTIAL_PROFIT_LOSS}
                        is_crypto={isCryptocurrency(currency)}
                        is_loss={+profit < 0}
                        is_won={+profit > 0}
                    >
                        <Money amount={profit} currency={currency} />
                        <div
                            className={classNames('dc-contract-card__indicative--movement', {
                                'dc-contract-card__indicative--movement-complete': is_sold,
                            })}
                        >
                            {status === 'profit' && <Icon icon='IcProfit' />}
                            {status === 'loss' && <Icon icon='IcLoss' />}
                        </div>
                    </ContractCardItem>
                    <ContractCardItem header={is_sold ? PAYOUT : INDICATIVE_PRICE}>
                        <Money currency={currency} amount={sell_price || indicative} />
                        <div
                            className={classNames('dc-contract-card__indicative--movement', {
                                'dc-contract-card__indicative--movement-complete': is_sold,
                            })}
                        >
                            {status === 'profit' && <Icon icon='IcProfit' />}
                            {status === 'loss' && <Icon icon='IcLoss' />}
                        </div>
                    </ContractCardItem>
                    <ContractCardItem header={PURCHASE_PRICE}>
                        <Money amount={buy_price} currency={currency} />
                    </ContractCardItem>
                    <ContractCardItem header={POTENTIAL_PAYOUT}>
                        <Money currency={currency} amount={payout} />
                    </ContractCardItem>
                </div>
                <MobileWrapper>
                    <div className='dc-contract-card__status'>
                        {is_sold ? (
                            <ResultStatusIcon
                                getCardLabels={getCardLabels}
                                is_contract_won={getDisplayStatus(contract_info) === 'won'}
                            />
                        ) : (
                            progress_slider_mobile_el
                        )}
                    </div>
                </MobileWrapper>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <CurrencyBadge currency={currency} />
            <DesktopWrapper>{card_body}</DesktopWrapper>
            <MobileWrapper>
                <div
                    className={
                        ('dc-contract-card__separatorclass',
                        classNames({
                            'dc-contract-card__body-wrapper': !is_multiplier,
                        }))
                    }
                >
                    {card_body}
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
};

ContractCardBody.propTypes = {
    addToast: PropTypes.func,
    connectWithContractUpdate: PropTypes.func,
    contract_info: PropTypes.object,
    contract_update: PropTypes.object,
    currency: PropTypes.string,
    current_focus: PropTypes.string,
    error_message_alignment: PropTypes.string,
    getCardLabels: PropTypes.func,
    getContractById: PropTypes.func,
    is_accumulator: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    is_positions: PropTypes.bool,
    is_sold: PropTypes.bool,
    is_vanilla: PropTypes.bool,
    onMouseLeave: PropTypes.func,
    removeToast: PropTypes.func,
    server_time: PropTypes.object,
    setCurrentFocus: PropTypes.func,
    should_show_cancellation_warning: PropTypes.bool,
    status: PropTypes.string,
    toggleCancellationWarning: PropTypes.func,
    has_progress_slider: PropTypes.bool,
};

export default ContractCardBody;
