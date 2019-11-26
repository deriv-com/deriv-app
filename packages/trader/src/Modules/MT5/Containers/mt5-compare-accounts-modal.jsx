import { Button, Popover, Modal } from 'deriv-components';
import React                      from 'react';
import DataTable                  from 'App/Components/Elements/DataTable';
import UILoader                   from 'App/Components/Elements/ui-loader.jsx';
import { localize, Localize }     from 'deriv-translations';
import { connect }                from 'Stores/connect';

const compareAccountsColumns = [
    {
        title    : '',
        col_index: 'attribute',
    },
    {
        title    : <Localize i18n_default_text='Standard' />,
        col_index: 'standard',
    }, {
        title    : <Localize i18n_default_text='Advanced' />,
        col_index: 'advanced',
    }, {
        title    : <Localize i18n_default_text='Synthetic Indices' />,
        col_index: 'synthetic',
    },
];

const MT5AttributeDescriber = ({ name, tooltip, counter }) => {
    return tooltip ? (
        <React.Fragment>
            <p className='mt5-attribute-describer'>{name}</p>
            <Popover
                alignment='right'
                icon='counter'
                counter={counter}
                message={tooltip}
            />
        </React.Fragment>
    ) : (
        <p className='mt5-attribute-describer'>{name}</p>
    );
};

const compareAccountsData = [
    {
        attribute: <MT5AttributeDescriber name={ localize('Account currency') } />,
        standard : localize('USD'),
        advanced : localize('USD'),
        synthetic: localize('USD'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Maximum leverage')}
                counter={1}
                tooltip={localize(
                    'Leverage gives you the ability to trade a larger position using your existing capital. Leverage varies across different symbols.')}
            />
        ),
        standard : localize('Up to 1:1000'),
        advanced : localize('Up to 1:100'),
        synthetic: localize('Up to 1:1000'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Order execution')}
                counter={2}
                tooltip={localize(
                    'All 3 account types use market execution. This means you agree with the broker\'s price in advance and will place orders at the broker\'s price.')}
            />
        ),
        standard : localize('Market'),
        advanced : localize('Market'),
        synthetic: localize('Market'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Spread')}
                counter={3}
                tooltip={localize(
                    'The spread is the difference between the buy price and sell price. A variable spread means that the spread is constantly changing, depending on market conditions. A fixed spread remains constant but is subject to alteration, at the Broker\'s absolute discretion.')}
            />
        ),
        standard : localize('Variable'),
        advanced : localize('Variable'),
        synthetic: localize('Fixed/Variable'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Commission')}
                counter={4}
                tooltip={localize(
                    'Deriv charges no commission across all account types, except cryptocurrency accounts.')}
            />
        ),
        standard : localize('No'),
        advanced : localize('No'),
        synthetic: localize('No'),
    },
    {
        attribute: <MT5AttributeDescriber name={ localize('Minimum deposit') } />,
        standard : localize('No'),
        advanced : localize('No'),
        synthetic: localize('No'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Margin call')}
                counter={5}
                tooltip={localize(
                    'When the remaining funds in your account is deemed insufficient to cover the leverage or margin requirements, your account will be placed under margin call. To prevent a margin call escalating to a stop out level, you can deposit  additional funds into your account or close any open positions.')}
            />
        ),
        standard : localize('150%'),
        advanced : localize('150%'),
        synthetic: localize('100%'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Stop out level')}
                counter={6}
                tooltip={localize(
                    'If your account reaches the stop out level, then your account will be in stop out state. Trading positions and orders on your account are forcibly closed until there are no more open positions or until your margin level increases above the stop out level.')}
            />
        ),
        standard : localize('75%'),
        advanced : localize('75%'),
        synthetic: localize('50%'),
    },
    {
        attribute: <MT5AttributeDescriber name={ localize('Number of assets') } />,
        standard : localize('50+'),
        advanced : localize('50+'),
        synthetic: localize('10+'),
    },
    {
        attribute: (
            <MT5AttributeDescriber
                name={localize('Cryptocurrency trading')}
                counter={7}
                tooltip={localize('Indicates the availability of cryptocurrency trading on a particular account.')}
            />
        ),
        standard : localize('24/7'),
        advanced : localize('N/A'),
        synthetic: localize('N/A'),
    },
];

const ModalContent = ()  => (
    <div className='mt5-compare-accounts'>
        <DataTable
            className='mt5-compare-accounts__data'
            data_source={compareAccountsData}
            columns={compareAccountsColumns}
            item_size={40}
            custom_height={ 400 }
            custom_width={'100%'}
        />
        <p className='mt5-compare-account--hint'>
            <Localize
                i18n_default_text='Note: At bank rollover, liquidity in the forex markets is reduced and may increase the spread and processing time for client orders. This happens around 21:00 GMT during daylight saving time, and 22:00 GMT non-daylight saving time.'
            />
        </p>
    </div>
);

const CompareAccountsModal = ({ toggleCompareAccounts, disableApp, enableApp, is_compare_accounts_visible }) => (
    <div className='mt5-compare-accounts-modal__wrapper'>
        <Button
            className='mt5-dashboard__welcome-message--button'
            has_effect
            text={localize('Compare accounts')}
            onClick={toggleCompareAccounts}
            tertiary
        />
        <React.Suspense fallback={<UILoader />}>
            <Modal
                className='mt5-dashboard__compare-accounts'
                disableApp={disableApp}
                enableApp={enableApp}
                is_open={is_compare_accounts_visible}
                title={localize('Compare accounts')}
                toggleModal={toggleCompareAccounts}
                type='button'
                height='595px'
                width='904px'
            >
                <ModalContent />
            </Modal>
        </React.Suspense>
    </div>
);

export default connect(({ modules, ui }) => ({
    disableApp                 : ui.disableApp,
    enableApp                  : ui.enableApp,
    is_compare_accounts_visible: modules.mt5.is_compare_accounts_visible,
    toggleCompareAccounts      : modules.mt5.toggleCompareAccountsModal,
}))(CompareAccountsModal);
