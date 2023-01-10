import React from 'react';
import { Text, StatusBadge } from '@deriv/components';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';
import { platform_config, mf_platform_config, BrandConfig } from 'Constants/platform-config';
import './trading-app-card.scss';
import TradingAppCardActions, { Actions } from './trading-app-card-actions';
import { AvailableAccount, TDetailsOfEachMT5Loginid } from 'Types';
import { useStores } from 'Stores/index';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { ContentFlag } from '@deriv/shared';

const TradingAppCard = ({
    name,
    icon,
    action_type,
    description,
    is_deriv_platform = false,
    onAction,
    sub_title,
    has_divider,
    short_code_and_region,
    mt5_acc_auth_status,
}: Actions & BrandConfig & AvailableAccount & TDetailsOfEachMT5Loginid) => {
    const { traders_hub } = useStores();
    const { is_eu_user, is_demo_low_risk, content_flag, is_real } = traders_hub;

    const low_risk_cr_non_eu = content_flag === ContentFlag.LOW_RISK_CR_NON_EU;

    const platform = !is_eu_user || low_risk_cr_non_eu || is_demo_low_risk ? platform_config : mf_platform_config;

    const { app_desc, link_to, is_external } = platform.find(config => config.name === name) || {
        app_desc: description,
        link_to: '',
    };

    return (
        <div className='trading-app-card'>
            <div className='trading-app-card__icon--container'>
                <TradigPlatformIconProps icon={icon} size={48} />
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
                            account_status={mt5_acc_auth_status}
                            class_name='trading-app-card__acc_status_badge'
                        />
                    )}
                </div>
                <div className='trading-app-card__actions'>
                    <TradingAppCardActions
                        action_type={action_type}
                        link_to={link_to}
                        onAction={onAction}
                        is_external={is_external}
                        is_buttons_disabled={!!mt5_acc_auth_status}
                        is_real={is_real}
                    />
                </div>
            </div>
        </div>
    );
};

export default observer(TradingAppCard);
