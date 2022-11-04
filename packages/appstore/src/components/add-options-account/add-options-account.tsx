import React from 'react';
import { DesktopWrapper, MobileWrapper, Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import './add-options-account.scss';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { TRootStore } from 'Types';
import { isMobile } from '@deriv/shared';

const AddOptions = ({ ui }: Pick<TRootStore, 'ui'>) => {
    return (
        <React.Fragment>
            <div className='add-options-account__title'>
                <Text size={isMobile() ? 'xxs' : 's'} weight='bold'>
                    <Localize i18n_default_text='You need an Options and Multipliers account to create a CFD account.' />
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
                    text={localize('Get an Options and Multipliers account')}
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
