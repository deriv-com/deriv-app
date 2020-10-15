import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { ContractCard, Icon, Money, ProgressSliderMobile } from '@deriv/components';
import {
    getContractPath,
    isMultiplierContract,
    isHighLow,
    isCryptocurrency,
    hasContractEntered,
    isOpen,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import { BinaryLink } from 'App/Components/Routes';
import CurrencyBadge from 'App/Components/Elements/currency-badge.jsx';
import { connect } from 'Stores/connect';
import { connectWithContractUpdate } from 'Stores/Modules/Contract/Helpers/multiplier';
import { PositionsCardLoader } from 'App/Components/Elements/ContentLoader';
import { getContractTypeDisplay, getCardLabels } from 'Constants/contract';
import ResultMobile from './result-mobile.jsx';

const PositionsModalCard = ({
    addToast,
    className,
    contract_info,
    contract_update,
    currency,
    current_tick,
    getContractById,
    id,
    indicative,
    is_loading,
    is_mobile,
    is_sell_requested,
    is_unsupported,
    onClickRemove,
    onClickSell,
    profit_loss,
    onClickCancel,
    removeToast,
    result,
    sell_price,
    server_time,
    setCurrentFocus,
    should_show_cancellation_warning,
    status,
    toggleCancellationWarning,
    togglePositions,
    toggleUnsupportedContractModal,
    type,
}) => {
    const loader_el = (
        <div className='positions-modal-card__content-loader'>
            <PositionsCardLoader speed={2} />
        </div>
    );
    const is_multiplier = isMultiplierContract(contract_info.contract_type);
    const fallback_result = profit_loss >= 0 ? 'won' : 'lost';

    const should_show_sell = hasContractEntered(contract_info) && isOpen(contract_info);

    const contract_options_el = (
        <React.Fragment>
            <div className={classNames('positions-modal-card__grid', 'positions-modal-card__grid-header')}>
                <div className='positions-modal-card__underlying-name'>
                    <Icon
                        icon={contract_info.underlying ? `IcUnderlying${contract_info.underlying}` : 'IcUnknown'}
                        size={34}
                    />
                    <span className='positions-modal-card__symbol'>{contract_info.display_name}</span>
                </div>
                <div className='positions-modal-card__type'>
                    <ContractCard.ContractTypeCell
                        getContractTypeDisplay={getContractTypeDisplay}
                        is_high_low={isHighLow({ shortcode: contract_info.shortcode })}
                        multiplier={contract_info.multiplier}
                        type={type}
                    />
                </div>
                <CSSTransition
                    in={should_show_sell}
                    timeout={250}
                    classNames={{
                        enter: 'positions-modal-card__sell-button--enter',
                        enterDone: 'positions-modal-card__sell-button--enter-done',
                        exit: 'positions-modal-card__sell-button--exit',
                    }}
                    unmountOnExit
                >
                    <div className='positions-modal-card__sell-button'>
                        <ContractCard.Sell
                            contract_info={contract_info}
                            is_sell_requested={is_sell_requested}
                            getCardLabels={getCardLabels}
                            onClickSell={onClickSell}
                        />
                    </div>
                </CSSTransition>
            </div>
            <CurrencyBadge currency={contract_info?.currency ?? ''} />
            <div className={classNames('positions-modal-card__grid', 'positions-modal-card__grid-body')}>
                <div className={classNames('positions-modal-card__grid-profit-payout')}>
                    <div
                        className={classNames(
                            'positions-modal-card__profit-loss',
                            'positions-modal-card__profit-loss-label'
                        )}
                    >
                        {result ? localize('Profit/Loss:') : localize('Potential profit/loss:')}
                    </div>
                    <div
                        className={classNames(
                            'positions-modal-card__indicative',
                            'positions-modal-card__indicative-label'
                        )}
                    >
                        {!result ? localize('Indicative price:') : localize('Payout:')}
                    </div>
                    <div
                        className={classNames('positions-modal-card__profit-loss', {
                            'positions-modal-card__profit-loss--is-crypto': isCryptocurrency(currency),
                            'positions-modal-card__profit-loss--negative': profit_loss < 0,
                            'positions-modal-card__profit-loss--positive': profit_loss > 0,
                        })}
                    >
                        <Money amount={Math.abs(profit_loss)} currency={currency} />
                        <div
                            className={classNames('positions-modal-card__indicative--movement', {
                                'positions-modal-card__indicative--movement-complete': !!result,
                            })}
                        >
                            {status === 'profit' && <Icon icon='IcProfit' />}
                            {status === 'loss' && <Icon icon='IcLoss' />}
                        </div>
                    </div>
                    <div className='positions-modal-card__indicative'>
                        <Money amount={sell_price || indicative} currency={currency} />
                        <div
                            className={classNames('positions-modal-card__indicative--movement', {
                                'positions-modal-card__indicative--movement-complete': !!result,
                            })}
                        >
                            {status === 'profit' && <Icon icon='IcProfit' />}
                            {status === 'loss' && <Icon icon='IcLoss' />}
                        </div>
                    </div>
                </div>
                <div className={classNames('positions-modal-card__grid-price-payout')}>
                    <div className='positions-modal-card__purchase-price'>
                        <span className='positions-modal-card__purchase-label'>{localize('Purchase price:')}</span>
                        <span className='positions-modal-card__purchase-value'>
                            <Money amount={contract_info.buy_price} currency={currency} />
                        </span>
                    </div>
                    <div className='positions-modal-card__payout-price'>
                        <span className='positions-modal-card__payout-label'>{localize('Potential payout:')}</span>
                        <span className='positions-modal-card__payout-value'>
                            {contract_info.payout ? (
                                <Money amount={contract_info.payout} currency={currency} />
                            ) : (
                                <strong>-i</strong>
                            )}
                        </span>
                    </div>
                </div>

                {result || !!contract_info.is_sold ? (
                    <ResultMobile
                        contract_id={id}
                        is_unsupported={is_unsupported}
                        is_visible={!!contract_info.is_sold}
                        onClickRemove={onClickRemove}
                        onClick={() => toggleUnsupportedContractModal(true)}
                        result={result || fallback_result}
                    />
                ) : (
                    <ProgressSliderMobile
                        className='positions-modal-card__progress'
                        current_tick={current_tick}
                        getCardLabels={getCardLabels}
                        is_loading={is_loading}
                        start_time={contract_info.date_start}
                        expiry_time={contract_info.date_expiry}
                        server_time={server_time}
                        ticks_count={contract_info.tick_count}
                    />
                )}
            </div>
        </React.Fragment>
    );

    const card_multiplier_header = (
        <ContractCard.Header
            contract_info={contract_info}
            getCardLabels={getCardLabels}
            getContractTypeDisplay={getContractTypeDisplay}
            has_progress_slider={!is_multiplier}
            is_mobile={is_mobile}
            is_sell_requested={is_sell_requested}
            onClickSell={onClickSell}
            server_time={server_time}
        />
    );

    const card_multiplier_body = (
        <div className={'dc-contract-card__separatorclass'}>
            <ContractCard.Body
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency}
                getCardLabels={getCardLabels}
                is_mobile={is_mobile}
                is_multiplier={is_multiplier}
                status={status}
                server_time={server_time}
            />
        </div>
    );

    const card_multiplier_footer = (
        <ContractCard.Footer
            addToast={addToast}
            connectWithContractUpdate={connectWithContractUpdate}
            contract_info={contract_info}
            getCardLabels={getCardLabels}
            getContractById={getContractById}
            is_multiplier={is_multiplier}
            is_sell_requested={is_sell_requested}
            onClickCancel={onClickCancel}
            onClickSell={onClickSell}
            removeToast={removeToast}
            setCurrentFocus={setCurrentFocus}
            server_time={server_time}
            should_show_cancellation_warning={should_show_cancellation_warning}
            status={status}
            toggleCancellationWarning={toggleCancellationWarning}
        />
    );

    const contract_multiplier_el = (
        <React.Fragment>
            <ContractCard
                contract_info={contract_info}
                getCardLabels={getCardLabels}
                is_multiplier={is_multiplier}
                profit_loss={profit_loss}
                should_show_result_overlay={false}
            >
                {card_multiplier_header}
                <CurrencyBadge currency={contract_info?.currency ?? ''} />
                {card_multiplier_body}
                {card_multiplier_footer}
            </ContractCard>
        </React.Fragment>
    );

    const contract_el = is_multiplier ? contract_multiplier_el : contract_options_el;

    return (
        <div id={`dt_drawer_card_${id}`} className={classNames('positions-modal-card__wrapper', className)}>
            {is_unsupported ? (
                <div
                    className={classNames('positions-modal-card')}
                    onClick={() => toggleUnsupportedContractModal(true)}
                >
                    {contract_info.underlying ? contract_el : loader_el}
                </div>
            ) : (
                <React.Fragment>
                    <BinaryLink
                        onClick={togglePositions}
                        className={classNames('positions-modal-card', {
                            'positions-modal-card--multiplier': is_multiplier,
                        })}
                        to={getContractPath(id)}
                    >
                        {contract_info.underlying ? contract_el : loader_el}
                    </BinaryLink>
                </React.Fragment>
            )}
        </div>
    );
};

PositionsModalCard.propTypes = {
    className: PropTypes.string,
    contract_info: PropTypes.object,
    currency: PropTypes.string,
    current_tick: PropTypes.number,
    duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    duration_unit: PropTypes.string,
    exit_spot: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    id: PropTypes.number,
    indicative: PropTypes.number,
    is_loading: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    is_unsupported: PropTypes.bool,
    is_valid_to_sell: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClickRemove: PropTypes.func,
    onClickSell: PropTypes.func,
    onClickCancel: PropTypes.func,
    profit_loss: PropTypes.number,
    result: PropTypes.string,
    sell_time: PropTypes.number,
    server_time: PropTypes.object,
    setCurrentFocus: PropTypes.func,
    status: PropTypes.string,
    togglePositions: PropTypes.func,
    toggleUnsupportedContractModal: PropTypes.func,
    type: PropTypes.string,
};

export default connect(({ common, ui, modules }) => ({
    addToast: ui.addToast,
    getContractById: modules.contract_trade.getContractById,
    is_mobile: ui.is_mobile,
    removeToast: ui.removeToast,
    server_time: common.server_time,
    setCurrentFocus: ui.setCurrentFocus,
    should_show_cancellation_warning: ui.should_show_cancellation_warning,
    toggleCancellationWarning: ui.toggleCancellationWarning,
    updateLimitOrder: modules.contract_trade.updateLimitOrder,
}))(PositionsModalCard);
