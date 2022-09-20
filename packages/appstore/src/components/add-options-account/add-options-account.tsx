import React from 'react';
import { Text } from '@deriv/ui';
import { DesktopWrapper, MobileWrapper, Button } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import './add-options-account.scss';

const AddOptionsAccount = () => {
    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='add-options-account'>
                    <div className='add-options-account__desktop--title'>
                        <Text type='paragraph-2' bold>
                            <Localize i18n_default_text='You need an Options account to create a CFD account.' />
                        </Text>
                    </div>
                    <div className='add-options-account__desktop--button'>
                        <Button
                            className='add-options-account__button'
                            type='submit'
                            onClick
                            has_effect
                            is_disabled={false}
                            is_loading={false}
                            text={localize('Get an Options account')}
                            medium
                            primary
                        />
                    </div>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <div className='add' />
            </MobileWrapper>
        </React.Fragment>
    );
};

export default AddOptionsAccount;
