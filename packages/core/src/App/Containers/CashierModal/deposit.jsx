import PropTypes        from 'prop-types';
import React            from 'react';
import { connect }      from 'Stores/connect';
import Error            from './error.jsx';
import Virtual          from './virtual.jsx';
import CashierContainer from './Layout/cashier-container.jsx';

class Deposit extends React.Component {
    componentDidMount() {
        this.props.setActiveTab(this.props.container);
        this.props.onMount();
    }

    render() {
        if (this.props.is_virtual) {
            return <Virtual />;
        }
        return (
            <React.Fragment>
                {this.props.error.message ?
                    <Error
                        error={this.props.error}
                    />
                    :
                    <CashierContainer
                        iframe_height={this.props.iframe_height}
                        iframe_url={this.props.iframe_url}
                        is_loading={this.props.is_loading}
                    />
                }
            </React.Fragment>
        );
    }
}

Deposit.propTypes = {
    container    : PropTypes.string,
    error        : PropTypes.object,
    iframe_height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    iframe_url  : PropTypes.string,
    is_loading  : PropTypes.bool,
    is_virtual  : PropTypes.bool,
    onMount     : PropTypes.func,
    setActiveTab: PropTypes.func,
};

export default connect(
    ({ client, modules }) => ({
        is_virtual   : client.is_virtual,
        container    : modules.cashier.config.deposit.container,
        error        : modules.cashier.config.deposit.error,
        iframe_height: modules.cashier.config.deposit.iframe_height,
        iframe_url   : modules.cashier.config.deposit.iframe_url,
        is_loading   : modules.cashier.is_loading,
        onMount      : modules.cashier.onMount,
        setActiveTab : modules.cashier.setActiveTab,
    })
)(Deposit);
