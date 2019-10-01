// import className from 'classnames';
import { Money,Popover } from 'deriv-components';
import { PropTypes }     from 'prop-types';
import React             from 'react';
import { Scrollbars }    from 'tt-react-custom-scrollbars';
import {
    IdIcon,
    ExitSpotIcon,
    EntrySpotIcon,
}                        from './Icons.jsx';
import IconTradeType     from './icon-trade-types.jsx';
import { connect }       from '../stores/connect';
import { translate }     from '../utils/tools';
import '../assets/sass/transactions.scss';

const Transaction = ({ contract }) => {
    return (
        <table className='transactions__item'>
            <tbody>
                <tr className='transactions__tr'>
                    <td className='transactions__middle transactions__td'>
                        <Popover
                            className='transactions__inline transactions__top'
                            alignment='left'
                            message={translate(contract.contract_type)}
                        >
                            <IconTradeType
                                trade_type={contract.contract_type}
                            />
                        </Popover>
                        <div className='transactions__inline transactions__middle'>
                            <div>
                                <Popover
                                    className='transactions__inline transactions__middle'
                                    alignment='left'
                                    message={translate('Refrence Id')}
                                >
                                    <IdIcon className='transactions__middle' />
                                </Popover>
                                <div className='transactions__inline transactions__middle'>
                                    {contract.refrence_id}
                                </div>
                            </div>
                            <div>
                                <Popover
                                    className='transactions__inline transactions__middle'
                                    alignment='left'
                                    message={translate('Buy price')}
                                >
                                    <IdIcon className='transactions__middle' />
                                </Popover>

                                <Money
                                    amount={Math.abs(contract.buy_price)}
                                    currency={contract.currency}
                                />
                            </div>
                        </div>
                    </td>
                    <td className='transactions__middle transactions__td'>
                        <div>
                            <Popover
                                className='transactions__inline transactions__middle'
                                alignment='left'
                                message={translate('Entry spot')}
                            >
                                <EntrySpotIcon className='transactions__middle' />
                            </Popover>
                            <div className='transactions__inline transactions__middle'>
                                {contract.entry_spot}
                            </div>
                        </div>
                        <div>
                            <Popover
                                className='transactions__inline transactions__middle'
                                alignment='left'
                                message={translate('Exit spot')}
                            >
                                <ExitSpotIcon className='transactions__middle' />
                            </Popover>
                            <div className='transactions__inline transactions__middle'>
                                {contract.exit_spot}
                            </div>
                        </div>
                    </td>
                    <td className='transactions__td'>
                        <div
                            className='transactions__inline
                        transactions__middle
                        transactions__green'
                        >
                            <Money
                                amount={Math.abs(contract.profit)}
                                currency={contract.currency}
                            />
                        </div>
                       
                    </td>
                    <td className='transactions__td'>
                        <EntrySpotIcon />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

class Transactions extends React.PureComponent {
    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        const { contracts } = this.props;

        return (
            <div className='transactions'>
                <div className='transactions__header'>
                    <span className='transactions__header--col'>{translate('Trade information')}</span>
                    <span className='transactions__header--col'>{translate('Entry/Exit spot')}</span>
                    <span className='transactions__header--col'>{translate('Profit/Loss')}</span>
                </div>
                <div className='transactions__content'>
                    <Scrollbars
                        autoHide
                        style={{ height: 'calc(100vh - 283px)' }}
                    >
                        {
                            contracts.map((contract, index) => {
                                return <Transaction
                                    key={`${contract.refrence_id}${index}`}
                                    contract={contract}
                                />;
                            })
                        }
                    </Scrollbars>
                </div>
            </div>
        );
    }
}

Transactions.protoTypes = {
    contracts: PropTypes.array,
    onUnmount: PropTypes.func,
};

export default connect(({ transactions }) => ({
    contracts: transactions.contracts,
    onUnmount: transactions.onUnmount,
}))(Transactions);
