import * as React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { VirtualWalletCard, AppCard } from '@deriv/components';
import { getAppCardLabels } from 'Constants/component-labels';

const Demo: React.FC<TDemoProps> = ({}) => {
    const deriv_apps = (
        <AppCard
            amount='0.00'
            app_icon='IcBrandDerivApps'
            app_name='Deriv Apps'
            broker='Deriv Limited'
            currency='USD'
            getCardLabels={getAppCardLabels}
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
    );

    const financial_stp = (
        <AppCard
            amount='0.00'
            app_icon='IcBrandDmt5FinancialStp'
            app_name='DMT5 Financial STP'
            broker='Deriv Limited'
            currency='USD'
            getCardLabels={getAppCardLabels}
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
    );

    const financial = (
        <AppCard
            amount='0.00'
            app_icon='IcBrandDmt5Financial'
            app_name='DMT5 Financial'
            broker='Deriv Limited'
            currency='USD'
            getCardLabels={getAppCardLabels}
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
    );

    const synthetics = (
        <AppCard
            amount='0.00'
            app_icon='IcBrandDmt5Synthetics'
            app_name='DMT5 Synthetics'
            broker='Deriv Limited'
            currency='USD'
            getCardLabels={getAppCardLabels}
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
    );

    const synthetics_swap_free = (
        <AppCard
            amount='0.00'
            app_icon='IcBrandDmt5Synthetics'
            app_name='DMT5 Synthetics'
            broker='Deriv Limited'
            currency='USD'
            getCardLabels={getAppCardLabels}
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
    );

    const financial_swap_free = (
        <AppCard
            amount='0.00'
            app_icon='IcBrandDmt5Financial'
            app_name='DMT5 Financial'
            broker='Deriv Limited'
            currency='USD'
            getCardLabels={getAppCardLabels}
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
    );
    const cfd_apps = [synthetics, financial, financial_stp];
    const swap_free_apps = [synthetics_swap_free, financial_swap_free];
    return (
        <React.Fragment>
            <div className='dw-my-apps__wallet-section'>
                <Text size='m' weight='bold' line_height='xs'>
                    {localize('My Wallets')}
                </Text>
                <div className='dw-my-apps__wallet-section-container'>
                    <VirtualWalletCard />
                </div>
            </div>
            <div className='dw-my-apps__app-section dw-my-apps__app-section-separator'>
                <Text size='m' weight='bold' line_height='xs'>
                    {localize('Options & Multipliers')}
                </Text>
                <div className='dw-my-apps__app-section-container'>{deriv_apps}</div>
            </div>
            <div className='dw-my-apps__app-section dw-my-apps__app-section-separator'>
                <Text size='m' weight='bold' line_height='xs'>
                    {localize('CFDs')}
                </Text>
                <div className='dw-my-apps__app-section-container'>
                    {cfd_apps.map(item => {
                        return <div className=' dw-my-apps__app-section--virtual'>{item}</div>;
                    })}
                </div>
            </div>
            <div className='dw-my-apps__app-section'>
                <Text size='m' weight='bold' line_height='xs'>
                    {localize('Swap-free')}
                </Text>
                <div className='dw-my-apps__app-section-container'>
                    {swap_free_apps.map(item => {
                        return <div className=' dw-my-apps__app-section--virtual'>{item}</div>;
                    })}
                </div>
            </div>
        </React.Fragment>
    );
};

type TDemoProps = {};

export default Demo;
