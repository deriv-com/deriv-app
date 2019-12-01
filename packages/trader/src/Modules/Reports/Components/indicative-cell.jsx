import { Money }    from 'deriv-components';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from 'deriv-translations';
import Icon         from 'Assets/icon.jsx';

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
        return (
            <div className='open-positions__indicative' >
                <div className='open-positions__indicative--amount'>
                    <Money amount={Math.abs(amount)} currency={currency} />
                    {status !== 'no-resale' && amount !== 0 && <Icon icon='IconPriceMove' type={movement} />}
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
