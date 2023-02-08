import React from 'react';
import { DesktopWrapper, MobileWrapper, Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import './add-options-account.scss';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { isMobile, ContentFlag } from '@deriv/shared';

const AddOptions = () => {
    const { client, traders_hub, ui } = useStores();
    const { is_real, content_flag } = traders_hub;
    const { setShouldShowCooldownModal, openRealAccountSignup } = ui;
    const { real_account_creation_unlock_date } = client;

    const add_deriv_account_text = localize('You need a Deriv account to create a CFD account.');
    const add_deriv_account_btn = localize('Get a Deriv account');

    const eu_user = content_flag === ContentFlag.LOW_RISK_CR_EU || content_flag === ContentFlag.EU_REAL;

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
                        if (is_real && eu_user) {
                            if (real_account_creation_unlock_date) {
                                setShouldShowCooldownModal(true);
                            } else {
                                openRealAccountSignup('maltainvest');
                            }
                        } else {
                            openRealAccountSignup();
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
