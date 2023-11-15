import React from 'react';
import { ModalStepWrapper, WalletText } from '../../../../components/Base';
import MT5Password from './MT5Password';
import './ChangePassword.scss';

const ChangePassword = () => {
    const tabs = [
        {
            label: 'Deriv MT5 password',
            content: <MT5Password />,
        },
        {
            label: 'Investor password',
            content: <></>, // TODO: Add InvestorPassword component
        },
    ];
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    return (
        <ModalStepWrapper closeOnEscape title='Manage Deriv MT5 password'>
            <div className='wallets-change-password__modal-wrapper'>
                <div className='wallets-change-password__container'>
                    <div className='wallets-change-password__tab'>
                        {tabs.map((tab, index) => (
                            <button
                                className={
                                    activeTab === index
                                        ? 'wallets-change-password__tab--btn-active'
                                        : 'wallets-change-password__tab--btn'
                                }
                                key={index}
                                onClick={() => handleTabClick(index)}
                            >
                                <WalletText weight='bold'>{tab.label}</WalletText>
                            </button>
                        ))}
                    </div>
                    <div className='wallets-change-password__content'>{tabs[activeTab].content}</div>
                </div>
            </div>
        </ModalStepWrapper>
    );
};

export default ChangePassword;
