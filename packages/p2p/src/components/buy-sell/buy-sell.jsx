import React              from 'react';
import PropTypes          from 'prop-types';
import { Button, Dialog } from 'deriv-components';
import { localize }       from 'deriv-translations';
// import { WS } from '../../utils/websocket';
import                         './buy-sell.scss';
import Popup              from './popup.jsx';

class BuySell extends React.Component {
    state = {
        buy_sell_list: [],
        show_popup: false,
        type: 'buy'
    }

    componentDidMount() {
        // Websocket call example
        // WS().send({ active_symbols: 'brief' }).then((response) => {
        //     console.log(response)
        // })
        this.setState({
            buy_sell_list: [
                ...this.state.buy_sell_list,
                {
                    label: 'Buy',
                    value: 'buy',
                },
            ],
        });
    }

    handleClick = (type) => {
        this.setState({ type, show_popup: true });
    }
    onConfirmClick = () => {
        // TODO: [p2p] will create order from API
        //eslint-disable-next-line no-console
        console.log(this.state);
    }
    onCancelClick = () => {
        this.setState({ show_popup: false });
    }

    render() {
        const { buy_sell_list, show_popup, type } = this.state;
        return (
            <div className="buy-sell">
                <ul className="buy-sell__list-wrapper">
                    {buy_sell_list.map(buy_sell => <li key={buy_sell.value} className="buy-sell__list">
                        <Button primary onClick={() => this.handleClick(buy_sell.value)}>{buy_sell.label}</Button>
                    </li>
                    )}
                </ul>
                {show_popup &&
                    <div className='buy-sell__dialog'>
                        <Dialog
                            is_visible={show_popup}
                            disableApp={() => {/* do nothing // disableApp is a mandatory props in dialog */}}
                            enableApp={() => {/* do nothing // enableApp is a mandatory props in dialog */}}
                            confirm_button_text={localize('Confirm')}
                            cancel_button_text={localize('Cancel')}
                            onConfirm={this.onConfirmClick}
                            onCancel={this.onCancelClick}
                        >
                            <Popup type={type} onCancel={this.onCancelClick} />
                        </Dialog>
                    </div>
                }
            </div>
        );
    }
}

BuySell.propTypes = {
    disableApp: PropTypes.func,
}
 
export default BuySell;
