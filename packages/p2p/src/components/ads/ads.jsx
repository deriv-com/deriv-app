import React              from 'react';
import PropTypes          from 'prop-types';
import { Button, Dialog } from 'deriv-components';
import { localize }       from 'deriv-translations';
// import { WS } from '../../utils/websocket';
import                         './ads.scss';
import Popup              from './popup.jsx';

class Ads extends React.Component {
    state = {
        ads_list: [],
        show_popup: false,
        type: 'buy'
    }

    componentDidMount() {
        // Websocket call example
        // WS().send({ active_symbols: 'brief' }).then((response) => {
        //     console.log(response)
        // })
        this.setState({
            ads_list: [
                ...this.state.ads_list,
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
        const { ads_list, show_popup, type } = this.state;
        return (
            <div className="ads">
                <ul className="ads__list-wrapper">
                    {ads_list.map(ads => <li key={ads.value} className="ads__list">
                        <Button primary onClick={() => this.handleClick(ads.value)}>{ads.label}</Button>
                    </li>
                    )}
                </ul>
                {show_popup &&
                    <div className='ads__dialog'>
                        <Dialog
                            title={type.toUpperCase()}
                            is_visible={show_popup}
                            disableApp={() => {console.log('disable')}}
                            enableApp={() => {console.log('enable')}}
                            confirm_button_text={localize('Confirm')}
                            cancel_button_text={localize('Cancel')}
                            onConfirm={this.onConfirmClick}
                            onCancel={this.onCancelClick}
                        >
                            <Popup type={type} />
                        </Dialog>
                    </div>
                }
            </div>
        );
    }
}

Ads.propTypes = {
    disableApp: PropTypes.func,
}
 
export default Ads;
