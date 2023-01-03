import React from 'react';
import { DesktopWrapper, MobileWrapper, Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import './add-options-account.scss';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { isMobile } from '@deriv/shared';

const AddOptions = () => {
    const { traders_hub, ui } = useStores();

    const { is_real, is_eu_user } = traders_hub;

    const add_deriv_account_text = localize('You need a Deriv account to create a CFD account.');

    const add_deriv_account_btn = localize('Get a Deriv account');

    return (
        <React.Fragment>
            <div className='add-options-account__title'>
                <Text size={isMobile() ? 'xxs' : 's'} weight='bold'>
                    <Localize i18n_default_text={add_deriv_account_text} />
                </Text>
            </div>
            <div className='add-options-account__button'>
                <Button
                    className='add-options-account__button'
                    type='submit'
                    has_effect
                    onClick={() => {
                        if (is_real && is_eu_user) {
                            ui.openRealAccountSignup('maltainvest');
                        } else {
                            ui.openRealAccountSignup();
                        }
                    }}
                    is_disabled={false}
                    is_loading={false}
                    text={add_deriv_account_btn}
                    medium
                    primary
                />
            </div>
        </React.Fragment>
    );
};

const AddOptionsAccount = () => {
    return (
        <React.Fragment>
            <div className='add-options-account'>
                <DesktopWrapper>
                    <AddOptions />
                </DesktopWrapper>
                <MobileWrapper>
                    <AddOptions />
                </MobileWrapper>
            </div>
        </React.Fragment>
    );
};

export default observer(AddOptionsAccount);
