import React from 'react';
import { ModalStepWrapper, Tab, Tabs } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import { PlatformDetails } from '../../constants';
import MT5ChangeInvestorPasswordScreens from './InvestorPassword/MT5ChangeInvestorPasswordScreens';
import MT5ChangePasswordScreens from './MT5ChangePasswordScreens';
import './ChangePassword.scss';

const ChangePassword = () => {
    const { getModalState } = useModal();
    const platform = getModalState('platform') || 'mt5';
    const platformTitle = PlatformDetails[platform].title;
    return (
        <ModalStepWrapper title={`Manage ${platformTitle} password`}>
            <div className='wallets-change-password__modal-wrapper'>
                <Tabs wrapperClassName='wallets-change-password__container'>
                    <Tab title={`${platformTitle} Password`}>
                        <MT5ChangePasswordScreens platform={platform} platformTitle={platformTitle} />
                    </Tab>
                    <Tab title='Investor Password'>
                        <MT5ChangeInvestorPasswordScreens />
                    </Tab>
                </Tabs>
            </div>
        </ModalStepWrapper>
    );
};

export default ChangePassword;
