import classNames            from 'classnames';
import PropTypes             from 'prop-types';
import React, { Component }  from 'react';
import { withRouter }        from 'react-router';
import { Icon, IconBack }    from 'Assets/Common';
import Localize              from 'App/Components/Elements/localize.jsx';
import { UnderlyingIcon }    from 'App/Components/Elements/underlying-icon.jsx';
import ContractAudit         from 'App/Components/Elements/PositionsDrawer/result-details.jsx';
import ContractTypeCell      from 'App/Components/Elements/PositionsDrawer/contract-type-cell.jsx';
import ProgressSlider        from 'App/Components/Elements/PositionsDrawer/ProgressSlider';
import { getTimePercentage } from 'App/Components/Elements/PositionsDrawer/helpers';
import ProfitLossCardContent from 'Modules/Reports/Components/profit-loss-card-content.jsx';
import ContractCardBody      from './contract-card-body.jsx';
import ContractCardFooter    from './contract-card-footer.jsx';
import ContractCardHeader    from './contract-card-header.jsx';
import ContractCard          from './contract-card.jsx';

import {
    getCurrentTick,
    getDurationPeriod,
    getDurationTime,
    getDurationUnitText }    from '../../../../Stores/Modules/Portfolio/Helpers/details';
import {
    getIndicativePrice,
    getEndTime,
    isUserSold }             from '../../../../Stores/Modules/Contract/Helpers/logic';
import Money                 from '../money.jsx';

class ContractDrawer extends Component {
    state = {
        is_shade_on: false,
    }

    handleShade = (shade) => {
        this.setState({ is_shade_on: shade });
    }

    getBodyContent () {
        const {
            buy_price,
            currency,
            exit_tick,
            is_sold,
            profit,
        } = this.props.contract_info;
        const { contract_info } = this.props;
        const exit_spot = isUserSold(contract_info) ? '-' : exit_tick;
        const percentage = getTimePercentage(
            this.props.server_time,
            contract_info.purchase_time,
            contract_info.date_expiry,
        );
        const getTick = () => {
            if (!contract_info.tick_count) return null;
            let current_tick = getCurrentTick(contract_info);
            current_tick = (current_tick > getCurrentTick(contract_info)) ?
                current_tick : getCurrentTick(contract_info);
            return current_tick;
        };

        return (
            <ContractCard contract_info={contract_info}>
                <ContractCardHeader>
                    <div className={classNames(
                        'contract-card__grid',
                        'contract-card__grid-underlying-trade'
                    )}
                    >
                        <div className='contract-card__underlying-name'>
                            <UnderlyingIcon market={contract_info.underlying} />
                            <span className='contract-card__symbol'>
                                {contract_info.display_name}
                            </span>
                        </div>
                        <div className='contract-card__type'>
                            <ContractTypeCell type={contract_info.contract_type} />
                        </div>
                    </div>
                </ContractCardHeader>
                <ProgressSlider
                    is_loading={false}
                    remaining_time={contract_info.date_expiry}
                    percentage={percentage}
                    current_tick={getTick()}
                    ticks_count={contract_info.tick_count}
                    has_result={!!(is_sold)}
                />
                <ContractCardBody>
                    <ProfitLossCardContent
                        pl_value={+profit}
                        payout={getIndicativePrice(contract_info)}
                        currency={currency}
                        is_sold={!!(is_sold)}
                        status={this.props.status}
                    />
                </ContractCardBody>
                <ContractCardFooter>
                    <div className='purchase-price-container'>
                        <Localize str='Purchase Price:' />&nbsp;
                        <span className='purchase-price' >
                            <Money
                                currency={currency}
                                amount={buy_price}
                            />
                        </span>
                    </div>
                    <ContractAudit
                        contract_info={contract_info}
                        contract_end_time={getEndTime(contract_info)}
                        is_open={true}
                        is_shade_visible={this.handleShade}
                        duration={getDurationTime(contract_info)}
                        duration_unit={getDurationUnitText(getDurationPeriod(contract_info))}
                        exit_spot={exit_spot}
                        has_result={!!(is_sold)}
                    />
                </ContractCardFooter>
            </ContractCard>
        );
    }

    render() {
        if (!this.props.contract_info) return null;
        const body_content = this.getBodyContent();
        return (
            <div className={classNames('contract-drawer', {})}>
                <div
                    className='contract-drawer__heading'
                    onClick={() => this.props.history.goBack()}
                >
                    <Icon icon={IconBack} />
                    <h2><Localize str={this.props.heading || 'Contract'} /></h2>
                </div>
                <div className='contract-drawer__body'>{body_content}</div>
            </div>
        );
    }
}

ContractDrawer.propTypes = {
    contract_info: PropTypes.object,
    heading      : PropTypes.string,
    server_time  : PropTypes.object,
    status       : PropTypes.string,
};

export default withRouter(ContractDrawer);
