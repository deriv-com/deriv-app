import React from 'react';
import { getStatusBadgeConfig } from '@deriv/account';
import { Text, StatusBadge } from '@deriv/components';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';
import { getAppstorePlatforms, getMFAppstorePlatforms, BrandConfig } from 'Constants/platform-config';
import './trading-app-card.scss';
import TradingAppCardActions, { Actions } from './trading-app-card-actions';
import { AvailableAccount, TDetailsOfEachMT5Loginid } from 'Types';
import { useStores } from 'Stores/index';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { CFD_PLATFORMS, ContentFlag, getStaticUrl } from '@deriv/shared';

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
}: Actions & BrandConfig & AvailableAccount & TDetailsOfEachMT5Loginid) => {
    const { common, traders_hub } = useStores();
    const { is_eu_user, is_demo_low_risk, content_flag, is_real } = traders_hub;
    const { current_language } = common;

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
        selected_mt5_jurisdiction
    );

    const openStaticPage = () => {
        if (platform === CFD_PLATFORMS.MT5 && availability === 'EU')
            window.open(getStaticUrl(`/dmt5`, {}, false, true));
        else if (platform === CFD_PLATFORMS.MT5 && availability !== 'EU') window.open(getStaticUrl(`/dmt5`));
        else if (platform === CFD_PLATFORMS.DXTRADE) window.open(getStaticUrl(`/derivx`));
        else if (icon === 'Options' && !is_eu_user) window.open(getStaticUrl(`/trade-types/options/`));
        else;
    };

    return (
        <div className='trading-app-card' key={`trading-app-card__${current_language}`}>
            <div
                className={classNames('trading-app-card__icon--container', {
                    'trading-app-card__icon--container__clickable': clickable_icon,
                })}
            >
                <TradigPlatformIconProps icon={icon} onClick={clickable_icon ? openStaticPage : undefined} size={48} />
            </div>
            <div className={classNames('trading-app-card__container', { 'trading-app-card--divider': has_divider })}>
                <div className='trading-app-card__details'>
                    <div>
                        <Text className='title' size='xs' line_height='s'>
                            {sub_title}
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
                    <Text className='title' size='xs' line_height='s' weight='bold'>
                        {name}
                    </Text>
                    <Text
                        className='description'
                        color={is_deriv_platform ? 'less-prominent' : 'general'}
                        size='xxs'
                        line_height='m'
                    >
                        {app_desc}
                    </Text>
                    {mt5_acc_auth_status && (
                        <StatusBadge
                            className='trading-app-card__acc_status_badge'
                            account_status={mt5_acc_auth_status}
                            icon={badge_icon}
                            text={badge_text}
                        />
                    )}
                </div>
                <div className='trading-app-card__actions'>
                    <TradingAppCardActions
                        action_type={action_type}
                        link_to={link_to}
                        onAction={onAction}
                        is_external={is_external}
                        new_tab={new_tab}
                        is_buttons_disabled={!!mt5_acc_auth_status}
                        is_real={is_real}
                    />
                </div>
            </div>
        </div>
    );
};

export default observer(TradingAppCard);
