import React from 'react';
import classNames from 'classnames';
import { Dropdown } from '@deriv/components';
import { getAccountTypes } from 'Constants/platform-config';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';
import { startPerformanceEventTimer, cacheTrackEvents } from '@deriv/shared';
import { TAccountCategory } from 'Types';
import './account-type-dropdown.scss';

const AccountTypeDropdown = observer(() => {
    const { traders_hub, client, common } = useStore();
    const { selected_account_type, selectAccountType } = traders_hub;
    const { setPrevAccountType } = client;
    const { current_language } = common;

    const [is_traders_dashboard_tracking_enabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'ce_tradershub_dashboard_tracking',
        defaultValue: false,
    });

    return (
        <div className={classNames('account-type-dropdown--parent')}>
            <Dropdown
                classNameIcon={`account-type-dropdown__icon--${selected_account_type}`}
                value={selected_account_type}
                classNameDisplay={classNames(
                    'account-type-dropdown',
                    `account-type-dropdown--${selected_account_type}`
                )}
                list={getAccountTypes()}
                key={`account-type-dropdown__icon--key-${current_language}`}
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    if ((selected_account_type as TAccountCategory) === 'real')
                        startPerformanceEventTimer('switch_from_real_to_demo_time');
                    else if ((selected_account_type as TAccountCategory) === 'demo')
                        startPerformanceEventTimer('switch_from_demo_to_real_time');
                    await selectAccountType(e.target.value);
                    await setPrevAccountType(e.target.value);
                    if (is_traders_dashboard_tracking_enabled) {
                        cacheTrackEvents.loadEvent([
                            {
                                event: {
                                    name: 'ce_tradershub_dashboard_form',
                                    properties: {
                                        action: 'switch_account_mode',
                                        form_name: 'traders_hub_default',
                                        account_mode: selected_account_type,
                                    },
                                },
                            },
                        ]);
                    }
                }}
            />
        </div>
    );
});

export default AccountTypeDropdown;
