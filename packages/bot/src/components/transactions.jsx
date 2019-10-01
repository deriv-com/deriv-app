// import className from 'classnames';
import { Money } from 'deriv-components';
import { PropTypes } from 'prop-types';
import React from 'react';
import { Scrollbars } from 'tt-react-custom-scrollbars';
import {
    IdIcon,
    ExitSpotIcon,
    EntrySpotIcon,
} from './Icons.jsx';
import IconTradeType from './icon-trade-types.jsx';
import { connect } from '../stores/connect';
import { translate } from '../utils/tools';
import '../assets/sass/transactions.scss';

const Transaction = ({ contract }) => {
    return (
        <table className='transactions__item'>
            <tbody>
                <tr className='transactions__tr'>
                    <td className='transactions__middle transactions__td'>
                        <IconTradeType className='transactions__inline transactions__top' trade_type={contract.contract_type} />

                        <div className='transactions__inline transactions__middle'>
                            <div>
                                <IdIcon className='transactions__inline transactions__middle' />
                                <div className='transactions__inline transactions__middle'>{contract.refrence_id}</div>
                            </div>
                            <div>
                                <IdIcon className='transactions__inline transactions__middle' />
                                <Money amount={Math.abs(contract.buy_price)} currency={contract.currency} />
                            </div>
                        </div>
                    </td>
                    <td className='transactions__middle transactions__td'>
                        <div>
                            <EntrySpotIcon className='transactions__inline transactions__middle' />
                            <div className='transactions__inline transactions__middle'>{contract.entry_spot}</div>
                        </div>
                        <div>
                            <ExitSpotIcon className='transactions__inline transactions__middle' />
                            <div className='transactions__inline transactions__middle'>{contract.exit_spot}</div>
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
