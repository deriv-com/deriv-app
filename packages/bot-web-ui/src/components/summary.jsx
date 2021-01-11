import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { AppCard } from '@deriv/components';
import SummaryCard from './summary-card.jsx';
import { connect } from '../stores/connect';
import '../assets/sass/summary.scss';

const getCardLabels = () => ({
    ADD: 'Add',
    WITHDRAW: 'Withdraw',
    TRANSACTIONS: 'Transactions',
    SETTINGS: 'Settings',
    SWAP_FREE: 'Swap-free',
    LINKED: 'Linked',
    LOGIN_ID: 'Login ID',
    BROKER: 'Broker',
    SERVER: 'Server',
    DEMO: 'Demo',
    ADD_REAL: 'Add real',
});

const Summary = ({ is_mobile, is_drawer_open }) => (
    <div
        className={classnames('summary', {
            'run-panel-tab__content': !is_mobile,
            'run-panel-tab__content--mobile': is_mobile && is_drawer_open,
        })}
    >
        <SummaryCard />
        <AppCard
            amount='0.00'
            app_icon='IcBrandDtrader'
            app_name='Deriv Apps'
            broker='Deriv Limited'
            currency='USD'
            getCardLabels={getCardLabels}
            is_swap_free={true}
            is_virtual={true}
            linked_wallet='Virtual USD Wallet'
            login_id='7926972'
            onAddRealClick={() => {
                console.log('Add real clicked!');
            }}
            onDepositClick={() => {
                console.log('Deposit clicked!');
            }}
            onPlayClick={() => {
                console.log('Play clicked!');
            }}
            onSettingsClick={() => {
                console.log('Settings clicked!');
            }}
            onTransactionsClick={() => {
                console.log('Transactions clicked!');
            }}
            onWithdrawClick={() => {
                console.log('Withdraw clicked!');
            }}
            server='Deriv Server'
            show_footer={true}
            show_hover_actions={true}
            variant='default'
        />
    </div>
);

Summary.propTypes = {
    is_mobile: PropTypes.bool,
};

export default connect(({ ui }) => ({
    is_mobile: ui.is_mobile,
}))(Summary);
