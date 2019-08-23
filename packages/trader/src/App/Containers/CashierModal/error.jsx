import PropTypes    from 'prop-types';
import React        from 'react';
import Button       from 'deriv-components/lib/button';
import { urlFor }   from '_common/url';
import Icon         from 'Assets/icon.jsx';
import { connect }  from 'Stores/connect';

class Error extends React.Component {
    onClickButton = () => {
        if (this.props.link) {
            window.open(urlFor(this.props.link, undefined, undefined, true));
        }
        this.props.setErrorMessage('', this.props.container);
    };

    render() {
        return (
            <div className='cashier__wrapper'>
                <Icon icon='IconCashierError' className='cashier-error__icon' />
                {Array.isArray(this.props.error.message) ?
                    this.props.error.message.map((message, idx) =>
                        <p className='cashier-error__text' key={idx}>{message}</p>
                    )
                    :
                    <p className='cashier-error__text'>{this.props.error.message}</p>
                }
                {this.props.error.button_text &&
                <Button
                    className='btn--secondary btn--secondary--orange cashier-error__button'
                    has_effect
                    text={this.props.error.button_text}
                    onClick={this.onClickButton}
                />
                }
            </div>
        );
    }
}

Error.propTypes = {
    container      : PropTypes.string,
    error          : PropTypes.object,
    setErrorMessage: PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        setErrorMessage: modules.cashier.setErrorMessage,
    })
)(Error);
