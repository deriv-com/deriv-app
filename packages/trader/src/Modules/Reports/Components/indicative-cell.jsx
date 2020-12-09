import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Money, DesktopWrapper, ContractCard } from '@deriv/components';
import { getCardLabels } from 'Constants/contract';
import { connect } from 'Stores/connect';

class IndicativeCell extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            movement: null,
            amount: 0,
        };
    }

    componentDidUpdate(prevProps) {
        this.setState(() => ({
            movement: prevProps.amount >= this.state.amount ? 'profit' : 'loss',
            amount: prevProps.amount,
        }));
    }

    render() {
        const { amount, currency, contract_info, is_footer, onClickSell, is_sell_requested } = this.props;
        const { movement } = this.state;

        return (
            <div className='open-positions__indicative'>
                <div className='open-positions__indicative--amount'>
                    <Money amount={Math.abs(amount)} currency={currency} />
                    {status !== 'no-resale' && amount !== 0 && (
                        <React.Fragment>
                            {movement === 'profit' && <Icon icon='IcProfit' />}
                            {movement === 'loss' && <Icon icon='IcLoss' />}
                        </React.Fragment>
                    )}
                </div>
                <DesktopWrapper>
                    {!is_footer && (
                        <ContractCard.Sell
                            contract_info={contract_info}
                            is_sell_requested={is_sell_requested}
                            getCardLabels={getCardLabels}
                            onClickSell={onClickSell}
                        />
                    )}
                </DesktopWrapper>
            </div>
        );
    }
}

IndicativeCell.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    status: PropTypes.string,
    is_footer: PropTypes.bool,
    onClickSell: PropTypes.func,
};

export default connect(({ modules }) => ({
    onClickSell: modules.portfolio.onClickSell,
}))(IndicativeCell);
