import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from 'Stores/connect';

class Deposit extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        return (
            <iframe
                className='cashier__iframe'
                src={this.props.deposit_url}
                frameBorder='0'
                scrolling='auto'
            />
        );
    }
}

Deposit.propTypes = {
    deposit_url  : PropTypes.string,
    iframe_height: PropTypes.number,
};

export default connect(
    ({ modules }) => ({
        deposit_url  : modules.cashier.deposit_url,
        iframe_height: modules.cashier.iframe_height,
        onMount      : modules.cashier.onMount,
        onUnmount    : modules.cashier.onUnmount,
    })
)(Deposit);
