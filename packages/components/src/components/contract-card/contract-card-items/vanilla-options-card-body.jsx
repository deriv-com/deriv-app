import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { getDisplayStatus, isCryptocurrency } from '@deriv/shared';
import DesktopWrapper from '../../desktop-wrapper';
import MobileWrapper from '../../mobile-wrapper';
import ContractCardItem from './contract-card-item.jsx';
import Icon from '../../icon';
import Money from '../../money';
import { ResultStatusIcon } from '../result-overlay/result-overlay.jsx';

const VanillaOptionsCardBody = ({ contract_info, currency, getCardLabels, is_sold, progress_slider, status }) => {
    const { buy_price, bid_price, entry_spot_display_value, barrier, sell_price, profit } = contract_info;
    const contract_value = is_sold ? sell_price : bid_price;
    const { CONTRACT_VALUE, ENTRY_SPOT, PURCHASE_PRICE, STRIKE, TOTAL_PROFIT_LOSS } = getCardLabels();

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='dc-contract-card-items-wrapper'>
                    <ContractCardItem header={PURCHASE_PRICE}>
                        <Money amount={buy_price} currency={currency} />
                    </ContractCardItem>

                    <ContractCardItem header={CONTRACT_VALUE}>
                        <Money amount={contract_value} currency={currency} />
                    </ContractCardItem>

                    <ContractCardItem header={ENTRY_SPOT}>
                        <Money amount={entry_spot_display_value} />
                    </ContractCardItem>

                    <ContractCardItem header={STRIKE}>
                        <Money amount={barrier} />
                    </ContractCardItem>
                </div>
                <ContractCardItem
                    className='dc-contract-card-item__total-profit-loss'
                    header={TOTAL_PROFIT_LOSS}
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
            </DesktopWrapper>
            <MobileWrapper>
                <div className='dc-contract-card-items-wrapper--mobile'>
                    <div className='dc-contract-card-items-wrapper-group'>
                        <ContractCardItem header={PURCHASE_PRICE}>
                            <Money amount={buy_price} currency={currency} />
                        </ContractCardItem>

                        <ContractCardItem header={ENTRY_SPOT}>
                            <Money amount={entry_spot_display_value} currency={currency} />
                        </ContractCardItem>
                    </div>

                    <div className='dc-contract-card-items-wrapper-group'>
                        <ContractCardItem header={CONTRACT_VALUE}>
                            <Money amount={contract_value} currency={currency} />
                        </ContractCardItem>

                        <ContractCardItem header={STRIKE}>
                            <Money amount={barrier} currency={currency} />
                        </ContractCardItem>
                    </div>

                    {is_sold ? (
                        <ResultStatusIcon
                            getCardLabels={getCardLabels}
                            is_contract_won={getDisplayStatus(contract_info) === 'won'}
                        />
                    ) : (
                        progress_slider
                    )}
                    <ContractCardItem
                        className='dc-contract-card-item__total-profit-loss'
                        header={TOTAL_PROFIT_LOSS}
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
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
};

VanillaOptionsCardBody.propTypes = {
    contract_info: PropTypes.object,
    currency: PropTypes.string,
    getCardLabels: PropTypes.func,
    is_sold: PropTypes.bool,
    progress_slider: PropTypes.node,
    status: PropTypes.string,
};

export default React.memo(VanillaOptionsCardBody);
