import React from 'react';
import { DesktopWrapper, MobileWrapper, Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import './add-options-account.scss';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { TRootStore } from 'Types';
import { isMobile } from '@deriv/shared';

const AddOptions = ({ ui }: Pick<TRootStore, 'ui'>) => {
    const { client } = useStores();
    const { is_eu } = client;
    const is_eu_country_text = is_eu
        ? 'You need to create a Multipliers account to create a CFD account.'
        : 'You need to create an Options and Multipliers account to create a CFD account.';

    const is_eu_country_btn = is_eu
        ? localize('Get a Multipliers account')
        : localize('Get an Options and Multipliers account');

    return (
        <React.Fragment>
            <div className='add-options-account__title'>
                <Text size={isMobile() ? 'xxs' : 's'} weight='bold'>
                    <Localize i18n_default_text={is_eu_country_text} />
                </Text>
            </div>
            <div className='add-options-account__button'>
                <Button
                    className='add-options-account__button'
                    type='submit'
                    has_effect
                    onClick={() => {
                        ui.openRealAccountSignup();
                    }}
                    is_disabled={false}
                    is_loading={false}
                    text={is_eu_country_btn}
                    medium
                    primary
                />
            </div>
        </React.Fragment>
    );
};

const AddOptionsAccount: React.FC = () => {
    const { ui } = useStores();
    return (
        <React.Fragment>
            <div className='add-options-account'>
                <DesktopWrapper>
                    <AddOptions ui={ui} />
                </DesktopWrapper>
                <MobileWrapper>
                    <AddOptions ui={ui} />
                </MobileWrapper>
            </div>
        </React.Fragment>
    );
};

export default observer(AddOptionsAccount);
