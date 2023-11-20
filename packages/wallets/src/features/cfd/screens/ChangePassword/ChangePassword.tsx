import React from 'react';
import { ModalStepWrapper, Tab, Tabs } from '../../../../components/Base';
import MT5ChangePasswordScreens from './MT5ChangePasswordScreens';
import './ChangePassword.scss';

const ChangePassword = () => {
    return (
        <ModalStepWrapper title='Manage Deriv MT5 password'>
            <div className='wallets-change-password__modal-wrapper'>
                <Tabs wrapperClassName='wallets-change-password__container'>
                    <Tab title='Deriv MT5 Password'>
                        <MT5ChangePasswordScreens />
                    </Tab>
                    <Tab title='Investor Password'>
                        {/* TODO: Add Investor Password */}
                        <></>
                    </Tab>
                </Tabs>
            </div>
        </ModalStepWrapper>
    );
};

export default ChangePassword;
