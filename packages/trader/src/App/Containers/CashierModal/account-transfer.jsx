import PropTypes            from 'prop-types';
import React                from 'react';
import { connect }          from 'Stores/connect';

class AccountTransfer extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
    }

    render() {
        return (
            <React.Fragment>
            </React.Fragment>
        );
    }
}

AccountTransfer.propTypes = {
    container   : PropTypes.string,
    setActiveTab: PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        container   : modules.cashier.config.account_transfer.container,
        setActiveTab: modules.cashier.setActiveTab,
    })
)(AccountTransfer);
