import * as React from 'react';
import { observer } from 'mobx-react-lite';
import Joyride from 'react-joyride';
import { useHistory } from 'react-router-dom';
import { Text, Button } from '@deriv/components';
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
    const { obj_total_balance } = client;

    const history = useHistory();
    /*TODO: We need to show this component whenever user click on tour guide button*/
    const [account_type, setAccountType] = React.useState<TAccountCategory>('demo');

    const accountTypeChange = (event: any) => {
        setAccountType(event.target.value);
    };

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
                    <TotalAssets
                        amount={account_type === 'demo' ? '100000' : '0'}
                        currency={obj_total_balance.currency}
                        category={account_type}
                        className='trading-hub_header--account_assets'
                    />
                    <ToggleAccountType
                        accountTypeChange={(event: any) => accountTypeChange(event)}
                        value={account_type}
                    />
                </div>
            </div>
            <div className='trading-hub_body'>
                <CFDAccounts account_type={account_type} />
                <Divider horizontal className='trading-hub_body--divider' />
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
