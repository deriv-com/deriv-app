import React from 'react';
import classNames from 'classnames';
import { Table, Div100vhContainer, Button, Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDesktop, WS, getAuthenticationStatusInfo, CFD_PLATFORMS } from '@deriv/shared';
import { connect } from '../Stores/connect';
import RootStore from '../Stores/index';
import { TTradingPlatformAvailableAccount } from '../Components/props.types';
import { DetailsOfEachMT5Loginid, GetSettings, GetAccountSettingsResponse, GetAccountStatus } from '@deriv/api-types';

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
    context: RootStore;
    account_settings: GetSettings;
    setAccountSettings: (get_settings_response: GetSettings) => void;
    account_type: TOpenAccountTransferMeta;
    setAccountType: (account_type: TOpenAccountTransferMeta) => void;
    clearCFDError: () => void;
    current_list: Record<string, DetailsOfEachMT5Loginid>;
    has_real_account: boolean;
    is_logged_in: boolean;
    is_demo_tab: boolean;
    is_real_enabled: boolean;
    is_virtual: boolean;
    openDerivRealAccountNeededModal: () => void;
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
    openSwitchToRealAccountModal: () => void;
    toggleCompareAccounts: () => void;
    toggleCFDVerificationModal: () => void;
    trading_platform_available_accounts: TTradingPlatformAvailableAccount[];
    toggleCFDPersonalDetailsModal: (is_from_mt5_compare_accounts?: boolean) => void;
    setJurisdictionSelectedShortcode: (shortcode: string) => void;
    show_eu_related: boolean;
    account_status: GetAccountStatus;
    upgradeable_landing_companies: unknown[];
    setAppstorePlatform: (platform: string) => void;
    should_show_derivx: boolean;
    should_restrict_bvi_account_creation: boolean;
    updateAccountStatus: () => void;
    real_account_creation_unlock_date: string;
    setShouldShowCooldownModal: (value: boolean) => void;
};

const eucontent: TModalContentProps[] = [
    {
        id: 'jurisdiction',
        attribute: localize('Jurisdiction'),
        values: {
            financial_maltainvest: { text: localize('Malta') },
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
                text: localize('Malta Financial Services Authority (MFSA) (Licence no. IS/70156)'),
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
                    localize('Commodities'),
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
                text: localize('Labuan'),
                tooltip_msg: localize(
                    'Choosing this jurisdiction will give you a Financial STP account. Your trades will go directly to the market and have tighter spreads.'
                ),
            },
            derivx: { text: localize('St. Vincent & Grenadines') },
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
            derivx: { text: localize('Deriv (SVG) LLC') },
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
                text: localize('Vanuatu Financial Services Commission'),
            },
            financial_labuan: { text: localize('Labuan Financial Services Authority (Licence no. MB/18/0024)') },
            derivx: { text: '-' },
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
            derivx: { text: localize('Up to 1:1000') },
        },
    },

    {
        id: 'instruments',
        attribute: localize('Trading instruments'),
        values: {
            synthetic_svg: { text: [localize('Synthetics'), localize('Basket indices')] },
            financial_svg: {
                text: [
                    localize('Forex: standard/micro'),
                    localize('Stocks'),
                    localize('Stock indices'),
                    localize('Commodities'),
                    localize('Cryptocurrencies'),
                ],
            },
            financial_vanuatu: {
                text: [
                    localize('Forex'),
                    localize('Stock indices'),
                    localize('Commodities'),
                    localize('Cryptocurrencies'),
                ],
            },
            financial_labuan: { text: [localize('Forex'), localize('Cryptocurrencies')] },
            derivx: {
                text: [
                    localize('Synthetics'),
                    localize('Forex: standard/micro'),
                    localize('Stocks'),
                    localize('Commodities'),
                    localize('Basket indices'),
                    localize('Cryptocurrencies'),
                ],
            },
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
    { label: localize('Add'), action: 'derivx' },
];
const eu_footer_button: TFooterButtonData[] = [{ label: localize('Add'), action: 'financial_maltainvest' }];

const DMT5CompareModalContent = ({
    account_settings,
    setAccountSettings,
    setAccountType,
    clearCFDError,
    current_list,
    has_real_account,
    is_logged_in,
    is_demo_tab,
    is_real_enabled,
    is_virtual,
    openDerivRealAccountNeededModal,
    openPasswordModal,
    openSwitchToRealAccountModal,
    toggleCFDVerificationModal,
    toggleCFDPersonalDetailsModal,
    toggleCompareAccounts,
    trading_platform_available_accounts,
    show_eu_related,
    setJurisdictionSelectedShortcode,
    account_status,
    upgradeable_landing_companies,
    setAppstorePlatform,
    should_show_derivx,
    should_restrict_bvi_account_creation,
    updateAccountStatus,
    real_account_creation_unlock_date,
    setShouldShowCooldownModal,
}: TDMT5CompareModalContentProps) => {
    const [has_submitted_personal_details, setHasSubmittedPersonalDetails] = React.useState(false);

    const mt5_platforms = trading_platform_available_accounts.map(
        account => `${account.market_type === 'gaming' ? 'synthetic' : account.market_type}_${account.shortcode}`
    );
    const has_synthetic = trading_platform_available_accounts.some(account => account.market_type === 'gaming');
    const available_accounts_keys = [...mt5_platforms, ...(should_show_derivx && has_synthetic ? ['derivx'] : [])];

    const logged_out_available_accounts_count = show_eu_related ? 1 : 6;
    const available_accounts_count = is_logged_in
        ? available_accounts_keys.length
        : logged_out_available_accounts_count;
    const synthetic_accounts_count =
        !is_logged_in && !show_eu_related
            ? 2
            : available_accounts_keys.filter(key => key.startsWith('synthetic')).length;
    const financial_accounts_count =
        !is_logged_in && !show_eu_related
            ? 4
            : available_accounts_keys.filter(key => key.startsWith('financial')).length || 1;

    const {
        poi_pending_for_vanuatu,
        poi_pending_for_bvi_labuan_maltainvest,
        poi_verified_for_vanuatu,
        poi_verified_for_bvi_labuan_maltainvest,
        poi_or_poa_not_submitted,
        poi_poa_verified_for_bvi_labuan_maltainvest,
        poi_acknowledged_for_bvi_labuan_maltainvest,
        poa_acknowledged,
        poa_pending,
    } = getAuthenticationStatusInfo(account_status);

    React.useEffect(() => {
        updateAccountStatus();
        if (!has_submitted_personal_details) {
            let get_settings_response: GetSettings = {};
            if (!account_settings) {
                WS.authorized.storage.getSettings().then((response: GetAccountSettingsResponse) => {
                    get_settings_response = response.get_settings as GetSettings;
                    setAccountSettings(response.get_settings as GetSettings);
                });
            } else {
                get_settings_response = account_settings;
            }
            const { citizen, place_of_birth, tax_residence, tax_identification_number, account_opening_reason } =
                get_settings_response;
            if (citizen && place_of_birth && tax_residence && tax_identification_number && account_opening_reason) {
                setHasSubmittedPersonalDetails(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAvailableAccountsContent = (_content: TModalContentProps[]) => {
        if (!is_logged_in) return _content;
        return _content.map(row_data => {
            const available_accounts_values = Object.entries(row_data.values).reduce(
                (acc, [key, value]) => (available_accounts_keys.includes(key) ? { ...acc, [key]: value } : acc),
                {} as TValues
            );
            const content_data = { ...row_data, values: {} as TValues };
            const col_num = should_show_derivx ? 7 : 6;
            if (available_accounts_keys.length < col_num && !show_eu_related) {
                // order of the values matters for data to be correctly displayed in the table
                const sorted_values = [
                    'synthetic_svg',
                    'synthetic_bvi',
                    'financial_svg',
                    'financial_bvi',
                    'financial_vanuatu',
                    'financial_labuan',
                    ...(should_show_derivx && synthetic_accounts_count > 0 ? ['derivx'] : []),
                ];
                content_data.values = sorted_values.reduce(
                    (acc, el) => (available_accounts_keys.includes(el) ? { ...acc, [el]: undefined } : acc),
                    {}
                );
                available_accounts_keys.forEach(key => {
                    if (row_data.id === 'leverage' && (key === 'financial_svg' || key === 'financial_bvi')) {
                        content_data.values[key] = row_data.values.financial_vanuatu;
                    } else if (row_data.id === 'instruments' && key === 'synthetic_bvi') {
                        content_data.values[key] = row_data.values.synthetic_svg;
                    } else if (row_data.id === 'instruments' && key === 'financial_bvi') {
                        content_data.values[key] = row_data.values.financial_svg;
                    }
                });
            }
            return { ...content_data, values: { ...content_data.values, ...available_accounts_values } };
        });
    };

    const getAvailableAccountsFooterButtons = (_footer_button_data: TFooterButtonData[]) => {
        return _footer_button_data.filter(data => available_accounts_keys.includes(data.action));
    };
    const openPersonalDetailsFormOrPasswordForm = (type_of_account: { category: string; type: string }) =>
        !has_submitted_personal_details ? toggleCFDPersonalDetailsModal(true) : openPasswordModal(type_of_account);

    const onSelectRealAccount = (item: TFooterButtonData) => {
        const account_type = item.action.startsWith('financial') ? 'financial' : 'synthetic';

        const type_of_account = {
            category: is_demo_tab ? 'demo' : 'real',
            type: account_type,
        };
        clearCFDError();
        setAccountType(type_of_account);

        switch (item.action) {
            case 'synthetic_svg':
            case 'financial_svg':
                setAppstorePlatform(CFD_PLATFORMS.MT5);
                setJurisdictionSelectedShortcode('svg');
                openPasswordModal(type_of_account);
                break;
            case 'synthetic_bvi':
            case 'financial_bvi':
                setAppstorePlatform(CFD_PLATFORMS.MT5);
                setJurisdictionSelectedShortcode('bvi');
                if (
                    poi_verified_for_bvi_labuan_maltainvest &&
                    !poi_or_poa_not_submitted &&
                    !should_restrict_bvi_account_creation
                ) {
                    openPersonalDetailsFormOrPasswordForm(type_of_account);
                } else {
                    toggleCFDVerificationModal();
                }
                break;
            case 'financial_vanuatu':
                setAppstorePlatform(CFD_PLATFORMS.MT5);
                setJurisdictionSelectedShortcode('vanuatu');
                if (poi_verified_for_vanuatu && !poi_or_poa_not_submitted) {
                    openPersonalDetailsFormOrPasswordForm(type_of_account);
                } else {
                    toggleCFDVerificationModal();
                }
                break;
            case 'financial_labuan':
                setAppstorePlatform(CFD_PLATFORMS.MT5);
                setJurisdictionSelectedShortcode('labuan');
                if (poi_poa_verified_for_bvi_labuan_maltainvest && !poi_or_poa_not_submitted) {
                    openPersonalDetailsFormOrPasswordForm(type_of_account);
                } else {
                    toggleCFDVerificationModal();
                }
                break;
            case 'financial_maltainvest':
                setAppstorePlatform(CFD_PLATFORMS.MT5);
                setJurisdictionSelectedShortcode('maltainvest');
                if (poi_poa_verified_for_bvi_labuan_maltainvest && !poi_or_poa_not_submitted) {
                    openPasswordModal(type_of_account);
                } else {
                    toggleCFDVerificationModal();
                }
                break;
            case 'derivx':
                setAppstorePlatform(CFD_PLATFORMS.DXTRADE);
                openPasswordModal(type_of_account);
                break;
            default:
        }
    };

    const isMt5AccountAdded = (item: TFooterButtonData) =>
        Object.entries(current_list).some(([key, value]) => {
            const [market, type] = item.action.split('_');
            const current_account_type = is_demo_tab ? 'demo' : 'real';
            return (
                value.market_type === market &&
                value.landing_company_short === type &&
                value.account_type === current_account_type &&
                key.includes(CFD_PLATFORMS.MT5)
            );
        });

    const isDxtradeAccountAdded = (item: TFooterButtonData) =>
        Object.entries(current_list).some(([key, value]) => {
            const current_account_type = is_demo_tab ? 'demo' : 'real';
            return value.account_type === current_account_type && key.includes(CFD_PLATFORMS.DXTRADE);
        });

    const onButtonClick = (item: TFooterButtonData) => {
        const should_show_missing_real_account =
            is_logged_in && !has_real_account && upgradeable_landing_companies?.length > 0 && is_real_enabled;
        toggleCompareAccounts();
        if (should_show_missing_real_account) {
            if (real_account_creation_unlock_date) {
                setShouldShowCooldownModal(true);
            } else {
                openDerivRealAccountNeededModal();
            }
        } else if (is_virtual && !['synthetic_svg', 'financial_svg'].includes(item.action)) {
            openSwitchToRealAccountModal();
        } else onSelectRealAccount(item);
    };

    const modal_content = show_eu_related ? eucontent : content;
    const modal_footer = show_eu_related ? eu_footer_button : footer_buttons;
    const getContentSize = (id: string) => {
        if (id === 'counterparty' || id === 'leverage') return isDesktop() ? 'xxs' : 'xxxs';
        return isDesktop() ? 'xxxs' : 'xxxxs';
    };

    const isAccountAdded = (item: TFooterButtonData) =>
        Object.entries(current_list).some(([key, value]) => {
            const [market, type] = item.action.split('_');
            return (
                value.market_type === market &&
                value.landing_company_short === type &&
                value.account_type === 'real' &&
                key.includes(CFD_PLATFORMS.MT5)
            );
        });

    const shouldShowPendingStatus = (item: TFooterButtonData) => {
        const type = item.action.split('_')[1];
        if (isAccountAdded(item)) {
            return false;
        } else if (type === 'svg' || item.action === 'derivx') {
            return false;
        } else if (type === 'vanuatu') {
            return poi_pending_for_vanuatu && !poi_or_poa_not_submitted;
        } else if (type === 'bvi') {
            if (should_restrict_bvi_account_creation && poa_pending) return true;
            return poi_pending_for_bvi_labuan_maltainvest && !poi_or_poa_not_submitted;
        }
        return (
            poi_acknowledged_for_bvi_labuan_maltainvest &&
            poa_acknowledged &&
            !poi_poa_verified_for_bvi_labuan_maltainvest
        );
    };

    const pre_appstore_class = should_show_derivx && synthetic_accounts_count ? '__pre-appstore' : '';

    const InstrumentsRow = ({ attr, val }: TInstrumentsRowProps) => (
        <Table.Row
            className={
                show_eu_related
                    ? 'cfd-real-compare-accounts-row-eu'
                    : classNames(`cfd-real-compare-accounts__table-row--instruments${pre_appstore_class}`, {
                          [`cfd-real-compare-accounts__row-with-columns-count-${available_accounts_count + 1}`]:
                              available_accounts_count < 6,
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
                        : classNames(`cfd-real-compare-accounts__table-row${pre_appstore_class}`, {
                              [`cfd-real-compare-accounts__table-row--leverage${pre_appstore_class}`]: is_leverage,
                              [`cfd-real-compare-accounts__row-with-columns-count-${available_accounts_count + 1}`]:
                                  available_accounts_count < 6,
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
                                        : classNames(`cfd-real-compare-accounts__table-header${pre_appstore_class}`, {
                                              [`cfd-real-compare-accounts__table-header-for-synthetic-${synthetic_accounts_count}-financial-${financial_accounts_count}${pre_appstore_class}`]:
                                                  available_accounts_count < 6,
                                          })
                                }
                            >
                                <Table.Head fixed className='cfd-real-compare-accounts__table-empty-cell' />
                                {!show_eu_related && synthetic_accounts_count > 0 && (
                                    <Table.Head className='cfd-real-compare-accounts__table-header-item'>
                                        {localize('Derived')}
                                    </Table.Head>
                                )}
                                {financial_accounts_count > 0 && (
                                    <Table.Head className='cfd-real-compare-accounts__table-header-item'>
                                        {show_eu_related ? localize('CFDs') : localize('Financial')}
                                    </Table.Head>
                                )}
                                {should_show_derivx && synthetic_accounts_count > 0 && (
                                    <Table.Head className='cfd-real-compare-accounts__table-header-item'>
                                        {localize('Deriv X')}
                                    </Table.Head>
                                )}
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
                                        : classNames(`cfd-real-compare-accounts__table-footer${pre_appstore_class}`, {
                                              [`cfd-real-compare-accounts__row-with-columns-count-${
                                                  available_accounts_count + 1
                                              }`]: available_accounts_count < 6,
                                          })
                                }
                            >
                                <Table.Cell fixed className='cfd-real-compare-accounts__table-empty-cell' />
                                {getAvailableAccountsFooterButtons(modal_footer).map((item, index) => (
                                    <Table.Cell key={index} className='cfd-real-compare-accounts__table-footer__item'>
                                        {shouldShowPendingStatus(item) ? (
                                            <div className='cfd-real-compare-accounts__table-footer__item--verification-pending'>
                                                <Text size={isDesktop ? 'xxs' : 'xxxs'} align='center'>
                                                    {localize('Pending verification')}
                                                </Text>
                                            </div>
                                        ) : (
                                            <Button
                                                className='cfd-real-compare-accounts__table-footer__button'
                                                disabled={
                                                    item.action === 'derivx'
                                                        ? isDxtradeAccountAdded(item)
                                                        : isMt5AccountAdded(item)
                                                }
                                                type='button'
                                                primary_light
                                                onClick={() => onButtonClick(item)}
                                            >
                                                {item.label}
                                            </Button>
                                        )}
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

export default connect(({ modules, client, common, ui }: RootStore) => ({
    account_type: modules.cfd.account_type,
    account_settings: client.account_settings,
    has_real_account: client.has_active_real_account,
    setAccountSettings: client.setAccountSettings,
    setAccountType: modules.cfd.setAccountType,
    clearCFDError: modules.cfd.clearCFDError,
    current_list: modules.cfd.current_list,
    has_real_mt5_login: client.has_real_mt5_login,
    is_virtual: client.is_virtual,
    setJurisdictionSelectedShortcode: modules.cfd.setJurisdictionSelectedShortcode,
    toggleCFDVerificationModal: modules.cfd.toggleCFDVerificationModal,
    toggleCFDPersonalDetailsModal: modules.cfd.toggleCFDPersonalDetailsModal,
    trading_platform_available_accounts: client.trading_platform_available_accounts,
    account_status: client.account_status,
    should_restrict_bvi_account_creation: client.should_restrict_bvi_account_creation,
    upgradeable_landing_companies: client.upgradeable_landing_companies,
    openSwitchToRealAccountModal: ui.openSwitchToRealAccountModal,
    setAppstorePlatform: common.setAppstorePlatform,
    updateAccountStatus: client.updateAccountStatus,
}))(DMT5CompareModalContent);
