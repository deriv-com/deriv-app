import classNames              from 'classnames';
import PropTypes               from 'prop-types';
import React, { Component }    from 'react';
import { withRouter }          from 'react-router';
import { CSSTransition }       from 'react-transition-group';
import {
    Button,
    ContractAudit,
    Icon,
    Money }                    from '@deriv/components';
import { localize, Localize }  from '@deriv/translations';
import ContractUtils           from '@deriv/shared/utils/contract';
import DateTimeUtils           from '@deriv/shared/utils/date-time';
import PortfolioUtils          from '@deriv/shared/utils/portfolio';
import PositionsUtils          from '@deriv/shared/utils/positions';
import routes                  from 'Constants/routes';
import { PositionsCardLoader } from 'App/Components/Elements/ContentLoader';
import ContractTypeCell        from 'App/Components/Elements/PositionsDrawer/contract-type-cell.jsx';
import ProgressSlider          from 'App/Components/Elements/PositionsDrawer/ProgressSlider';
import ProfitLossCardContent   from 'Modules/Reports/Components/profit-loss-card-content.jsx';
import Shortcode               from 'Modules/Reports/Helpers/shortcode';
import ContractCardBody        from './contract-card-body.jsx';
import ContractCardFooter      from './contract-card-footer.jsx';
import ContractCardHeader      from './contract-card-header.jsx';
import ContractCard            from './contract-card.jsx';

class ContractDrawer extends Component {
    state = {
        is_shade_on: false,
    };

    handleShade = (shade) => {
        this.setState({ is_shade_on: shade });
    };

    redirectBackToReports = () => this.props.history.push(routes.reports);

    getBodyContent () {
        const {
            buy_price,
            currency,
            exit_tick_display_value,
            is_sold,
            payout,
            profit,
        } = this.props.contract_info;
        const {
            contract_info,
            is_sell_requested,
            onClickSell,
        } = this.props;
        const exit_spot = ContractUtils.isUserSold(contract_info) ? '-' : exit_tick_display_value;
        const getTick = () => {
            if (!contract_info.tick_count) return null;
            let current_tick = PortfolioUtils.getCurrentTick(contract_info);
            current_tick = (current_tick > PortfolioUtils.getCurrentTick(contract_info))
                ? current_tick
                : PortfolioUtils.getCurrentTick(contract_info);
            return current_tick;
        };

        const duration          = PortfolioUtils.getDurationTime(contract_info);
        const duration_unit     = PortfolioUtils.getDurationUnitText(PortfolioUtils.getDurationPeriod(contract_info));
        const contract_end_time = ContractUtils.getEndTime(contract_info);
        const is_profit         = (contract_info.profit >= 0);
        const IconExitTime      = <Icon icon='IcContractExitTime' color={is_profit ? 'green' : 'red'} size={24} />;
        const is_valid_to_sell  = ContractUtils.isValidToSell(contract_info);

        return (
            <React.Fragment>
                <ContractCard
                    contract_info={contract_info}
                    profit_loss={+profit}
                    is_sold={!!(is_sold)}
                >
                    <ContractCardHeader>
                        <div className={classNames(
                            'contract-card__grid',
                            'contract-card__grid-underlying-trade'
                        )}
                        >
                            <div id='dt_underlying_label' className='contract-card__underlying-name'>
                                <Icon icon={contract_info.underlying ? `IcUnderlying${contract_info.underlying}` : 'IcUnknown'} width={40} height={34} />
                                <span className='contract-card__symbol'>
                                    {contract_info.display_name}
                                </span>
                            </div>
                            <div id='dt_contract_type_label' className='contract-card__type'>
                                <ContractTypeCell
                                    type={contract_info.contract_type}
                                    is_high_low={Shortcode.isHighLow({ shortcode: contract_info.shortcode })}
                                />
                            </div>
                        </div>
                    </ContractCardHeader>
                    {is_sold ?
                        <div className='progress-slider--completed' />
                        :
                        <ProgressSlider
                            is_loading={false}
                            start_time={contract_info.purchase_time}
                            expiry_time={contract_info.date_expiry}
                            current_tick={getTick()}
                            ticks_count={contract_info.tick_count}
                        />
                    }
                    <ContractCardBody>
                        <ProfitLossCardContent
                            pl_value={+profit}
                            payout={ContractUtils.getIndicativePrice(contract_info)}
                            currency={currency}
                            is_sold={!!(is_sold)}
                            status={this.props.status}
                        />
                    </ContractCardBody>
                    <ContractCardFooter>
                        <div className='contract-card__footer-wrapper'>
                            <div className='purchase-price-container'>
                                <span className='purchase-price__label'>
                                    {localize('Purchase price:')}
                                </span>
                                <span id='dt_purchase_price_label' className='purchase-price__value' >
                                    <Money
                                        currency={currency}
                                        amount={buy_price}
                                    />
                                </span>
                            </div>
                            <div className='potential-payout-container'>
                                <span className='potential-payout__label'>
                                    {localize('Potential payout:')}
                                </span>
                                <span id='dt_potential_payout_label' className='potential-payout-price__value' >
                                    <Money
                                        currency={currency}
                                        amount={payout}
                                    />
                                </span>
                            </div>
                        </div>
                        <CSSTransition
                            in={!!is_valid_to_sell}
                            timeout={250}
                            classNames={{
                                enter    : 'contract-card__sell-button--enter',
                                enterDone: 'contract-card__sell-button--enter-done',
                                exit     : 'contract-card__sell-button--exit',
                            }}
                            unmountOnExit
                        >
                            <div
                                className='contract-card__sell-button'
                            >
                                <Button
                                    className={classNames(
                                        'btn--sell', {
                                            'btn--loading': is_sell_requested,
                                        })}
                                    is_disabled={!is_valid_to_sell || is_sell_requested}
                                    text={localize('Sell contract')}
                                    onClick={() => onClickSell(contract_info.contract_id)}
                                    secondary
                                />
                            </div>
                        </CSSTransition>
                    </ContractCardFooter>
                </ContractCard>

                <ContractAudit should_add_scrollbars is_contract_sellable={is_valid_to_sell}>
                    <ContractAudit.Item
                        id='dt_id_label'
                        icon={<Icon icon='IcContractId' size={24} />}
                        label={localize('Reference ID')}
                        value={localize('{{buy_value}} (Buy)', { buy_value: contract_info.transaction_ids.buy })}
                        value2={contract_info.transaction_ids.sell
                            ? localize('{{sell_value}} (Sell)', { sell_value: contract_info.transaction_ids.sell })
                            : <ContractAudit.Loader />
                        }
                    />
                    <ContractAudit.Item
                        id='dt_duration_label'
                        icon={<Icon icon='IcContractDuration' size={24} />}
                        label={localize('Duration')}
                        value={(contract_info.tick_count > 0)
                            ? `${contract_info.tick_count} ${(contract_info.tick_count < 2) ? localize('tick') : localize('ticks')}`
                            : `${duration} ${duration_unit}`}
                    />
                    <ContractAudit.Item
                        id='dt_bt_label'
                        icon={
                            <Icon
                                icon={PositionsUtils.isDigitType(contract_info.contract_type) ? 'IcContractTarget' : 'IcContractBarrier'}
                                size={24}
                            />
                        }
                        label={PositionsUtils.getBarrierLabel(contract_info)}
                        value={contract_info.barrier
                            ? PositionsUtils.getBarrierValue(contract_info)
                            : <ContractAudit.Loader />
                        }
                    />
                    <ContractAudit.Item
                        id='dt_start_time_label'
                        icon={<Icon icon='IcContractStartTime' size={24} />}
                        label={localize('Start time')}
                        value={contract_info.purchase_time
                            ? DateTimeUtils.toGMTFormat(DateTimeUtils.epochToMoment(contract_info.purchase_time))
                            : <ContractAudit.Loader />
                        }
                    />
                    { !PositionsUtils.isDigitType(contract_info.contract_type) &&
                        <ContractAudit.Item
                            id='dt_entry_spot_label'
                            icon={<Icon icon='IcContractEntrySpot' size={24} />}
                            label={localize('Entry spot')}
                            value={contract_info.entry_spot_display_value || <ContractAudit.Loader />}
                            value2={contract_info.entry_tick_time
                                ? DateTimeUtils.toGMTFormat(DateTimeUtils.epochToMoment(contract_info.entry_tick_time))
                                : <ContractAudit.Loader />
                            }
                        />
                    }
                    { !isNaN(exit_spot) &&
                        <ContractAudit.Item
                            id='dt_exit_spot_label'
                            icon={<Icon icon='IcContractExitSpot' size={24} />}
                            label={localize('Exit spot')}
                            value={exit_spot || <ContractAudit.Loader />}
                            value2={contract_info.exit_tick_time
                                ? DateTimeUtils.toGMTFormat(DateTimeUtils.epochToMoment(contract_info.exit_tick_time))
                                : <ContractAudit.Loader />
                            }
                        />
                    }
                    <ContractAudit.Item
                        id='dt_exit_time_label'
                        icon={IconExitTime}
                        label={localize('Exit Time')}
                        value={
                            contract_end_time
                                ? DateTimeUtils.toGMTFormat(DateTimeUtils.epochToMoment(contract_end_time))
                                : <ContractAudit.Loader />
                        }
                    />
                </ContractAudit>
            </React.Fragment>
        );
    }

    redirectBackToReports = () => {
        // history.goBack() will go to the wrong location if user goes to contract by pasting it in the url.
        if (this.props.history.location.state) {
            this.props.history.goBack();
        } else {
            this.props.history.push(routes.reports);
        }
    };

    render() {
        if (!this.props.contract_info) return null;
        const body_content = (
            <React.Fragment>
                {(this.props.contract_info.status) ?
                    this.getBodyContent()
                    :
                    <div className='contract-card'>
                        <PositionsCardLoader
                            is_dark_theme={this.props.is_dark_theme}
                            speed={2}
                        />
                    </div>
                }
            </React.Fragment>
        );
        return (
            <div id='dt_contract_drawer' className={classNames('contract-drawer', {})}>
                <div className='contract-drawer__heading'>
                    {
                        this.props.is_from_reports &&
                        <div
                            className='contract-drawer__heading-btn'
                            onClick={this.redirectBackToReports}
                        >
                            <Icon
                                icon='IcArrowLeftBold'
                            />
                        </div>
                    }
                    <h2><Localize i18n_default_text='Contract details' /></h2>
                </div>
                <div className='contract-drawer__body'>{body_content}</div>
            </div>
        );
    }
}

ContractDrawer.propTypes = {
    contract_info    : PropTypes.object,
    is_dark_theme    : PropTypes.bool,
    is_from_reports  : PropTypes.bool,
    is_sell_requested: PropTypes.bool,
    onClickSell      : PropTypes.func,
    status           : PropTypes.string,
};

export default withRouter(ContractDrawer);
