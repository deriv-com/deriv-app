import * as React from 'react';
import Joyride from 'react-joyride';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import ToggleAccountType from 'Components/toggle-account-type';
import { tour_step_config, tour_styles, tour_step_locale, tour_styles_dark_mode } from 'Constants/tour-steps-config';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import CFDAccounts from 'Components/CFDs';
import { TAccountCategory } from 'Types';
import TotalAssets from 'Components/total-assets';
import { WS } from '@deriv/shared';
import Divider from 'Components/elements/divider';
import './trading-hub.scss';

const TradingHub: React.FC = () => {
    const { ui, client } = useStores();
    const { is_dark_mode_on } = ui;
    const { obj_total_balance } = client;
    /*TODO: We need to show this component whenever user click on tour guide button*/
    const [is_tour_open, setIsTourOpen] = React.useState(false);
    const [account_type, setAccountType] = React.useState<TAccountCategory>('demo');

    const accountTypeChange = (event: any) => {
        setAccountType(event.target.value);
    };

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
