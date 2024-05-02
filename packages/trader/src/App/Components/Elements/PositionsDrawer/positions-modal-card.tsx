import classNames from 'classnames';
import React from 'react';
import { ArrowIndicator, ContractCard, CurrencyBadge, Money, ProgressSliderMobile, Text } from '@deriv/components';
import {
    addComma,
    getContractPath,
    getContractTypeDisplay,
    getCardLabels,
    getMarketInformation,
    getSymbolDisplayName,
    getEndTime,
    isAccumulatorContract,
    isCryptoContract,
    isMultiplierContract,
    isTurbosContract,
    isCryptocurrency,
    isVanillaContract,
} from '@deriv/shared';
import { BinaryLink } from 'App/Components/Routes';
import { PositionsCardLoader } from 'App/Components/Elements/ContentLoader';
import PositionsResultMobile from './positions-result-mobile';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

type TPortfolioStore = ReturnType<typeof useStore>['portfolio'];
type TPortfolioPosition = Pick<
    TPortfolioStore['active_positions'][0],
    'contract_info' | 'id' | 'indicative' | 'is_sell_requested' | 'profit_loss'
>;
type TPickPortfolioStore = Pick<TPortfolioStore, 'onClickSell' | 'onClickCancel'>;
type TUiStore = ReturnType<typeof useStore>['ui'];

type TPositionsModalCard = TPickPortfolioStore &
    TPortfolioPosition & {
        className?: string;
        contract_info: TPortfolioPosition['contract_info'];
        contract_update: TPortfolioPosition['contract_info']['contract_update'];
        currency: ReturnType<typeof useStore>['client']['currency'];
        current_tick?: React.ComponentProps<typeof ProgressSliderMobile>['current_tick'];
        is_loading?: boolean;
        result?: React.ComponentProps<typeof PositionsResultMobile>['result'];
        togglePositions: TUiStore['togglePositionsDrawer'];
    };

const PositionsModalCard = observer(
    ({
        className,
        contract_info,
        contract_update,
        currency,
        current_tick,
        id,
        is_loading,
        is_sell_requested,
        onClickSell,
        profit_loss,
        onClickCancel,
        result,
        togglePositions,
    }: TPositionsModalCard) => {
        const { ui, common, contract_trade } = useStore();
        const { active_symbols } = useTraderStore();
        const { server_time } = common;
        const { getContractById } = contract_trade;
        const {
            addToast,
            current_focus,
            is_mobile,
            removeToast,
            setCurrentFocus,
            should_show_cancellation_warning,
            toggleCancellationWarning,
        } = ui;
        const loader_el = (
            <div className='positions-modal-card__content-loader'>
                <PositionsCardLoader speed={2} />
            </div>
        );
        const {
            barrier,
            bid_price,
            buy_price,
            contract_type,
            date_expiry,
            date_start,
            entry_spot_display_value,
            is_sold,
            profit,
            sell_price,
            shortcode,
            tick_count,
            underlying,
        } = contract_info;
        const { STAKE, CONTRACT_VALUE, ENTRY_SPOT, STRIKE, TOTAL_PROFIT_LOSS } = getCardLabels();
        const is_multiplier = isMultiplierContract(contract_type);
        const is_accumulator = isAccumulatorContract(contract_type);
        const is_turbos = isTurbosContract(contract_type);
        const is_vanilla = isVanillaContract(contract_type);
        const is_crypto = isCryptoContract(underlying);
        const has_progress_slider = !is_multiplier || (is_crypto && is_multiplier);
        const has_ended = !!getEndTime(contract_info);
        const fallback_result = profit_loss >= 0 ? 'won' : 'lost';

        const display_name = getSymbolDisplayName(active_symbols, getMarketInformation(shortcode || '').underlying);

        const contract_vanilla_el = (
            <React.Fragment>
                <ContractCard.Header
                    contract_info={contract_info}
                    display_name={display_name}
                    getCardLabels={getCardLabels}
                    getContractTypeDisplay={getContractTypeDisplay}
                    has_progress_slider={!is_mobile && has_progress_slider}
                    is_mobile={is_mobile}
                    is_sell_requested={is_sell_requested}
                    onClickSell={onClickSell}
                    server_time={server_time as moment.Moment}
                />
                <CurrencyBadge currency={contract_info?.currency ?? ''} />
                <div className={classNames('positions-modal-card__grid', 'positions-modal-card__grid-body')}>
                    <div className={classNames('positions-modal-card__grid-profit-payout')}>
                        <div className='positions-modal-card__purchase-price'>
                            <Text size='xxxs' className='positions-modal-card__purchase-label'>
                                {STAKE}
                            </Text>
                            <Text weight='bold' size='xxs' className='positions-modal-card__purchase-value'>
                                <Money amount={buy_price} currency={currency} />
                            </Text>
                        </div>
                        <div className='positions-modal-card__payout-price'>
                            <Text size='xxxs' className='positions-modal-card__payout-label'>
                                {CONTRACT_VALUE}
                            </Text>
                            <Text weight='bold' size='xxs' className='positions-modal-card__payout-value'>
                                <div
                                    className={classNames({
                                        'dc-contract-card--loss': Number(profit) < 0,
                                        'dc-contract-card--profit': Number(profit) > 0,
                                    })}
                                >
                                    <Money amount={is_sold ? sell_price : bid_price} currency={currency} />
                                </div>
                            </Text>
                        </div>
                    </div>

                    <div className={classNames('positions-modal-card__grid-price-payout')}>
                        <div className='positions-modal-card__purchase-price'>
                            <Text size='xxxs' className='positions-modal-card__purchase-label'>
                                {ENTRY_SPOT}
                            </Text>
                            <Text weight='bold' size='xxs' className='positions-modal-card__purchase-value'>
                                {addComma(entry_spot_display_value)}
                            </Text>
                        </div>
                        <div className='positions-modal-card__payout-price'>
                            <Text size='xxxs' className='positions-modal-card__payout-label'>
                                {STRIKE}
                            </Text>
                            <Text weight='bold' size='xxs' className='positions-modal-card__payout-value'>
                                {addComma(barrier)}
                            </Text>
                        </div>
                    </div>

                    {result || !!is_sold ? (
                        <PositionsResultMobile is_visible={!!is_sold} result={result || fallback_result} />
                    ) : (
                        <ProgressSliderMobile
                            className='positions-modal-card__progress'
                            current_tick={current_tick}
                            getCardLabels={getCardLabels}
                            is_loading={is_loading}
                            start_time={date_start}
                            expiry_time={date_expiry}
                            server_time={server_time as moment.Moment}
                            ticks_count={tick_count}
                        />
                    )}
                </div>
                <div className={classNames('positions-modal-card__item', className)}>
                    <div className='dc-contract-card-item__header'>{TOTAL_PROFIT_LOSS}</div>
                    <div
                        className={classNames('dc-contract-card-item__body', {
                            'dc-contract-card-item__body--crypto': isCryptocurrency(currency),
                            'dc-contract-card-item__body--loss': Number(profit) < 0,
                            'dc-contract-card-item__body--profit': Number(profit) > 0,
                        })}
                    >
                        <Money amount={profit} currency={currency} />
                        {!is_sold && (
                            <ArrowIndicator className='dc-contract-card__indicative--movement' value={profit} />
                        )}
                    </div>
                </div>
                <ContractCard.Footer
                    contract_info={contract_info}
                    getCardLabels={getCardLabels}
                    is_multiplier={is_multiplier}
                    is_sell_requested={is_sell_requested}
                    onClickCancel={onClickCancel}
                    onClickSell={onClickSell}
                    server_time={server_time as moment.Moment}
                />
            </React.Fragment>
        );

        const common_card_header = (
            <ContractCard.Header
                contract_info={contract_info}
                display_name={display_name}
                getCardLabels={getCardLabels}
                getContractTypeDisplay={getContractTypeDisplay}
                has_progress_slider={(!is_mobile && has_progress_slider) || is_accumulator}
                is_mobile={is_mobile}
                is_sell_requested={is_sell_requested}
                onClickSell={onClickSell}
                server_time={server_time as moment.Moment}
            />
        );

        const common_card_body = (
            <ContractCard.Body
                addToast={addToast}
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency}
                current_focus={current_focus}
                getCardLabels={getCardLabels}
                getContractById={getContractById}
                is_accumulator={is_accumulator}
                is_mobile={is_mobile}
                is_multiplier={is_multiplier}
                is_positions
                is_sold={!!is_sold}
                is_turbos={is_turbos}
                has_progress_slider={is_mobile && has_progress_slider && !has_ended}
                removeToast={removeToast}
                server_time={server_time as moment.Moment}
                setCurrentFocus={setCurrentFocus}
                should_show_cancellation_warning={should_show_cancellation_warning}
                toggleCancellationWarning={toggleCancellationWarning}
            />
        );

        const common_card_footer = (
            <ContractCard.Footer
                contract_info={contract_info}
                getCardLabels={getCardLabels}
                is_multiplier={is_multiplier}
                is_sell_requested={is_sell_requested}
                onClickCancel={onClickCancel}
                onClickSell={onClickSell}
                server_time={server_time as moment.Moment}
            />
        );

        const common_contract_el = (
            <React.Fragment>
                <ContractCard
                    contract_info={contract_info}
                    getCardLabels={getCardLabels}
                    is_multiplier={is_multiplier}
                    profit_loss={profit_loss}
                    should_show_result_overlay={false}
                >
                    {common_card_header}
                    {common_card_body}
                    {common_card_footer}
                </ContractCard>
            </React.Fragment>
        );

        const contract_el = is_vanilla ? contract_vanilla_el : common_contract_el;

        return (
            <div id={`dt_drawer_card_${id}`} className={classNames('positions-modal-card__wrapper', className)}>
                <BinaryLink
                    onClick={togglePositions}
                    className={classNames('positions-modal-card', 'dc-contract-card', {
                        'positions-modal-card--multiplier': is_multiplier,
                        'dc-contract-card--green': profit_loss > 0,
                        'dc-contract-card--red': profit_loss < 0,
                    })}
                    to={getContractPath(id)}
                >
                    {underlying ? contract_el : loader_el}
                </BinaryLink>
            </div>
        );
    }
);

export default PositionsModalCard;
