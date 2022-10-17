import * as React from 'react';
import { observer } from 'mobx-react-lite';
import Joyride from 'react-joyride';
import { useHistory } from 'react-router-dom';
import { Text, Button, ButtonToggle, Dropdown, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import ToggleAccountType from 'Components/toggle-account-type';
import { tour_step_config, tour_styles, tour_step_locale, tour_styles_dark_mode } from 'Constants/tour-steps-config';
import { useStores } from 'Stores';
import CFDAccounts from 'Components/CFDs';
import TotalAssets from 'Components/total-assets';
import Divider from 'Components/elements/divider';
import { TAccountCategory } from 'Types';
import './trading-hub.scss';

const TradingHub = () => {
    const { ui, client } = useStores();
    const { is_dark_mode_on, is_tour_open, toggleIsTourOpen } = ui;

    const history = useHistory();
    /*TODO: We need to show this component whenever user click on tour guide button*/
    const [account_type, setAccountType] = React.useState<TAccountCategory>('demo');
    const [platform_type, setPlatformType] = React.useState<any>('cfd');

    const accountTypeChange = (event: any) => {
        setAccountType(event.target.value);
    };
    const platformTypeChange = (event: any) => {
        setPlatformType(event.target.value);
    };

    const account_toggle_options = [
        { text: 'Real', value: 'real' },
        { text: 'Demo', value: 'demo' },
    ];

    const platform_toggle_options = [
        { text: 'CFD', value: 'cfd' },
        { text: 'Options', value: 'options' },
    ];

    tour_step_locale.last = (
        <Localize
            i18n_default_text='OK'
            onClick={() => {
                toggleIsTourOpen();
            }}
        />
    );

    tour_step_locale.back = (
        <Button
            has_effect
            text={localize('Repeat tour')}
            secondary
            medium
            onClick={() => {
                history.push(routes.onboarding);
                toggleIsTourOpen();
            }}
        />
    );

    return (
        <div id='trading-hub' className='trading-hub'>
            <div className='trading-hub_header'>
                <div className='trading-hub_header--title'>
                    <Text weight='bold' size='m'>
                        {localize('Welcome to Deriv trading hub')}
                    </Text>
                </div>
                <div className='trading-hub_header--account'>
                    <TotalAssets category={account_type} className='trading-hub_header--account_assets' />
                    <DesktopWrapper>
                        <ToggleAccountType
                            accountTypeChange={(event: any) => accountTypeChange(event)}
                            value={account_type}
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Dropdown
                            id='platfrom_toggle_options'
                            className='trading-hub_header--platfrom_toggle_options'
                            is_alignment_left={false}
                            is_nativepicker={false}
                            list={account_toggle_options}
                            name='multiplier'
                            no_border={true}
                            value={account_type}
                            onChange={accountTypeChange}
                        />
                    </MobileWrapper>
                </div>
            </div>

            <div className='trading-hub_body'>
                <DesktopWrapper>
                    <CFDAccounts account_type={account_type} />
                    <Divider horizontal className='trading-hub_body--divider' />
                    <div>Options</div>
                </DesktopWrapper>
                <MobileWrapper>
                    <ButtonToggle
                        buttons_arr={platform_toggle_options}
                        className='trading-hub_body--platform_type_toggle'
                        has_rounded_button
                        is_animated
                        name='platforn_type'
                        onChange={platformTypeChange}
                        value={platform_type}
                    />
                    {platform_type === 'cfd' && <CFDAccounts account_type={account_type} />}
                    {platform_type === 'options' && <div>Options</div>}
                </MobileWrapper>
            </div>
            <Joyride
                run={is_tour_open}
                continuous
                disableScrolling
                hideCloseButton
                disableCloseOnEsc
                steps={tour_step_config}
                styles={is_dark_mode_on ? tour_styles_dark_mode : tour_styles}
                locale={tour_step_locale}
                floaterProps={{
                    disableAnimation: true,
                }}
            />
        </div>
    );
};

export default observer(TradingHub);
