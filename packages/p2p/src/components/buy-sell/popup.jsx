import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import BuySellForm from './buy-sell-form.jsx';
import NickNameForm from './nick-name-form.jsx';
import IconClose from 'Assets/icon-close.jsx';

class Popup extends Component {
    state = {
        has_nickname: false,
        loading: true,
    };

    componentDidMount() {
        this.checkNickname();
    }

    checkNickname = () => {
        if (this.context.is_advertiser) {
            this.setState({ has_nickname: true });
        }
    };

    render() {
        const { ad, handleClose, handleConfirm } = this.props;
        const { has_nickname } = this.state;

        return (
            <Fragment>
                <div className='buy-sell__popup'>
                    <div className='buy-sell__popup-header'>
                        <div className='buy-sell__popup-header_wrapper'>
                            {has_nickname && (
                                <h2 className='buy-sell__popup-header--title'>{`${ad.type} ${ad.offer_currency}`}</h2>
                            )}
                            <IconClose className='buy-sell__popup-close_icon' onClick={handleClose} />
                        </div>
                    </div>
                    {has_nickname ? (
                        <BuySellForm ad={ad} handleClose={handleClose} handleConfirm={handleConfirm} />
                    ) : (
                        <NickNameForm ad={ad} handleClose={handleClose} handleConfirm={handleConfirm} />
                    )}
                </div>
            </Fragment>
        );
    }
}

Popup.propTypes = {
    ad: PropTypes.object,
    handleClose: PropTypes.func,
    handleConfirm: PropTypes.func,
};

export default Popup;
