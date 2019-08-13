import PropTypes    from 'prop-types';
import React        from 'react';
import Icon         from 'Assets/icon.jsx';
import Button       from 'App/Components/Form/button.jsx';
import { localize } from 'App/i18n';
import { connect }  from 'Stores/connect';

class Error extends React.Component {
    onClickButton = () => { this.props.setErrorMessage('', this.props.container); };

    render() {
        return (
            <div className='cashier__wrapper'>
                <Icon icon='IconCashierError' className='cashier-error__icon' />
                <p className='cashier-error__text'>{this.props.error_message}</p>
                <Button
                    className='btn--secondary btn--secondary--orange cashier-error__button'
                    has_effect
                    text={localize('Okay')}
                    onClick={this.onClickButton}
                />
            </div>
        );
    }
}

Error.propTypes = {
    container      : PropTypes.string,
    error_message  : PropTypes.string,
    setErrorMessage: PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        setErrorMessage: modules.cashier.setErrorMessage,
    })
)(Error);
