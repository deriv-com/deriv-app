import className               from 'classnames';
import {
    Money,
    Popover }                  from 'deriv-components';
import React                   from 'react';
import { localize }            from 'deriv-translations/lib/i18n';
import {
    BuyPriceIcon,
    CompletedIcon,
    ExitSpotIcon,
    EntrySpotIcon,
    ReferenceIdIcon,
    StartTimeIcon,
    PendingIcon }              from './Icons.jsx';
import IconTradeType           from './icon-trade-types.jsx';
import { getContractTypeName } from '../utils/contract';

const Transaction = ({ contract }) => {
    return (
        <div className='transactions__item'>
            <div className='transactions__cell transactions__trade-type'>
                <Popover
                    className='transactions__icon transactions__top'
                    alignment='left'
                    message={getContractTypeName(contract)}
                >
                    <IconTradeType trade_type={contract.contract_type} />
                </Popover>
            </div>
            <div className='transactions__cell transactions__reference'>
                <Popover
                    className='transactions__icon'
                    alignment='left'
                    message={localize('Reference ID')}
                >
                    <ReferenceIdIcon />
                </Popover>
                {contract.reference_id}
            </div>
            <div className='transactions__cell transactions__buy-price'>
                <Popover
                    className='transactions__icon'
                    alignment='left'
                    message={localize('Buy price')}
                >
                    <BuyPriceIcon className='transactions__middle' />
                </Popover>
                <Money
                    amount={contract.buy_price}
                    currency={contract.currency}
                />
            </div>
            <div className='transactions__cell transactions__start-time'>
                <Popover
                    className='transactions__icon'
                    alignment='left'
                    message={localize('Start time')}
                >
                    <StartTimeIcon />
                </Popover>
                {contract.date_start}
            </div>
            <div className='transactions__cell transactions__entry-spot'>
                <Popover
                    className='transactions__icon'
                    alignment='left'
                    message={localize('Entry spot')}
                >
                    <EntrySpotIcon />
                </Popover>
                {contract.entry_spot}
            </div>
            <div className='transactions__cell transactions__exit-spot'>
                <Popover
                    className='transactions__icon'
                    alignment='left'
                    message={localize('Exit spot')}
                >
                    <ExitSpotIcon />
                </Popover>
                {contract.exit_spot}
            </div>
            <div className='transactions__cell transactions__profit'>
                {contract.profit &&
                    <div className={className({
                        'transactions__profit--win' : contract.profit > 0,
                        'transactions__profit--loss': contract.profit < 0,
                    })}
                    >
                        <Money
                            amount={Math.abs(contract.profit)}
                            currency={contract.currency}
                        />
                    </div>
                }
            </div>
            <div className='transactions__cell transactions__settlement'>
                { contract.is_completed ?
                    <Popover
                        className='transactions__icon'
                        alignment='left'
                        message={localize('Completed')}
                    >
                        <CompletedIcon />
                    </Popover>
                    :
                    <Popover
                        className='transactions__icon'
                        alignment='left'
                        message={localize('Pending')}
                    >
                        <PendingIcon />
                    </Popover>
                }
            </div>
        </div>
    );
};

export default Transaction;
