import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Money, DesktopWrapper, ContractCard } from '@deriv/components';
import { getCardLabels } from '_common/contract';
import { connect } from 'Stores/connect';

const IndicativeCell = ({ amount, currency, contract_info, is_footer, onClickSell, is_sell_requested }) => {
    const [movement, setMovement] = React.useState(null);
    const [amount_state, setAmountState] = React.useState(0);

    React.useEffect(() => {
        setMovement(() => {
            return amount >= amount_state ? 'profit' : 'loss';
        });
        setAmountState(amount);
    }, [amount, amount_state]);

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
};

IndicativeCell.propTypes = {
    amount: PropTypes.number,
    contract_info: PropTypes.object,
    currency: PropTypes.string,
    status: PropTypes.string,
    is_footer: PropTypes.bool,
    is_sell_requested: PropTypes.func,
    onClickSell: PropTypes.func,
};

export default connect(({ portfolio }) => ({
    onClickSell: portfolio.onClickSell,
}))(IndicativeCell);
