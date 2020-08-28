import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { Icon, Money, DesktopWrapper, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
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
        const { amount, currency, contract_info, is_valid_to_sell, is_footer, onClickSell } = this.props;
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
                {!is_footer && (
                    <DesktopWrapper>
                        {is_valid_to_sell ? (
                            <Button
                                className={classNames('dc-btn--sell', {
                                    'dc-btn--loading': contract_info.is_sell_requested,
                                })}
                                is_disabled={contract_info.is_sell_requested}
                                text={localize('Sell')}
                                onClick={ev => {
                                    onClickSell(contract_info.contract_id);
                                    ev.stopPropagation();
                                    ev.preventDefault();
                                }}
                                secondary
                            />
                        ) : (
                            <div className='open-positions__indicative-no-resale-msg indicative__no-resale-msg'>
                                {localize('Resale not offered')}
                            </div>
                        )}
                    </DesktopWrapper>
                )}
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
