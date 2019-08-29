import PropTypes    from 'prop-types';
import React        from 'react';
import Icon         from 'Assets/icon.jsx';
import { localize } from 'App/i18n';
import Money        from 'App/Components/Elements/money.jsx';

class IndicativeCell extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            movement: null,
            amount  : 0,
        };
    }

    componentDidUpdate(prevProps) {
        this.setState(() => ({
            movement: prevProps.amount >= this.state.amount ? 'profit' : 'loss',
            amount  : prevProps.amount,
        }));
    }

    render() {
        const { amount, currency, status } = this.props;
        const { movement } = this.state;
        const IconProfitLoss = movement === 'profit' ? <Icon icon='IconProfit' /> : <Icon icon='IconLoss' />;
        return (
            <div className='open-positions__indicative' >
                <div className='open-positions__indicative--amount'>
                    <Money amount={Math.abs(amount)} currency={currency} />
                    {status !== 'no-resale' && amount !== 0 && IconProfitLoss}
                </div>

                {status === 'no-resale' &&
                <div className='open-positions__indicative-no-resale-msg indicative__no-resale-msg'>
                    {localize('Resale not offered')}
                </div>
                }
            </div>
        );
    }
}

IndicativeCell.propTypes = {
    amount  : PropTypes.number,
    currency: PropTypes.string,
    status  : PropTypes.string,
};

export default IndicativeCell;
