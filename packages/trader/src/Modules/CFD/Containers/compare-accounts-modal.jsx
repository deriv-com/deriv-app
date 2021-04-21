import React from 'react';
import {
    Button,
    Modal,
    DesktopWrapper,
    MobileDialog,
    MobileWrapper,
    Table,
    UILoader,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const accounts = [
    {
        attribute: localize('Account currency'),
        mt5: {
            synthetic: localize('USD'),
            synthetic_eu: localize('EUR'),
            financial: localize('USD'),
            financial_eu: localize('EUR/GBP'),
            financial_stp: localize('USD'),
            footnote: null,
        },
        dxtrade: {
            synthetic: localize('USD'),
            synthetic_eu: localize('EUR'),
            financial: localize('USD'),
            financial_eu: localize('EUR/GBP'),
            footnote: null,
        },
    },
    {
        attribute: localize('Maximum leverage'),
        mt5: {
            synthetic: localize('Up to 1:1000'),
            synthetic_eu: localize('Up to 1:1000'),
            financial: localize('Up to 1:1000'),
            financial_eu: localize('Up to 1:30'),
            financial_stp: localize('Up to 1:100'),
            footnote: localize(
                'Leverage gives you the ability to trade a larger position using your existing capital. Leverage varies across different symbols.'
            ),
        },
        dxtrade: {
            synthetic: localize('Up to 1:1000'),
            synthetic_eu: localize('Up to 1:1000'),
            financial: localize('Up to 1:1000'),
            financial_eu: localize('Up to 1:30'),
            footnote: localize(
                'Leverage gives you the ability to trade a larger position using your existing capital. Leverage varies across different symbols.'
            ),
        },
    },
    {
        attribute: localize('Order execution'),
        mt5: {
            synthetic: localize('Market'),
            synthetic_eu: localize('Market'),
            financial: localize('Market'),
            financial_eu: localize('Market'),
            financial_stp: localize('Market'),
            footnote: localize(
                "All 3 account types use market execution. This means you agree with the broker's price in advance and will place orders at the broker's price."
            ),
        },
        dxtrade: {
            synthetic: localize('Market'),
            synthetic_eu: localize('Market'),
            financial: localize('Market'),
            financial_eu: localize('Market'),
            footnote: localize(
                "All 3 account types use market execution. This means you agree with the broker's price in advance and will place orders at the broker's price."
            ),
        },
    },
    {
        attribute: localize('Spread'),
        mt5: {
            synthetic: localize('Fixed/Variable'),
            synthetic_eu: localize('Fixed/Variable'),
            financial: localize('Variable'),
            financial_eu: localize('Variable'),
            financial_stp: localize('Variable'),
            footnote: localize(
                "The spread is the difference between the buy price and sell price. A variable spread means that the spread is constantly changing, depending on market conditions. A fixed spread remains constant but is subject to alteration, at the Broker's absolute discretion."
            ),
        },
        dxtrade: {
            synthetic: localize('Fixed/Variable'),
            synthetic_eu: localize('Fixed/Variable'),
            financial: localize('Variable'),
            financial_eu: localize('Variable'),
            footnote: localize(
                "The spread is the difference between the buy price and sell price. A variable spread means that the spread is constantly changing, depending on market conditions. A fixed spread remains constant but is subject to alteration, at the Broker's absolute discretion."
            ),
        },
    },
    {
        attribute: localize('Commission'),
        mt5: {
            synthetic: localize('No'),
            synthetic_eu: localize('No'),
            financial: localize('No'),
            financial_eu: localize('No'),
            financial_stp: localize('No'),
            footnote: localize('Deriv charges no commission across all account types.'),
        },
        dxtrade: {
            synthetic: localize('No'),
            synthetic_eu: localize('No'),
            financial: localize('No'),
            financial_eu: localize('No'),
            footnote: localize('Deriv charges no commission across all account types.'),
        },
    },
    {
        attribute: localize('Minimum deposit'),
        mt5: {
            synthetic: localize('No'),
            synthetic_eu: localize('No'),
            financial: localize('No'),
            financial_eu: localize('No'),
            financial_stp: localize('No'),
            footnote: null,
        },
        dxtrade: {
            synthetic: localize('No'),
            synthetic_eu: localize('No'),
            financial: localize('No'),
            financial_eu: localize('No'),
            footnote: null,
        },
    },
    {
        attribute: localize('Margin call'),
        mt5: {
            synthetic: localize('100%'),
            synthetic_eu: localize('100%'),
            financial: localize('150%'),
            financial_eu: localize('100%'),
            financial_stp: localize('150%'),
            footnote: localize(
                'When the remaining funds in your account is deemed insufficient to cover the leverage or margin requirements, your account will be placed under margin call. To prevent a margin call escalating to a stop out level, you can deposit  additional funds into your account or close any open positions.'
            ),
        },
        dxtrade: {
            synthetic: localize('100%'),
            synthetic_eu: localize('100%'),
            financial: localize('100%'),
            financial_eu: localize('100%'),
            footnote: localize(
                'When the remaining funds in your account is deemed insufficient to cover the leverage or margin requirements, your account will be placed under margin call. To prevent a margin call escalating to a stop out level, you can deposit  additional funds into your account or close any open positions.'
            ),
        },
    },
    {
        attribute: localize('Stop out level'),
        mt5: {
            synthetic: localize('50%'),
            synthetic_eu: localize('50%'),
            financial: localize('75%'),
            financial_eu: localize('50%'),
            financial_stp: localize('75%'),
            footnote: localize(
                'When the remaining funds in your account is deemed insufficient to cover the leverage or margin requirements, your account will be placed under margin call. To prevent a margin call escalating to a stop out level, you can deposit  additional funds into your account or close any open positions.'
            ),
        },
        dxtrade: {
            synthetic: localize('50%'),
            synthetic_eu: localize('50%'),
            financial: localize('50%'),
            financial_eu: localize('50%'),
            footnote: localize(
                'When the remaining funds in your account is deemed insufficient to cover the leverage or margin requirements, your account will be placed under margin call. To prevent a margin call escalating to a stop out level, you can deposit  additional funds into your account or close any open positions.'
            ),
        },
    },
    {
        attribute: localize('Negative Balance Protection'),
        dxtrade: {
            synthetic: localize('Available'),
            synthetic_eu: localize('Available'),
            financial: localize('N/A'),
            financial_eu: localize('Required'),
        },
    },
    {
        attribute: localize('Number of assets'),
        mt5: {
            synthetic: localize('10+'),
            synthetic_eu: localize('10+'),
            financial: localize('50+'),
            financial_eu: localize('50+'),
            financial_stp: localize('50+'),
            footnote: null,
        },
        dxtrade: {
            synthetic: localize('20+'),
            synthetic_eu: localize('50+'),
            financial: localize('20+'),
            financial_eu: localize('1000+'),
            footnote: null,
        },
    },
    {
        attribute: localize('Cryptocurrency trading'),
        mt5: {
            synthetic: localize('N/A'),
            synthetic_eu: localize('N/A'),
            financial: localize('24/7'),
            financial_eu: localize('24/7'),
            financial_stp: localize('24/7'),
            footnote: localize('Indicates the availability of cryptocurrency trading on a particular account.'),
        },
        dxtrade: {
            synthetic: localize('N/A'),
            synthetic_eu: localize('N/A'),
            financial: localize('24/7'),
            financial_eu: localize('24/7'),
            footnote: localize('Indicates the availability of cryptocurrency trading on a particular account.'),
        },
    },
    {
        attribute: localize('Trading instruments'),
        mt5: {
            synthetic: localize('Synthetics'),
            synthetic_eu: localize('Synthetics'),
            financial: localize(
                'FX-majors (standard/micro lots), FX-minors, Commodities, Cryptocurrencies, Stocks & Indices'
            ),
            financial_eu: localize('FX-majors (standard), FX-minors, Commodities, Cryptocurrencies, Stocks & Indices'),
            financial_stp: localize('FX-majors, FX-minors, FX-exotics, Cryptocurrencies'),
            footnote: null,
        },
        dxtrade: {
            synthetic: localize('Synthetics'),
            synthetic_eu: localize('Synthetics'),
            financial: localize('FX-majors (standard/micro lots), FX-minors, Smart-FX, Commodities, Cryptocurrencies'),
            financial_eu: localize(
                'FX-majors (standard/micro lots), FX-minors, Commodities, Cryptocurrencies (except UK)'
            ),
            footnote: null,
        },
    },
];

const CFDAttributeDescriber = ({ name, counter }) => {
    const [is_visible, setIsVisible] = React.useState(false);
    const toggleModal = () => setIsVisible(!is_visible);

    return counter ? (
        <React.Fragment>
            <Text
                as='p'
                weight='bold'
                size='xs'
                line_height='s'
                className='cfd-attribute-describer'
                onClick={toggleModal}
            >
                {name}
                <Text weight='bold' as='span' line_height='x' size='xxxs' className='counter'>
                    {counter}
                </Text>
            </Text>
        </React.Fragment>
    ) : (
        <Text as='p' weight='bold' size='xs' line_height='s' className='cfd-attribute-describer'>
            {name}
        </Text>
    );
};

const filterAvailableAccounts = (landing_companies, table, is_logged_in, show_eu_related, platform) => {
    let footnote_number = 0;
    return table
        .filter(row => row[platform])
        .map(({ attribute, mt5 = {}, dxtrade = {} }) => {
            const { synthetic, synthetic_eu, financial_stp, financial, financial_eu, footnote } =
                platform === 'mt5' ? mt5 : dxtrade;
            const synthetic_object = { synthetic: show_eu_related ? synthetic_eu : synthetic };
            const financial_object = { financial: show_eu_related ? financial_eu : financial };

            if (is_logged_in) {
                return {
                    attribute: <CFDAttributeDescriber name={attribute} counter={footnote ? ++footnote_number : null} />,
                    ...(landing_companies?.mt_gaming_company?.financial ? synthetic_object : {}),
                    ...(landing_companies?.mt_financial_company?.financial ? financial_object : {}),
                    ...(landing_companies?.mt_financial_company?.financial_stp && platform === 'mt5'
                        ? { financial_stp }
                        : {}),
                };
            }
            if (platform === 'dxtrade') {
                return {
                    attribute: <CFDAttributeDescriber name={attribute} counter={footnote ? ++footnote_number : null} />,
                    ...{ synthetic_object },
                    ...{ financial_object },
                };
            }
            return {
                attribute: <CFDAttributeDescriber name={attribute} counter={footnote ? ++footnote_number : null} />,
                ...{ synthetic_object },
                ...{ financial_object },
                ...{ financial_stp },
            };
        });
};

const compareAccountsData = ({ landing_companies, is_eu, is_eu_country, is_logged_in, platform }) => {
    const show_eu_related = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);
    return filterAvailableAccounts(landing_companies, accounts, is_logged_in, show_eu_related, platform);
};

const CFDCompareAccountHint = ({ platform, show_risk_message }) => {
    return (
        <div className='cfd-compare-account--hint'>
            <div className='cfd-compare-accounts__bullet-wrapper'>
                <span className='cfd-compare-accounts__bullet cfd-compare-accounts__bullet--circle' />
                <Localize i18n_default_text='At bank rollover, liquidity in the forex markets is reduced and may increase the spread and processing time for client orders. This happens around 21:00 GMT during daylight saving time, and 22:00 GMT non-daylight saving time.' />
            </div>
            {show_risk_message && (
                <React.Fragment>
                    <div className='cfd-compare-accounts__bullet-wrapper'>
                        <span className='cfd-compare-accounts__bullet cfd-compare-accounts__bullet--circle' />
                        <Localize i18n_default_text='Margin call and stop out level will change from time to time based on market condition.' />
                    </div>
                    <div className='cfd-compare-accounts__bullet-wrapper'>
                        <Text
                            size='xs'
                            line_height='x'
                            weight='bold'
                            className='cfd-compare-accounts__bullet cfd-compare-accounts__bullet--star cfd-compare-accounts__star'
                        >
                            *
                        </Text>
                        <Localize
                            i18n_default_text='To protect your portfolio from adverse market movements due to the market opening gap, we reserve the right to decrease leverage on all offered symbols for financial accounts before market close and increase it again after market open. Please make sure that you have enough funds available in your {{platform}} account to support your positions at all times.'
                            values={{
                                platform: platform === 'mt5' ? localize('MT5') : localize('Deriv X'),
                            }}
                        />
                    </div>
                </React.Fragment>
            )}
            {accounts
                .filter(item => !!item[platform]?.footnote)
                .map((account, index) => {
                    return (
                        <div key={index} className='cfd-compare-accounts__bullet-wrapper'>
                            <Text
                                size='xs'
                                line_height='x'
                                weight='bold'
                                className='cfd-compare-accounts__bullet cfd-compare-accounts__bullet--star cfd-compare-accounts__star'
                            >
                                {index + 1}
                            </Text>
                            <div className='cfd-compare-accounts__footnote'>
                                <Text
                                    as='p'
                                    size='xs'
                                    weight='bold'
                                    color='prominent'
                                    className='cfd-compare-accounts__footnote-title'
                                >
                                    {account.attribute}
                                </Text>
                                <Text size='xs' color='prominent'>
                                    {account[platform].footnote}
                                </Text>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

const ModalContent = ({ landing_companies, is_logged_in, platform, show_eu_related }) => {
    const [cols, setCols] = React.useState([]);
    const [template_columns, updateColumnsStyle] = React.useState(
        platform === 'dxtrade' ? '1.5fr 1fr 2fr' : '1.5fr 1fr 2fr 1fr'
    );

    React.useEffect(() => {
        setCols(compareAccountsData({ landing_companies, is_logged_in, platform, show_eu_related }));

        if (is_logged_in && platform === 'mt5') {
            updateColumnsStyle(
                `1.5fr ${landing_companies?.mt_gaming_company?.financial ? '1fr' : ''} ${
                    landing_companies?.mt_financial_company?.financial ? '2fr' : ''
                } ${landing_companies?.mt_financial_company?.financial_stp ? ' 1fr ' : ''}`
            );
        }
    }, [
        landing_companies?.mt_financial_company,
        landing_companies?.mt_gaming_company,
        is_logged_in,
        landing_companies,
        platform,
        show_eu_related,
    ]);

    const show_risk_message = platform === 'mt5' || !show_eu_related;

    return (
        <ThemedScrollbars
            className='cfd-compare-accounts'
            style={{
                '--cfd-compare-accounts-template-columns': template_columns,
            }}
        >
            <Table className='cfd-compare-accounts__table'>
                <Table.Header>
                    <Table.Row className='cfd-compare-accounts__table-row'>
                        <Table.Head />
                        {is_logged_in ? (
                            <React.Fragment>
                                {landing_companies?.mt_gaming_company?.financial && (
                                    <Table.Head>{localize('Synthetic')}</Table.Head>
                                )}
                                {landing_companies?.mt_financial_company?.financial && (
                                    <Table.Head>
                                        {localize('Financial')}
                                        <Text size='s' weight='bold' className='cfd-compare-accounts__star'>
                                            *
                                        </Text>
                                    </Table.Head>
                                )}
                                {landing_companies?.mt_financial_company?.financial_stp && platform === 'mt5' && (
                                    <Table.Head>
                                        {localize('Financial STP')}
                                        <Text size='s' weight='bold' className='cfd-compare-accounts__star'>
                                            *
                                        </Text>
                                    </Table.Head>
                                )}
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Table.Head>{localize('Synthetic')}</Table.Head>
                                <Table.Head>
                                    {localize('Financial')}
                                    <Text size='s' weight='bold' className='cfd-compare-accounts__star'>
                                        *
                                    </Text>
                                </Table.Head>
                                {platform === 'mt5' && (
                                    <Table.Head>
                                        {localize('Financial STP')}
                                        <Text size='s' weight='bold' className='cfd-compare-accounts__star'>
                                            *
                                        </Text>
                                    </Table.Head>
                                )}
                            </React.Fragment>
                        )}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {cols.map((row, i) => (
                        <Table.Row key={i} className='cfd-compare-accounts__table-row'>
                            {Object.keys(row).map((col, j) => (
                                <Table.Cell key={j} fixed={j === 0}>
                                    {row[col]}
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <CFDCompareAccountHint platform={platform} show_risk_message={show_risk_message} />
        </ThemedScrollbars>
    );
};

const CompareAccountsModal = ({
    disableApp,
    enableApp,
    is_compare_accounts_visible,
    landing_companies,
    is_loading,
    is_logged_in,
    is_eu,
    is_eu_country,
    platform,
    toggleCompareAccounts,
}) => {
    const show_eu_related = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);

    return (
        <div
            className='cfd-compare-accounts-modal__wrapper'
            style={{ marginTop: platform === 'dxtrade' ? '5rem' : '2.4rem' }}
        >
            <Button
                className='cfd-dashboard__welcome-message--button'
                has_effect
                text={localize('Compare accounts')}
                onClick={toggleCompareAccounts}
                secondary
                disabled={is_loading}
            />
            <React.Suspense fallback={<UILoader />}>
                <DesktopWrapper>
                    <Modal
                        className='cfd-dashboard__compare-accounts'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        is_open={is_compare_accounts_visible}
                        title={localize('Compare accounts')}
                        toggleModal={toggleCompareAccounts}
                        type='button'
                        height='696px'
                        width='903px'
                    >
                        <ModalContent
                            is_logged_in={is_logged_in}
                            landing_companies={landing_companies}
                            platform={platform}
                            show_eu_related={show_eu_related}
                        />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileDialog
                        portal_element_id='deriv_app'
                        title={localize('Compare accounts')}
                        wrapper_classname='cfd-dashboard__compare-accounts'
                        visible={is_compare_accounts_visible}
                        onClose={toggleCompareAccounts}
                    >
                        <ModalContent
                            is_logged_in={is_logged_in}
                            landing_companies={landing_companies}
                            platform={platform}
                            show_eu_related={show_eu_related}
                        />
                    </MobileDialog>
                </MobileWrapper>
            </React.Suspense>
        </div>
    );
};

export default connect(({ modules, ui, client }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_compare_accounts_visible: modules.cfd.is_compare_accounts_visible,
    is_loading: client.is_populating_mt5_account_list,
    is_eu: client.is_eu,
    is_eu_country: client.is_eu_country,
    is_logged_in: client.is_logged_in,
    landing_companies: client.landing_companies,
    toggleCompareAccounts: modules.cfd.toggleCompareAccountsModal,
}))(CompareAccountsModal);
