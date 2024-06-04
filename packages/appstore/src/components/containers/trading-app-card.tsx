import React from 'react';
import classNames from 'classnames';
import getStatusBadgeConfig from '@deriv/account/src/Configs/get-status-badge-config';
import { Text, StatusBadge } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import TradingPlatformIconProps from 'Assets/svgs/trading-platform';
import {
    BrandConfig,
    DERIV_PLATFORM_NAMES,
    getAppstorePlatforms,
    getMFAppstorePlatforms,
} from 'Constants/platform-config';
import TradingAppCardActions, { Actions } from './trading-app-card-actions';
import { AvailableAccount, TDetailsOfEachMT5Loginid } from 'Types';
import { observer, useStore } from '@deriv/stores';
import {
    CFD_PLATFORMS,
    ContentFlag,
    getStaticUrl,
    getUrlSmartTrader,
    getUrlBinaryBot,
    MT5_ACCOUNT_STATUS,
} from '@deriv/shared';
import OpenPositionsSVGModal from '../modals/open-positions-svg-modal';
import './trading-app-card.scss';

const TradingAppCard = ({
    availability,
    name,
    icon,
    action_type,
    clickable_icon = false,
    description,
    is_deriv_platform = false,
    onAction,
    sub_title,
    has_divider,
    platform,
    short_code_and_region,
    mt5_acc_auth_status,
    selected_mt5_jurisdiction,
    openFailedVerificationModal,
    market_type,
    is_new = false,
}: Actions & BrandConfig & AvailableAccount & TDetailsOfEachMT5Loginid) => {
    const {
        common,
        traders_hub,
        ui,
        modules: { cfd },
        client,
    } = useStore();
    const { setIsVerificationModalVisible } = ui;
    const { is_eu_user, is_demo_low_risk, content_flag, is_real, selected_account_type } = traders_hub;
    const { current_language } = common;
    const { is_account_being_created } = cfd;
    const { account_status: { authentication } = {}, is_logged_in } = client;

    const [is_open_position_svg_modal_open, setIsOpenPositionSvgModalOpen] = React.useState(false);
    const demo_label = localize('Demo');

    const low_risk_cr_non_eu = content_flag === ContentFlag.LOW_RISK_CR_NON_EU;

    const app_platform =
        !is_eu_user || low_risk_cr_non_eu || is_demo_low_risk ? getAppstorePlatforms() : getMFAppstorePlatforms();

    const { app_desc, link_to, is_external, new_tab } = app_platform.find(config => config.name === name) || {
        app_desc: description,
        link_to: '',
    };

    const { text: badge_text, icon: badge_icon } = getStatusBadgeConfig(
        mt5_acc_auth_status,
        openFailedVerificationModal,
        selected_mt5_jurisdiction,
        setIsVerificationModalVisible,
        { poi_status: authentication?.identity?.status, poa_status: authentication?.document?.status }
    );

    const handleStatusBadgeClick = (mt5_acc_auth_status: string) => {
        switch (mt5_acc_auth_status) {
            case MT5_ACCOUNT_STATUS.MIGRATED_WITH_POSITION:
            case MT5_ACCOUNT_STATUS.MIGRATED_WITHOUT_POSITION:
                return setIsOpenPositionSvgModalOpen(!is_open_position_svg_modal_open);
            default:
                return null;
        }
    };

    const openStaticPage = () => {
        Analytics.trackEvent('ce_tradershub_dashboard_form', {
            action: 'account_logo_push',
            form_name: 'traders_hub_default',
            account_mode: selected_account_type,
            account_name: !is_real ? `${sub_title === undefined ? name : sub_title}` : name,
        });
        if (is_deriv_platform) {
            switch (name) {
                case DERIV_PLATFORM_NAMES.TRADER:
                    window.open(getStaticUrl(`/dtrader`));
                    break;
                case DERIV_PLATFORM_NAMES.DBOT:
                    window.open(getStaticUrl(`/dbot`));
                    break;
                case DERIV_PLATFORM_NAMES.SMARTTRADER:
                    window.open(getUrlSmartTrader());
                    break;
                case DERIV_PLATFORM_NAMES.BBOT:
                    window.open(getUrlBinaryBot());
                    break;
                case DERIV_PLATFORM_NAMES.GO:
                    window.open(getStaticUrl('/deriv-go'));
                    break;
                default:
            }
        }
        if (platform === CFD_PLATFORMS.MT5 && availability === 'EU')
            window.open(getStaticUrl(`/dmt5`, {}, false, true));
        else if (platform === CFD_PLATFORMS.MT5 && availability !== 'EU') window.open(getStaticUrl(`/dmt5`));
        else if (platform === CFD_PLATFORMS.DXTRADE) window.open(getStaticUrl(`/derivx`));
        else if (platform === CFD_PLATFORMS.CTRADER) window.open(getStaticUrl(`/deriv-ctrader`));
        else if (icon === 'Options' && !is_eu_user)
            window.open(getStaticUrl(`trade-types/options/digital-options/up-and-down/`));
        else;
    };

    const migration_status =
        mt5_acc_auth_status === MT5_ACCOUNT_STATUS.MIGRATED_WITH_POSITION ||
        mt5_acc_auth_status === MT5_ACCOUNT_STATUS.MIGRATED_WITHOUT_POSITION;
    const is_disabled = !!(mt5_acc_auth_status && !migration_status) && !is_eu_user;
    const platform_name = is_account_being_created ? name : sub_title ?? name;

    const is_existing_real_ctrader_account =
        platform === CFD_PLATFORMS.CTRADER && is_real && action_type === 'multi-action';

    return (
        <div className='trading-app-card' key={`trading-app-card__${current_language}`}>
            <div
                className={classNames('trading-app-card__icon--container', {
                    'trading-app-card__icon--container__clickable': clickable_icon,
                })}
            >
                <TradingPlatformIconProps icon={icon} onClick={clickable_icon ? openStaticPage : undefined} size={48} />
            </div>
            <div
                className={classNames('trading-app-card__container', { 'trading-app-card--divider': has_divider })}
                data-testid={`dt_trading-app-card_${is_real ? 'real' : 'demo'}_${platform_name
                    .replaceAll(' ', '-')
                    .toLowerCase()}${
                    selected_mt5_jurisdiction?.jurisdiction ? `_${selected_mt5_jurisdiction.jurisdiction}` : ''
                }`}
            >
                <div className='trading-app-card__details'>
                    <div>
                        <Text
                            className='title'
                            size='xs'
                            line_height='s'
                            color='prominent'
                            data-testid='dt_cfd-account-name'
                        >
                            {!is_real && sub_title ? `${sub_title} ${demo_label}` : sub_title}
                        </Text>
                        {short_code_and_region && (
                            <Text
                                weight='bolder'
                                size='xxxs'
                                line_height='s'
                                className='trading-app-card__details__short-code'
                            >
                                {short_code_and_region}
                            </Text>
                        )}
                    </div>
                    <div>
                        <Text
                            className='title'
                            size='xs'
                            line_height='s'
                            weight='bold'
                            color={action_type === 'trade' ? 'prominent' : 'general'}
                            data-testid={
                                action_type === 'get' || is_deriv_platform ? 'dt_platform-name' : 'dt_account-balance'
                            }
                        >
                            {!is_real && !sub_title && !is_deriv_platform ? `${name} ${localize('Demo')}` : name}
                        </Text>
                        {is_new && (
                            <Text
                                className='trading-app-card__details__new'
                                weight='bolder'
                                size='xxxs'
                                line_height='s'
                            >
                                {localize('NEW!')}
                            </Text>
                        )}
                    </div>
                    <Text
                        className='description'
                        color={'general'}
                        size='xxs'
                        line_height='m'
                        data-testid={
                            action_type === 'get' || is_deriv_platform ? 'dt_platform-description' : 'dt_account-id'
                        }
                    >
                        {is_existing_real_ctrader_account ? '' : app_desc}
                    </Text>
                    {mt5_acc_auth_status && (
                        <StatusBadge
                            className='trading-app-card__acc_status_badge'
                            account_status={mt5_acc_auth_status}
                            icon={badge_icon}
                            text={badge_text}
                            onClick={() => handleStatusBadgeClick(mt5_acc_auth_status)}
                        />
                    )}
                    <OpenPositionsSVGModal
                        market_type={market_type}
                        status={mt5_acc_auth_status ?? ''}
                        is_modal_open={is_open_position_svg_modal_open}
                        setModalOpen={setIsOpenPositionSvgModalOpen}
                    />
                </div>
                <div className='trading-app-card__actions'>
                    <TradingAppCardActions
                        action_type={action_type}
                        link_to={link_to}
                        onAction={onAction}
                        is_external={is_external}
                        new_tab={new_tab}
                        is_buttons_disabled={
                            //For MF, we enable the button even if account is not authenticated. Rest of jurisdictions, disable the button for pending, failed and needs verification
                            is_disabled
                        }
                        is_account_being_created={!!is_account_being_created}
                        is_real={is_real}
                    />
                </div>
            </div>
        </div>
    );
};

export default observer(TradingAppCard);
