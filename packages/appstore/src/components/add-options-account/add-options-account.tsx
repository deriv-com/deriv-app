import React from 'react';
import { Text } from '@deriv/ui';
import { DesktopWrapper, MobileWrapper, Button } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import './add-options-account.scss';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';

const AddOptionsAccount: React.FC = () => {
    const { ui } = useStores();
    return (
        <React.Fragment>
            <div className='add-options-account'>
                <DesktopWrapper>
                    <div className='add-options-account__title'>
                        <Text type='paragraph-2' bold>
                            <Localize i18n_default_text='You need an Options account to create a CFD account.' />
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
                            text={localize('Get an Options account')}
                            medium
                            primary
                        />
                    </div>
                </DesktopWrapper>
                <MobileWrapper>
                    <div className='add-options-account__title'>
                        <Text type='paragraph-2' bold>
                            <Localize i18n_default_text='You need an Options account to create a CFD account.' />
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
                            text={localize('Get an Options account')}
                            small
                            primary
                        />
                    </div>
                </MobileWrapper>
            </div>
        </React.Fragment>
    );
};

export default observer(AddOptionsAccount);
