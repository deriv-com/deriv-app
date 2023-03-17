import React from 'react';
import classNames from 'classnames';
import { Table, Button, Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDesktop, WS, getAuthenticationStatusInfo, CFD_PLATFORMS, ContentFlag } from '@deriv/shared';
import { connect } from '../Stores/connect';
import RootStore from '../Stores/index';
import {
    TDMT5CompareModalContentProps,
    TCompareAccountContentProps,
    TCompareAccountFooterButtonData,
    TCompareAccountContentValues,
    TCompareAccountRowProps,
    TCompareAccountRowItem,
} from './props.types';
import {
    eu_real_content,
    cr_real_content,
    cr_real_footer_buttons,
    eu_real_footer_button,
    preappstore_cr_demo_content,
    preappstore_cr_demo_footer_buttons,
    preppstore_eu_demo_content,
    eu_demo_footer_button,
} from '../Constants/cfd_compare_account_content';
import { GetSettings, GetAccountSettingsResponse } from '@deriv/api-types';

const Row = ({
    id,
    attribute,
    values,
    pre_appstore_class,
    available_accounts_count,
    classname_for_demo_and_eu,
    is_pre_appstore_setting,
    content_flag,
    is_high_risk_for_mt5,
}: TCompareAccountRowProps) => {
    const is_leverage_row = id === 'leverage';
    const is_platform_row = id === 'platform';
    const is_instruments_row = id === 'instruments';

    const getContentSize = () => {
        if (id === 'counterparty' || id === 'leverage') return isDesktop() ? 'xxs' : 'xxxs';
        return isDesktop() ? 'xxxs' : 'xxxxs';
    };

    if (is_platform_row && !is_pre_appstore_setting) {
        return null;
    }
    if (is_platform_row && content_flag === ContentFlag.HIGH_RISK_CR && is_high_risk_for_mt5) {
        // needed to adjust the design for high risk
        values.financial_svg = { text: 'MT5' };
    }
    return (
        <Table.Row
            className={
                classname_for_demo_and_eu ??
                classNames(`cfd-accounts-compare-modal__table-row${pre_appstore_class}`, {
                    [`cfd-accounts-compare-modal__table-row--leverage${pre_appstore_class}`]: is_leverage_row,
                    [`cfd-accounts-compare-modal__row-with-columns-count-${available_accounts_count + 1}`]:
                        available_accounts_count < 6,
                    [`cfd-accounts-compare-modal__table-row--platform${pre_appstore_class}`]: is_platform_row,
                    [`cfd-accounts-compare-modal__table-row--instruments${pre_appstore_class}`]: is_instruments_row,
                })
            }
        >
            <Table.Cell fixed>
                <Text as='p' weight='bold' color='prominent' size='xxs'>
                    {attribute}
                </Text>
            </Table.Cell>

            {Object.keys(values).map(rowKey => (
                <Table.Cell
                    key={rowKey}
                    className={classNames('cfd-accounts-compare-modal__table-row-item', {
                        'cfd-accounts-compare-modal__table-row-item--tooltip': (
                            values[rowKey] as TCompareAccountRowItem
                        )?.tooltip_msg,
                    })}
                >
                    <>
                        {Array.isArray(values[rowKey]) ? (
                            (values[rowKey] as TCompareAccountRowItem[])?.map((item, index) => (
                                <Text
                                    key={index}
                                    as='p'
                                    color={item?.options?.color ?? 'prominent'}
                                    weight={item?.options?.weight ?? 'normal'}
                                    align={item?.options?.align ?? 'center'}
                                    size={item?.options?.size ?? getContentSize()}
                                    styles={item?.options?.styles ?? ''}
                                >
                                    {item.text}
                                    {item?.options?.should_show_asterick_at_end && (
                                        <Text color={'loss-danger'} size={'xxxs'}>
                                            *
                                        </Text>
                                    )}
                                </Text>
                            ))
                        ) : (
                            <>
                                <Text
                                    as='p'
                                    weight={(values[rowKey] as TCompareAccountRowItem)?.options?.weight ?? 'normal'}
                                    align={(values[rowKey] as TCompareAccountRowItem)?.options?.align ?? 'center'}
                                    color={(values[rowKey] as TCompareAccountRowItem)?.options?.color ?? 'prominent'}
                                    size={(values[rowKey] as TCompareAccountRowItem)?.options?.size ?? getContentSize()}
                                    styles={(values[rowKey] as TCompareAccountRowItem)?.options?.styles ?? ''}
                                >
                                    {(values[rowKey] as TCompareAccountRowItem)?.text}
                                </Text>
                                {(values[rowKey] as TCompareAccountRowItem)?.tooltip_msg && (
                                    <Popover
                                        alignment='left'
                                        className='cfd-compare-accounts-tooltip'
                                        classNameBubble='cfd-compare-accounts-tooltip--msg'
                                        icon='info'
                                        disable_message_icon
                                        is_bubble_hover_enabled
                                        message={(values[rowKey] as TCompareAccountRowItem)?.tooltip_msg}
                                        zIndex={9999}
                                    />
                                )}
                            </>
                        )}
                    </>
                </Table.Cell>
            ))}
        </Table.Row>
    );
};

const DMT5CompareModalContent = ({
    content_flag,
    account_settings,
    account_status,
    clearCFDError,
    current_list,
    has_real_account,
    is_demo_tab,
    is_logged_in,
    is_pre_appstore_setting,
    is_preappstore_cr_demo_account,
    is_real_enabled,
    is_virtual,
    openDerivRealAccountNeededModal,
    openPasswordModal,
    openSwitchToRealAccountModal,
    real_account_creation_unlock_date,
    setAccountSettings,
    setAccountType,
    setAppstorePlatform,
    setJurisdictionSelectedShortcode,
    setShouldShowCooldownModal,
    should_restrict_bvi_account_creation,
    should_restrict_vanuatu_account_creation,
    should_show_derivx,
    show_eu_related_content,
    toggleCFDVerificationModal,
    toggleCompareAccounts,
    trading_platform_available_accounts,
    upgradeable_landing_companies,
    updateMT5Status,
    no_CR_account,
    is_eu_user,
    no_MF_account,
}: TDMT5CompareModalContentProps) => {
    const [has_submitted_personal_details, setHasSubmittedPersonalDetails] = React.useState(false);

    const mt5_platforms = trading_platform_available_accounts.map(
        account => `${account.market_type === 'gaming' ? 'synthetic' : account.market_type}_${account.shortcode}`
    );

    const has_synthetic = trading_platform_available_accounts.some(account => account.market_type === 'gaming');
    const available_accounts_keys = [...mt5_platforms, ...(should_show_derivx && has_synthetic ? ['derivx'] : [])];

    const logged_out_available_accounts_count = show_eu_related_content ? 1 : 6;
    const available_accounts_count = is_logged_in
        ? available_accounts_keys.length
        : logged_out_available_accounts_count;
    const synthetic_accounts_count =
        !is_logged_in && !show_eu_related_content
            ? 2
            : available_accounts_keys.filter(key => key.startsWith('synthetic')).length;
    const financial_accounts_count =
        !is_logged_in && !show_eu_related_content
            ? 4
            : available_accounts_keys.filter(key => key.startsWith('financial')).length || 1;

    const is_high_risk_for_mt5 = synthetic_accounts_count === 1 && financial_accounts_count === 1;
    const {
        poi_or_poa_not_submitted,
        poi_acknowledged_for_vanuatu_maltainvest,
        poi_acknowledged_for_bvi_labuan,
        poa_acknowledged,
        poa_pending,
    } = getAuthenticationStatusInfo(account_status);

    React.useEffect(() => {
        if (is_logged_in && !is_virtual) {
            updateMT5Status();
        }
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

    const getAvailableAccountsContent = (modal_content: TCompareAccountContentProps[]) => {
        if (!is_logged_in) {
            if (show_eu_related_content) {
                return modal_content;
            }
            const mt5_data = modal_content.map(item => {
                const { derivx, ...rest } = item.values; // eslint-disable-line @typescript-eslint/no-unused-vars
                return { ...item, values: rest };
            });
            return mt5_data;
        }
        return modal_content.map(row_data => {
            const available_accounts_values = Object.entries(row_data.values).reduce(
                (acc, [key, value]) => (available_accounts_keys.includes(key) ? { ...acc, [key]: value } : acc),
                {} as TCompareAccountContentValues
            );
            const content_data = { ...row_data, values: {} as TCompareAccountContentValues };
            const col_num = should_show_derivx ? 7 : 6;
            if (available_accounts_keys.length < col_num && !show_eu_related_content) {
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

    const getAvailableAccountsFooterButtons = (footer_button_data: TCompareAccountFooterButtonData[]) => {
        return footer_button_data.filter(data => available_accounts_keys.includes(data.action));
    };

    const onSelectRealAccount = (item: TCompareAccountFooterButtonData) => {
        const selected_account_type = () => {
            if (item.action === 'derivx') return 'all';
            return item.action.startsWith('financial') ? 'financial' : 'synthetic';
        };

        const type_of_account = {
            category: is_demo_tab ? 'demo' : 'real',
            type: selected_account_type(),
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
                    poi_acknowledged_for_bvi_labuan &&
                    !poi_or_poa_not_submitted &&
                    !should_restrict_bvi_account_creation &&
                    has_submitted_personal_details &&
                    poa_acknowledged
                ) {
                    openPasswordModal(type_of_account);
                } else {
                    toggleCFDVerificationModal();
                }
                break;
            case 'synthetic_vanuatu':
            case 'financial_vanuatu':
                setAppstorePlatform(CFD_PLATFORMS.MT5);
                setJurisdictionSelectedShortcode('vanuatu');
                if (
                    poi_acknowledged_for_vanuatu_maltainvest &&
                    !poi_or_poa_not_submitted &&
                    !should_restrict_vanuatu_account_creation &&
                    has_submitted_personal_details &&
                    poa_acknowledged
                ) {
                    openPasswordModal(type_of_account);
                } else {
                    toggleCFDVerificationModal();
                }
                break;
            case 'financial_labuan':
                setAppstorePlatform(CFD_PLATFORMS.MT5);
                setJurisdictionSelectedShortcode('labuan');
                if (poi_acknowledged_for_bvi_labuan && poa_acknowledged && has_submitted_personal_details) {
                    openPasswordModal(type_of_account);
                } else {
                    toggleCFDVerificationModal();
                }
                break;
            case 'financial_maltainvest':
                setAppstorePlatform(CFD_PLATFORMS.MT5);
                setJurisdictionSelectedShortcode('maltainvest');
                if ((poi_acknowledged_for_vanuatu_maltainvest && poa_acknowledged) || is_demo_tab) {
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

    const isMt5AccountAdded = (item: TCompareAccountFooterButtonData) =>
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

    const isDxtradeAccountAdded = () =>
        Object.entries(current_list).some(([key, value]) => {
            const current_account_type = is_demo_tab ? 'demo' : 'real';
            return value.account_type === current_account_type && key.includes(CFD_PLATFORMS.DXTRADE);
        });

    const onButtonClick = (item: TCompareAccountFooterButtonData) => {
        const if_no_corresponding_real_account = is_pre_appstore_setting
            ? (no_CR_account && !is_eu_user) || (no_MF_account && is_eu_user)
            : !has_real_account;

        const should_show_missing_real_account =
            is_logged_in &&
            if_no_corresponding_real_account &&
            upgradeable_landing_companies?.length > 0 &&
            is_real_enabled;

        toggleCompareAccounts();
        if (should_show_missing_real_account) {
            if (real_account_creation_unlock_date && item.action === 'financial_maltainvest') {
                setShouldShowCooldownModal(true);
            } else {
                openDerivRealAccountNeededModal();
            }
        } else if (
            is_virtual &&
            !['synthetic_svg', 'financial_svg', 'derivx', 'financial_maltainvest'].includes(item.action)
        ) {
            openSwitchToRealAccountModal();
        } else {
            onSelectRealAccount(item);
        }
    };

    const getModalContent = () => {
        if (is_preappstore_cr_demo_account) {
            return preappstore_cr_demo_content;
        } else if (show_eu_related_content) {
            if (is_pre_appstore_setting && content_flag === ContentFlag.EU_DEMO) {
                return preppstore_eu_demo_content;
            }
            return eu_real_content;
        }
        return cr_real_content;
    };

    const modal_footer = () => {
        if (is_preappstore_cr_demo_account) return preappstore_cr_demo_footer_buttons;
        else if (is_demo_tab && show_eu_related_content) return eu_demo_footer_button;
        return show_eu_related_content ? eu_real_footer_button : cr_real_footer_buttons;
    };

    const shouldShowPendingStatus = (item: TCompareAccountFooterButtonData) => {
        const type = item.action.split('_')[1];
        if (isMt5AccountAdded(item)) {
            return false;
        } else if (item.action === 'derivx') {
            return false;
        } else if (type === 'bvi' && should_restrict_bvi_account_creation && poa_pending) {
            return true;
        } else if (type === 'vanuatu' && should_restrict_vanuatu_account_creation && poa_pending) {
            return true;
        }

        return false;
    };

    const pre_appstore_class = should_show_derivx && synthetic_accounts_count ? '__pre-appstore' : '';

    const getClassNamesForDemoAndEu = () => {
        if (is_preappstore_cr_demo_account) return 'cfd-accounts-compare-modal-row-demo';
        else if (show_eu_related_content) return 'cfd-accounts-compare-modal-row-eu';
        return null;
    };

    const classname_for_demo_and_eu = getClassNamesForDemoAndEu();

    return (
        <div className='cfd-accounts-compare-modal'>
            <div className='cfd-accounts-compare-modal__table-wrapper'>
                <Table className='cfd-accounts-compare-modal__table'>
                    <Table.Header>
                        <Table.Row
                            className={
                                classname_for_demo_and_eu ??
                                classNames(`cfd-accounts-compare-modal__table-header${pre_appstore_class}`, {
                                    [`cfd-accounts-compare-modal__table-header-for-synthetic-${synthetic_accounts_count}-financial-${financial_accounts_count}${pre_appstore_class}`]:
                                        available_accounts_count < 6,
                                })
                            }
                        >
                            <Table.Head fixed className='cfd-accounts-compare-modal__table-empty-cell' />
                            {!show_eu_related_content && synthetic_accounts_count > 0 && (
                                <Table.Head className='cfd-accounts-compare-modal__table-header-item'>
                                    {localize('Derived')}
                                </Table.Head>
                            )}
                            {financial_accounts_count > 0 && (
                                <Table.Head className='cfd-accounts-compare-modal__table-header-item'>
                                    {show_eu_related_content ? localize('CFDs') : localize('Financial')}
                                </Table.Head>
                            )}
                            {should_show_derivx && synthetic_accounts_count > 0 && (
                                <Table.Head className='cfd-accounts-compare-modal__table-header-item'>
                                    {localize('Deriv X')}
                                </Table.Head>
                            )}
                        </Table.Row>
                    </Table.Header>

                    <React.Fragment>
                        <Table.Body>
                            {getAvailableAccountsContent(getModalContent()).map(row => (
                                <Row
                                    key={row.id}
                                    {...row}
                                    pre_appstore_class={pre_appstore_class}
                                    available_accounts_count={available_accounts_count}
                                    classname_for_demo_and_eu={classname_for_demo_and_eu}
                                    is_pre_appstore_setting={is_pre_appstore_setting}
                                    content_flag={content_flag}
                                    is_high_risk_for_mt5={is_high_risk_for_mt5}
                                />
                            ))}
                        </Table.Body>
                        {is_logged_in && (
                            <Table.Row
                                className={
                                    classname_for_demo_and_eu ??
                                    classNames(`cfd-accounts-compare-modal__table-footer${pre_appstore_class}`, {
                                        [`cfd-accounts-compare-modal__row-with-columns-count-${
                                            available_accounts_count + 1
                                        }`]: available_accounts_count < 6,
                                    })
                                }
                            >
                                <Table.Cell
                                    fixed
                                    className={
                                        'cfd-accounts-compare-modal__table-empty-cell cfd-accounts-compare-modal__table-footer__item'
                                    }
                                />

                                {getAvailableAccountsFooterButtons(modal_footer()).map((item, index) => (
                                    <Table.Cell
                                        key={index}
                                        className={classNames('cfd-accounts-compare-modal__table-footer__item', {
                                            [`cfd-accounts-compare-modal__table-footer__item--eu-pre_appstore}`]:
                                                is_pre_appstore_setting && show_eu_related_content,
                                        })}
                                    >
                                        {!is_demo_tab && shouldShowPendingStatus(item) ? (
                                            <div className='cfd-accounts-compare-modal__table-footer__item--verification-pending'>
                                                <Text size={isDesktop ? 'xxs' : 'xxxs'} align='center'>
                                                    {localize('Pending verification')}
                                                </Text>
                                            </div>
                                        ) : (
                                            <Button
                                                className='cfd-accounts-compare-modal__table-footer__button'
                                                disabled={
                                                    item.action === 'derivx'
                                                        ? isDxtradeAccountAdded()
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
                    </React.Fragment>
                </Table>
            </div>
        </div>
    );
};

export default connect(({ modules, client, common, ui, traders_hub }: RootStore) => ({
    account_settings: client.account_settings,
    account_status: client.account_status,
    account_type: modules.cfd.account_type,
    clearCFDError: modules.cfd.clearCFDError,
    current_list: modules.cfd.current_list,
    has_real_account: client.has_active_real_account,
    has_real_mt5_login: client.has_real_mt5_login,
    is_virtual: client.is_virtual,
    openSwitchToRealAccountModal: ui.openSwitchToRealAccountModal,
    setAccountSettings: client.setAccountSettings,
    setAccountType: modules.cfd.setAccountType,
    setJurisdictionSelectedShortcode: modules.cfd.setJurisdictionSelectedShortcode,
    should_restrict_bvi_account_creation: client.should_restrict_bvi_account_creation,
    should_restrict_vanuatu_account_creation: client.should_restrict_vanuatu_account_creation,
    toggleCFDVerificationModal: modules.cfd.toggleCFDVerificationModal,
    trading_platform_available_accounts: client.trading_platform_available_accounts,
    updateMT5Status: client.updateMT5Status,
    upgradeable_landing_companies: client.upgradeable_landing_companies,
    setAppstorePlatform: common.setAppstorePlatform,
    no_CR_account: traders_hub.no_CR_account,
    is_eu_user: traders_hub.is_eu_user,
    no_MF_account: traders_hub.no_MF_account,
}))(DMT5CompareModalContent);
