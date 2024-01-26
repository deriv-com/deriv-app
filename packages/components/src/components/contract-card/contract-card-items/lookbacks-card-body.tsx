import classNames from 'classnames';
import React from 'react';
import { getDisplayStatus, getCardLabels, isCryptocurrency } from '@deriv/shared';
import ContractCardItem from './contract-card-item';
import Icon from '../../icon';
import MobileWrapper from '../../mobile-wrapper';
import Money from '../../money';
import Text from '../../text';
import { ResultStatusIcon } from '../result-overlay/result-overlay';
import { TGeneralContractCardBodyProps } from './contract-update-form';

type TLookBacksCardBody = Pick<TGeneralContractCardBodyProps, 'contract_info' | 'currency' | 'is_sold'> & {
    progress_slider_mobile_el: React.ReactNode;
    indicative?: number | null;
};

const LookBacksCardBody = ({
    contract_info,
    currency,
    is_sold,
    indicative,
    progress_slider_mobile_el,
}: TLookBacksCardBody) => {
    const { buy_price, contract_type, sell_price, profit, multiplier } = contract_info;

    const { INDICATIVE_PRICE, MULTIPLIER, PROFIT_LOSS, POTENTIAL_PROFIT_LOSS, PAYOUT, PURCHASE_PRICE } =
        getCardLabels();

    const getPayoutLimit = (contract_type?: string, multiplier?: number) => {
        let base: string;
        switch (contract_type) {
            case 'LBFLOATPUT':
                base = 'Hight - Close';
                break;
            case 'LBFLOATCALL':
                base = 'Close - Low';
                break;
            case 'LBHIGHLOW':
                base = 'High - Low';
                break;
            default:
                base = '';
        }
        return `Payout limit: ${multiplier} x (${base})`;
    };
    return (
        <React.Fragment>
            <div className='dc-contract-card-items-wrapper dc-contract-card--lookbacks'>
                <ContractCardItem
                    header={is_sold ? PROFIT_LOSS : POTENTIAL_PROFIT_LOSS}
                    is_crypto={isCryptocurrency(currency)}
                    is_loss={Number(profit) < 0}
                    is_won={Number(profit) > 0}
                >
                    <Money amount={profit} currency={currency} />
                    <div
                        className={classNames('dc-contract-card__indicative--movement', {
                            'dc-contract-card__indicative--movement-complete': is_sold,
                        })}
                    >
                        {/* {status === 'profit' && <Icon icon='IcProfit' />}
                        {status === 'loss' && <Icon icon='IcLoss' />} */}
                    </div>
                </ContractCardItem>
                <ContractCardItem header={is_sold ? PAYOUT : INDICATIVE_PRICE}>
                    <Money currency={currency} amount={Number(sell_price || indicative)} />
                    <div
                        className={classNames('dc-contract-card__indicative--movement', {
                            'dc-contract-card__indicative--movement-complete': is_sold,
                        })}
                    >
                        {/* {status === 'profit' && <Icon icon='IcProfit' />}
                        {status === 'loss' && <Icon icon='IcLoss' />} */}
                    </div>
                </ContractCardItem>
                <ContractCardItem header={PURCHASE_PRICE}>
                    <Money amount={buy_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={MULTIPLIER}>{`x${multiplier}`}</ContractCardItem>
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
            </div>
            <ContractCardItem className='dc-contract-card-item__payout-limit'>
                <Text align='center' line_height='l' size='xxs'>
                    {getPayoutLimit(contract_type, multiplier)}
                </Text>
            </ContractCardItem>
        </React.Fragment>
    );
};

export default React.memo(LookBacksCardBody);
