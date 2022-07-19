import React from 'react';
import classNames from 'classnames';
import { Table, Div100vhContainer, Button, Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDesktop } from '@deriv/shared';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { TTradingPlatformAvailableAccount } from './jurisdiction-modal';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

type TRowItem = {
    text: string | Array<string>;
    tooltip_msg?: string;
};

type TValues = Record<string, TRowItem | undefined>;

type TInstrumentsRowProps = {
    attr: string;
    val: TValues;
};

type TModalContentProps = {
    id: string;
    attribute: string;
    values: TValues;
};

type TFooterButtonData = { label: string; action: string };

type TOpenAccountTransferMeta = {
    category: string;
    type?: string;
};

type TDMT5CompareModalContentProps = {
    account_type: {
        type: string;
        category: string;
    };
    current_list: Record<string, DetailsOfEachMT5Loginid>;
    is_logged_in: boolean;
    is_demo_tab: boolean;
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
    toggleCompareAccounts: () => void;
    toggleCFDVerificationModal: () => void;
    trading_platform_available_accounts: TTradingPlatformAvailableAccount[];
    authentication_status: {
        document_status: string;
        identity_status: string;
    };
    has_real_mt5_login: boolean;
    toggleCFDPersonalDetailsModal: () => void;
    show_eu_related: boolean;
};

const eucontent: TModalContentProps[] = [
    {
        id: 'jurisdiction',
        attribute: localize('Jurisdiction'),
        values: {
            financial_maltainvest: { text: localize('Malta Financial Services Authority') },
        },
    },
    {
        id: 'counterparty',
        attribute: localize('Counterparty company'),
        values: {
            financial_maltainvest: { text: localize('Deriv Investments (Europe) Limited') },
        },
    },
    {
        id: 'regulator',
        attribute: localize('Regulator'),
        values: {
            financial_maltainvest: {
                text: localize('Malta Financial Services Authority (MFSA) (licence no. IS/70156)'),
            },
        },
    },

    {
        id: 'leverage',
        attribute: localize('Maximum leverage'),
        values: {
            financial_maltainvest: { text: localize('Up to 1:30') },
        },
    },

    {
        id: 'instruments',
        attribute: localize('Trading instruments'),
        values: {
            financial_maltainvest: {
                text: [
                    localize('Forex'),
                    localize('Stocks'),
                    localize('Stock indices'),
                    localize('Synthetic indices'),
                    localize('Cryptocurrencies'),
                ],
            },
        },
    },
];
const content: TModalContentProps[] = [
    {
        id: 'jurisdiction',
        attribute: localize('Jurisdiction'),
        values: {
            synthetic_svg: { text: localize('St. Vincent & Grenadines') },
            synthetic_bvi: { text: localize('British Virgin Islands') },
            financial_svg: { text: localize('St. Vincent & Grenadines') },
            financial_bvi: { text: localize('British Virgin Islands') },
            financial_vanuatu: { text: localize('Vanuatu') },
            financial_labuan: {
                text: localize('Labuan STP account'),
                tooltip_msg: localize(
                    'Your Financial (STP) trades go directly to the market. A Financial (STP) account offers you deep liquidity, fast execution and tight spreads.'
                ),
            },
        },
    },
    {
        id: 'counterparty',
        attribute: localize('Counterparty company'),
        values: {
            synthetic_svg: { text: localize('Deriv (SVG) LLC') },
            synthetic_bvi: { text: localize('Deriv (BVI) Ltd') },
            financial_svg: { text: localize('Deriv (SVG) LLC') },
            financial_bvi: { text: localize('Deriv (BVI) Ltd') },
            financial_vanuatu: { text: localize('Deriv (V) Ltd') },
            financial_labuan: { text: localize('Deriv (FX) Ltd') },
        },
    },
    {
        id: 'regulator',
        attribute: localize('Regulator'),
        values: {
            synthetic_svg: { text: localize('-') },
            synthetic_bvi: {
                text: localize('British Virgin Islands Financial Services Commission (licence no. SIBA/L/18/1114)'),
            },
            financial_svg: { text: localize('-') },
            financial_bvi: {
                text: localize('British Virgin Islands Financial Services Commission (licence no. SIBA/L/18/1114)'),
            },
            financial_vanuatu: {
                text: localize(
                    'Vanuatu Financial Services Commission, and is a member of the Financial Markets Association'
                ),
            },
            financial_labuan: { text: localize('Labuan Financial Services Authority (licence no. MB/18/0024)') },
        },
    },

    {
        id: 'leverage',
        attribute: localize('Maximum leverage'),
        values: {
            synthetic_svg: { text: localize('Up to 1:1000') },
            synthetic_bvi: { text: localize('Up to 1:1000') },
            financial_vanuatu: { text: localize('Up to 1:1000') },
            financial_labuan: { text: localize('Up to 1:100') },
        },
    },

    {
        id: 'instruments',
        attribute: localize('Trading instruments'),
        values: {
            synthetic_svg: { text: localize('Synthetics') },
            financial_svg: {
                text: [
                    localize('Forex: standard/micro'),
                    localize('Stocks'),
                    localize('Stock indices'),
                    localize('Equities'),
                    localize('Commodities'),
                    localize('Basket indices'),
                    localize('Cryptocurrencies'),
                ],
            },
            financial_vanuatu: {
                text: [localize('Forex'), localize('Commodities')],
            },
            financial_labuan: { text: [localize('Forex'), localize('Cryptocurrencies')] },
        },
    },
];

const footer_buttons: TFooterButtonData[] = [
    { label: localize('Add'), action: 'synthetic_svg' },
    { label: localize('Add'), action: 'synthetic_bvi' },
    { label: localize('Add'), action: 'financial_svg' },
    { label: localize('Add'), action: 'financial_bvi' },
    { label: localize('Add'), action: 'financial_vanuatu' },
    { label: localize('Add'), action: 'financial_labuan' },
];
const eu_footer_button: TFooterButtonData[] = [{ label: localize('Add'), action: 'financial_maltainvest' }];

const DMT5CompareModalContent = ({
    authentication_status,
    current_list,
    has_real_mt5_login,
    is_logged_in,
    is_demo_tab,
    openPasswordModal,
    toggleCFDVerificationModal,
    toggleCFDPersonalDetailsModal,
    toggleCompareAccounts,
    trading_platform_available_accounts,
    show_eu_related,
}: TDMT5CompareModalContentProps) => {
    const available_accounts_keys = trading_platform_available_accounts.map(
        account => `${account.market_type === 'gaming' ? 'synthetic' : account.market_type}_${account.shortcode}`
    );
    const synthetic_accounts_count = available_accounts_keys.filter(key => key.startsWith('synthetic')).length;
    const financial_accounts_count = available_accounts_keys.filter(key => key.startsWith('financial')).length;

    const getAvailableAccountsContent = (_content: TModalContentProps[]) => {
        return _content.map(row_data => {
            const available_accounts_values = Object.entries(row_data.values).reduce(
                (acc, [key, value]) =>
                    available_accounts_keys.includes(key) ? { ...acc, [key as keyof TValues]: value } : acc,
                {} as TValues
            );
            const content_data = { ...row_data, values: {} as TValues };
            if (available_accounts_keys.length < 6 && !show_eu_related) {
                // order of the values matters for data to be correctly displayed in the table
                const sorted_values = [
                    'synthetic_svg',
                    'synthetic_bvi',
                    'financial_svg',
                    'financial_bvi',
                    'financial_vanuatu',
                    'financial_labuan',
                ];
                content_data.values = sorted_values.reduce(
                    (acc, el) => (available_accounts_keys.includes(el) ? { ...acc, [el]: undefined } : acc),
                    {}
                );
                if (row_data.id === 'leverage') {
                    if (available_accounts_keys.includes('financial_svg'))
                        content_data.values.financial_svg = row_data.values.financial_vanuatu;
                    if (available_accounts_keys.includes('financial_bvi'))
                        content_data.values.financial_bvi = row_data.values.financial_vanuatu;
                } else if (row_data.id === 'instruments') {
                    if (available_accounts_keys.includes('synthetic_bvi'))
                        content_data.values.synthetic_bvi = row_data.values.synthetic_svg;
                    if (available_accounts_keys.includes('financial_bvi'))
                        content_data.values.financial_bvi = row_data.values.financial_svg;
                }
            }
            return { ...content_data, values: { ...content_data.values, ...available_accounts_values } };
        });
    };

    const getAvailableAccountsFooterButtons = (_footer_button_data: TFooterButtonData[]) => {
        return _footer_button_data.filter(data => available_accounts_keys.includes(data.action));
    };

    const onSelectRealAccount = (item: { label: string; action: string }) => {
        const poa_status = authentication_status?.document_status;
        const poi_status = authentication_status?.identity_status;

        const poi_poa_verified = poi_status === 'verified' && poa_status === 'verified';
        const account_type = item.action.startsWith('financial') ? 'financial' : 'synthetic';

        const type_of_account = {
            category: is_demo_tab ? 'demo' : 'real',
            type: account_type,
        };

        switch (item.action) {
            case 'synthetic_svg':
            case 'financial_svg':
                toggleCompareAccounts();
                setTimeout(() => {
                    openPasswordModal(type_of_account);
                }, 260);
                break;
            case 'synthetic_bvi':
            case 'financial_bvi':
            case 'financial_maltainvest':
                toggleCompareAccounts();
                setTimeout(() => {
                    if (poi_poa_verified) {
                        openPasswordModal(type_of_account);
                    } else {
                        toggleCFDVerificationModal();
                    }
                }, 260);

                break;

            case 'financial_vanuatu':
            case 'financial_labuan':
                toggleCompareAccounts();
                setTimeout(() => {
                    if (poi_poa_verified) {
                        // for bvi, labuan & vanuatu:
                        if (!has_real_mt5_login) {
                            setTimeout(() => {
                                toggleCFDPersonalDetailsModal();
                            }, 260);
                        } else {
                            setTimeout(() => {
                                openPasswordModal(type_of_account);
                            }, 260);
                        }
                    } else {
                        setTimeout(() => {
                            toggleCFDVerificationModal();
                        }, 260);
                    }
                }, 260);
                break;

            default:
        }
    };

    const modal_content = show_eu_related ? eucontent : content;
    const modal_footer = show_eu_related ? eu_footer_button : footer_buttons;
    const getContentSize = (id: string) => {
        if (id === 'counterparty' || id === 'leverage') return isDesktop() ? 'xxs' : 'xxxs';
        return isDesktop() ? 'xxxs' : 'xxxxs';
    };
    const InstrumentsRow = ({ attr, val }: TInstrumentsRowProps) => (
        <Table.Row
            className={
                show_eu_related
                    ? 'cfd-real-compare-accounts-row-eu'
                    : classNames('cfd-real-compare-accounts__table-row--instruments', {
                          [`cfd-real-compare-accounts__row-with-columns-count-${available_accounts_keys.length + 1}`]:
                              available_accounts_keys.length < 6,
                      })
            }
        >
            <Table.Cell fixed>
                <Text as='p' weight='bold' align='center' color='prominent' size='xxs'>
                    {attr}
                </Text>
            </Table.Cell>

            {Object.keys(val).map(rowKey => (
                <Table.Cell key={rowKey} className='cfd-real-compare-accounts__table-row-item'>
                    {Array.isArray(val[rowKey]?.text) ? (
                        (val[rowKey]?.text as []).map((item, index) => (
                            <Text key={index} as='p' weight=' normal' align='center' color='prominent' size='xxxs'>
                                {item}
                            </Text>
                        ))
                    ) : (
                        <Text as='p' weight='normal' align='center' color='prominent' size='xxxs'>
                            {val[rowKey]?.text}
                        </Text>
                    )}
                </Table.Cell>
            ))}
        </Table.Row>
    );

    const Row = ({ id, attribute, values }: TModalContentProps) => {
        const is_leverage = id === 'leverage';
        if (id === 'instruments') {
            return <InstrumentsRow attr={attribute} val={values} />;
        }
        return (
            <Table.Row
                className={
                    show_eu_related
                        ? 'cfd-real-compare-accounts-row-eu'
                        : classNames('cfd-real-compare-accounts__table-row', {
                              'cfd-real-compare-accounts__table-row--leverage': is_leverage,
                              [`cfd-real-compare-accounts__row-with-columns-count-${
                                  available_accounts_keys.length + 1
                              }`]: available_accounts_keys.length < 6,
                          })
                }
            >
                <Table.Cell fixed>
                    <Text as='p' weight='bold' align='center' color='prominent' size='xxs'>
                        {attribute}
                    </Text>
                </Table.Cell>

                {Object.keys(values).map(item => (
                    <Table.Cell
                        key={item}
                        className={classNames('cfd-real-compare-accounts__table-row-item', {
                            'cfd-real-compare-accounts__table-row-item--tooltip': values[item]?.tooltip_msg,
                        })}
                    >
                        <>
                            <Text
                                as='p'
                                weight={id === 'jurisdiction' ? 'bold' : 'normal'}
                                align='center'
                                color='prominent'
                                size={getContentSize(id)}
                            >
                                {values[item]?.text}
                            </Text>
                            {values[item]?.tooltip_msg && (
                                <Popover
                                    alignment='left'
                                    className='cfd-compare-accounts-tooltip'
                                    classNameBubble='cfd-compare-accounts-tooltip--msg'
                                    icon='info'
                                    disable_message_icon
                                    is_bubble_hover_enabled
                                    message={values[item]?.tooltip_msg}
                                    zIndex={9999}
                                />
                            )}
                        </>
                    </Table.Cell>
                ))}
            </Table.Row>
        );
    };

    return (
        <Div100vhContainer height_offset='40px' is_bypassed={isDesktop()} className='cfd-real-compare-accounts'>
            <div className='cfd-real-compare-accounts'>
                <div className='cfd-real-compare-accounts__table-wrapper'>
                    <Table className='cfd-real-compare-accounts__table'>
                        <Table.Header>
                            <Table.Row
                                className={
                                    show_eu_related
                                        ? 'cfd-real-compare-accounts-row-eu'
                                        : classNames('cfd-real-compare-accounts__table-header', {
                                              [`cfd-real-compare-accounts__table-header-for-synthetic-${synthetic_accounts_count}-financial-${financial_accounts_count}`]:
                                                  available_accounts_keys.length < 6,
                                          })
                                }
                            >
                                <Table.Head fixed className='cfd-real-compare-accounts__table-empty-cell' />
                                {!show_eu_related && (
                                    <Table.Head className='cfd-real-compare-accounts__table-header-item'>
                                        {localize('Synthetic')}
                                    </Table.Head>
                                )}
                                <Table.Head className='cfd-real-compare-accounts__table-header-item'>
                                    {show_eu_related ? localize('CFDs') : localize('Financial')}
                                </Table.Head>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {getAvailableAccountsContent(modal_content).map(row => (
                                <Row key={row.id} {...row} />
                            ))}
                        </Table.Body>
                        {is_logged_in && (
                            <Table.Row
                                className={
                                    show_eu_related
                                        ? 'cfd-real-compare-accounts-row-eu columns-2'
                                        : classNames('cfd-real-compare-accounts__table-footer', {
                                              [`cfd-real-compare-accounts__row-with-columns-count-${
                                                  available_accounts_keys.length + 1
                                              }`]: available_accounts_keys.length < 6,
                                          })
                                }
                            >
                                <Table.Cell fixed className='cfd-real-compare-accounts__table-empty-cell' />
                                {getAvailableAccountsFooterButtons(modal_footer).map((item, index) => (
                                    <Table.Cell key={index} className='cfd-real-compare-accounts__table-footer__item'>
                                        <Button
                                            className='cfd-real-compare-accounts__table-footer__button'
                                            disabled={Object.entries(current_list).some(
                                                ([, value]) => value.landing_company_short === item.action.split('_')[1]
                                            )}
                                            type='button'
                                            primary_light
                                            onClick={() => {
                                                onSelectRealAccount(item);
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    </Table.Cell>
                                ))}
                            </Table.Row>
                        )}
                    </Table>
                </div>
            </div>
        </Div100vhContainer>
    );
};

export default connect(({ modules, client }: RootStore) => ({
    account_type: modules.cfd.account_type,
    current_list: modules.cfd.current_list,
    has_real_mt5_login: client.has_real_mt5_login,
    authentication_status: client.authentication_status,
    toggleCompareAccounts: modules.cfd.toggleCompareAccountsModal,
    toggleCFDVerificationModal: modules.cfd.toggleCFDVerificationModal,
    toggleCFDPersonalDetailsModal: modules.cfd.toggleCFDPersonalDetailsModal,
    trading_platform_available_accounts: client.trading_platform_available_accounts,
}))(DMT5CompareModalContent);
