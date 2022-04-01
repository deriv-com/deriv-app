import React from 'react';
import { Button, ButtonToggle, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import AppCard from 'Components/app-card';

type TLinkedAppCard = {
    app_name: string;
    app_icon: string;
};

type TApps = {
    app_type_title: string;
    linked_apps: Array<TLinkedAppCard>;
    toggleCompareAccountsModal?: () => void;
};

type TProps = {
    apps: Array<TApps>;
    is_dark_mode_on: boolean;
    is_mobile: boolean;
};

type TAccountTypeProps = {
    accountTypeChange: any;
    value: string;
};

const ToggleAccountType = ({ accountTypeChange, value }: TAccountTypeProps) => {
    const toggle_options = [
        { text: 'Real', value: 'Real' },
        { text: 'Demo', value: 'Demo' },
    ];

    return (
        <div className='toggle-account-type'>
            <ButtonToggle
                buttons_arr={toggle_options}
                className='toggle-account-type__button'
                has_rounded_button
                is_animated
                name='account_type'
                onChange={accountTypeChange}
                value={value}
            />
        </div>
    );
};

const AddApp = ({ apps, is_dark_mode_on, is_mobile }: TProps) => {
    const [account_type, setAccountType] = React.useState<'Real' | 'Demo'>('Real');
    const accountTypeChange = (event: any) => setAccountType(event.target.value);
    const [selected_app, setSeletedApp] = React.useState('');

    return (
        <div className='add-app'>
            <div className='add-app-container'>
                <div className='add-app-header'>
                    <div className='add-app-header__detail'>
                        {!is_mobile && (
                            <Text className='add-app-header__title' align='left' size='m' as='h2' weight='bold'>
                                <Localize i18n_default_text='Add an app' />
                            </Text>
                        )}
                        <ToggleAccountType accountTypeChange={accountTypeChange} value={account_type} />
                    </div>
                    {!is_mobile && (
                        <Text align='left' size='s' as='p' line_height='xxl'>
                            <Localize i18n_default_text='Choose an app to start.' />
                        </Text>
                    )}
                </div>
                <div className='add-app-details'>
                    {apps?.map((app, index) => {
                        return (
                            <>
                                <div key={`content${index}`} className='add-app-details-content'>
                                    <Text align='left' size='s' as='p' line_height='xxl' weight='bold'>
                                        <Localize i18n_default_text={app.app_type_title} />
                                    </Text>
                                    {!!app.toggleCompareAccountsModal && (
                                        <Button
                                            primary_light
                                            className='add-app-details-content__button'
                                            large
                                            onClick={app.toggleCompareAccountsModal}
                                            type='button'
                                        >
                                            <Localize i18n_default_text='Compare apps' />
                                        </Button>
                                    )}
                                </div>
                                <div key={`detail${index}`} className='add-app-details__cards'>
                                    {app.linked_apps.map((linked_app, id) => {
                                        return (
                                            <div
                                                key={`contentCard${id}`}
                                                className='add-app-details__card'
                                                onClick={() => setSeletedApp(linked_app.app_name)}
                                            >
                                                <AppCard
                                                    account_type={account_type}
                                                    app_card_details={linked_app}
                                                    checked={selected_app === linked_app.app_name}
                                                    dark={is_dark_mode_on}
                                                    faded
                                                    key={id.toString()}
                                                    size={is_mobile ? 'medium' : 'large'}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AddApp;
