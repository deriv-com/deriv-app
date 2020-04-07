import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import BuySellForm from './buy-sell-form.jsx';
import NickNameForm from './nick-name-form.jsx';

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

    setNicknameTrue = () => {
        this.setState({ has_nickname: true });
    };

    render() {
        const { ad, handleClose, handleConfirm, setNicknameTrue } = this.props;
        const { has_nickname } = this.state;

        return (
            <Fragment>
                <div className='buy-sell__popup'>
                    {has_nickname ? (
                        <BuySellForm ad={ad} handleClose={handleClose} handleConfirm={handleConfirm} />
                    ) : (
                        <NickNameForm ad={ad} handleClose={handleClose} setNicknameTrue={setNicknameTrue} />
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
