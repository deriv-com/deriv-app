import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'Stores/connect';
import ProductCard from '../Components/product-card';
import TradeTypeCard from '../Components/trade-type-card';
import AppstoreAppCard from '../Components/app-card';
import ProductCardModal from '../Components/product-card-modal';

const Playground = ({ props, is_dark_mode_on }) => {
    // dummy product card data
    const platform_data = [
        {
            platform_name: 'Deriv MT5',
            icon_title: 'icBrandDmt5',
            description: 'Trade on Deriv MT5 (DMT5), the all-in-one FX and CFD trading platform.',
            checked: true,
        },
        {
            platform_name: 'Deriv X',
            icon_title: 'icBrandDxtrade',
            description: 'Trade FX and CFDs on a customisable, easy-to-use trading platform.',
            checked: false,
        },
    ];
    const tradetype = [
        {
            type: 'CFDs',
            icon_title: 'icAppstoreMultipliersTradeType',
            description: 'Trade with leverage and tight spreads for better returns on successful trades.',
            checked: false,
            bg_image_title: 'appstore_cfds_trade_type_bg',
        },
        {
            type: 'Multipliers',
            icon_title: 'icAppstoreCfdsTradeType',
            description: 'Combine the upside of CFDs with the simplicity of options.',
            checked: false,
            bg_image_title: 'appstore_multipliers_trade_type_bg',
        },
        {
            type: 'Options',
            icon_title: 'icAppstoreOptionTradeType',
            description: 'Earn fixed payouts by predicting an asset price movement.',
            checked: true,
            bg_image_title: 'appstore_options_trade_type_bg',
        },
    ];

    const trade_type_wrapper_div = {
        width: '100%',
        height: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    };

    const marginSetting = {
        marginRight: '8px',
        marginBottom: '8px',
    };

    // linked appcard
    const linked_appcard_large = [
        {
            checked: true,
            account_type: 'Real',
            size: 'large',
            linked: true,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Checked',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
        {
            account_type: 'Real',
            size: 'large',
            linked: true,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Normal',
                app_icon: 'icDxtradeSynthetic',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
        {
            checked: false,
            faded: true,
            account_type: 'Real',
            size: 'large',
            linked: true,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Faded',
                app_icon: 'icDxtradeSynthetic',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
        {
            checked: false,
            disabled: true,
            account_type: 'Real',
            size: 'large',
            linked: true,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Disabled',
                app_icon: 'icDxtradeSynthetic',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
    ];

    const linked_appcard_medium = [
        {
            checked: true,
            account_type: 'Real',
            size: 'medium',
            linked: true,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Checked',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
        {
            account_type: 'Real',
            size: 'medium',
            linked: true,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Normal',
                app_icon: 'icDxtradeSynthetic',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
        {
            checked: false,
            faded: true,
            account_type: 'Real',
            size: 'medium',
            linked: true,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Faded',
                app_icon: 'icDxtradeSynthetic',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
        {
            checked: false,
            disabled: true,
            account_type: 'Real',
            size: 'medium',
            linked: true,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Disabled',
                app_icon: 'icDxtradeSynthetic',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
    ];

    const linked_appcard_small = [
        {
            checked: true,
            account_type: 'Real',
            size: 'small',
            linked: true,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Checked',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
        {
            account_type: 'Real',
            size: 'small',
            linked: true,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Normal',
                app_icon: 'icDxtradeSynthetic',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
        {
            checked: false,
            faded: true,
            account_type: 'Real',
            size: 'small',
            linked: true,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Faded',
                app_icon: 'icDxtradeSynthetic',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
        {
            checked: false,
            disabled: true,
            account_type: 'Real',
            size: 'small',
            linked: true,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Disabled',
                app_icon: 'icDxtradeSynthetic',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
    ];

    // unlinked appcard

    const unlinked_appcard_large = [
        {
            checked: true,
            account_type: 'Real',
            size: 'large',
            linked: false,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Checked',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
        {
            account_type: 'Real',
            size: 'large',
            linked: false,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Normal',
                app_icon: 'icDxtradeSynthetic',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
        {
            checked: false,
            faded: true,
            account_type: 'Real',
            size: 'large',
            linked: false,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Faded',
                app_icon: 'icDxtradeSynthetic',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
        {
            checked: false,
            disabled: true,
            account_type: 'Real',
            size: 'large',
            linked: false,
            app_card_details: {
                app_name: 'Deriv MT5 Synthetics Large Disabled',
                app_icon: 'icDxtradeSynthetic',
                wallet_name: 'Demo USD wallet',
                wallet_icon: 'icAppstoreWalletUsdLight',
                currency_name: 'USD',
                balance: 10,
            },
        },
    ];

    const unlinked_appcard_medium = [
        {
            account_type: 'Real',
            checked: true,
            size: 'medium',
            linked: false,
            app_card_details: {
                app_name: 'Deriv MT5 Checked',
                app_icon: 'icDxtradeSynthetic',
            },
        },
        {
            account_type: 'Demo',
            size: 'medium',
            linked: false,
            app_card_details: {
                app_name: 'Deriv MT5 Normal',
                app_icon: 'icDxtradeSynthetic',
            },
        },
        {
            account_type: 'Demo',
            faded: true,
            size: 'medium',
            linked: false,
            app_card_details: {
                app_name: 'Deriv MT5 Faded',
                app_icon: 'icDxtradeSynthetic',
            },
        },
        {
            account_type: 'Real',
            disabled: true,
            size: 'medium',
            linked: false,
            app_card_details: {
                app_name: 'Deriv MT5 Disabled',
                app_icon: 'icDxtradeSynthetic',
            },
        },
    ];

    const unlinked_appcard_small = [
        {
            account_type: 'Real',
            checked: true,
            size: 'small',
            linked: false,
            app_card_details: {
                app_name: 'Deriv MT5 Checked',
                app_icon: 'icDxtradeSynthetic',
            },
        },
        {
            account_type: 'Demo',
            size: 'small',
            linked: false,
            app_card_details: {
                app_name: 'Deriv MT5 Normal',
                app_icon: 'icDxtradeSynthetic',
            },
        },
        {
            account_type: 'Demo',
            faded: true,
            size: 'small',
            linked: false,
            app_card_details: {
                app_name: 'Deriv MT5 Faded',
                app_icon: 'icDxtradeSynthetic',
            },
        },
        {
            account_type: 'Real',
            disabled: true,
            size: 'small',
            linked: false,
            app_card_details: {
                app_name: 'Deriv MT5 Disabled',
                app_icon: 'icDxtradeSynthetic',
            },
        },
    ];

    return (
        <div style={{ padding: '20px', overflow: 'scroll', height: '100%' }}>
            <p>{props}</p>
            <h2 style={{ fontSize: '30px', marginBottom: '40px', textAlign: 'center' }}>
                Appstore component playground
            </h2>

            {/* dummy code for product card */}
            <div style={trade_type_wrapper_div}>
                {platform_data.map((item, idx) => (
                    <div style={marginSetting} key={idx}>
                        <ProductCard product_card={false} platform_details={item} />
                    </div>
                ))}
            </div>

            <div style={trade_type_wrapper_div}>
                {tradetype.map((item, idx) => (
                    <div style={marginSetting} key={idx}>
                        <TradeTypeCard
                            type={item.type}
                            icon_title={item.icon_title}
                            description={item.description}
                            checked={item.checked}
                            bg_image_title={item.bg_image_title}
                        />
                    </div>
                ))}
            </div>

            <p>Linked App card Large</p>
            <div style={trade_type_wrapper_div}>
                {linked_appcard_large.map((item, idx) => (
                    <div style={marginSetting} key={idx}>
                        <AppstoreAppCard
                            account_type={item.account_type}
                            checked={item.checked}
                            dark={is_dark_mode_on}
                            size={item.size}
                            linked={item.linked}
                            app_card_details={item.app_card_details}
                            faded={item.faded}
                            disabled={item.disabled}
                        />
                    </div>
                ))}
            </div>

            <p>Linked App card Medium</p>
            <div style={trade_type_wrapper_div}>
                {linked_appcard_medium.map((item, idx) => (
                    <div style={marginSetting} key={idx}>
                        <AppstoreAppCard
                            account_type={item.account_type}
                            checked={item.checked}
                            dark={is_dark_mode_on}
                            size={item.size}
                            linked={item.linked}
                            app_card_details={item.app_card_details}
                            faded={item.faded}
                            disabled={item.disabled}
                        />
                    </div>
                ))}
            </div>

            <p>Unlinked App card Large</p>
            <div style={trade_type_wrapper_div}>
                {unlinked_appcard_large.map((item, idx) => (
                    <div style={marginSetting} key={idx}>
                        <AppstoreAppCard
                            account_type={item.account_type}
                            checked={item.checked}
                            dark={is_dark_mode_on}
                            size={item.size}
                            linked={item.linked}
                            app_card_details={item.app_card_details}
                            faded={item.faded}
                            disabled={item.disabled}
                        />
                    </div>
                ))}
            </div>

            <p>Unlinked App card Medium</p>
            <div style={trade_type_wrapper_div}>
                {unlinked_appcard_medium.map((item, idx) => (
                    <div style={marginSetting} key={idx}>
                        <AppstoreAppCard
                            account_type={item.account_type}
                            checked={item.checked}
                            dark={is_dark_mode_on}
                            size={item.size}
                            linked={item.linked}
                            app_card_details={item.app_card_details}
                            faded={item.faded}
                            disabled={item.disabled}
                        />
                    </div>
                ))}
            </div>

            <p>Unlinked App card Small</p>
            <div style={trade_type_wrapper_div}>
                {unlinked_appcard_small.map((item, idx) => (
                    <div style={marginSetting} key={idx}>
                        <AppstoreAppCard
                            account_type={item.account_type}
                            checked={item.checked}
                            dark={is_dark_mode_on}
                            size={item.size}
                            linked={item.linked}
                            app_card_details={item.app_card_details}
                            faded={item.faded}
                            disabled={item.disabled}
                        />
                    </div>
                ))}
            </div>

            <p>Linked App card Small</p>
            <div style={trade_type_wrapper_div}>
                {linked_appcard_small.map((item, idx) => (
                    <div style={marginSetting} key={idx}>
                        <AppstoreAppCard
                            account_type={item.account_type}
                            checked={item.checked}
                            dark={is_dark_mode_on}
                            size={item.size}
                            linked={item.linked}
                            app_card_details={item.app_card_details}
                            faded={item.faded}
                            disabled={item.disabled}
                        />
                    </div>
                ))}
            </div>

            <p>Product card modal</p>
            <div style={trade_type_wrapper_div}>
                <ProductCardModal />
            </div>
        </div>
    );
};

export default withRouter(
    connect(({ ui }) => ({
        is_dark_mode_on: ui.is_dark_mode_on,
    }))(Playground)
);
