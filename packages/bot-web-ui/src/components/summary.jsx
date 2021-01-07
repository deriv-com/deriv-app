import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import SummaryCard from './summary-card.jsx';
import { AppCard } from '@deriv/components';
import { connect } from '../stores/connect';
import '../assets/sass/summary.scss';

const Summary = ({ is_mobile, is_drawer_open }) => (
    <div
        className={classnames('summary', {
            'run-panel-tab__content': !is_mobile,
            'run-panel-tab__content--mobile': is_mobile && is_drawer_open,
        })}
    >
        {/* <SummaryCard /> */}
        <AppCard
            amount='0.00'
            app_icon='IcBrandDtrader'
            app_name='Deriv Apps'
            broker='Deriv Limited'
            currency='USD'
            is_swap_free={true}
            is_virtual={true}
            linked_wallet='Virtual USD Wallet'
            login_id='7926972'
            onAddRealClick={() => {
                console.log('Add real clicked!');
            }}
            onDepositClick={() => {
                console.log('Virtual: Deposit clicked!');
            }}
            onPlayClick={() => {
                console.log('Virtual: Play clicked!');
            }}
            onSettingsClick={() => {
                console.log('Virtual: Settings clicked!');
            }}
            server='Deriv Server'
            show_footer={true}
            show_hover_actions={false}
            variant='default'
        />
        <AppCard
            amount='0.00'
            app_icon='IcBrandDtrader'
            app_name='Deriv Apps'
            broker='Deriv Limited'
            currency='USD'
            is_swap_free={true}
            is_virtual={false}
            linked_wallet='Virtual USD Wallet'
            login_id='7926972'
            onDepositClick={() => {
                console.log('Real: Deposit clicked!');
            }}
            onPlayClick={() => {
                console.log('Real: Play clicked!');
            }}
            onSettingsClick={() => {
                console.log('Real: Settings clicked!');
            }}
            onTransactionsClick={() => {
                console.log('Real: Transactions clicked!');
            }}
            onWithdrawClick={() => {
                console.log('Real: Withdraw clicked!');
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
