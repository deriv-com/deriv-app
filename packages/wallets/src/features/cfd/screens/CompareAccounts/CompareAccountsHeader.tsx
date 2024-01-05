import React from 'react';
import { useHistory } from 'react-router-dom';
import { WalletText } from '../../../../components';
import CloseIcon from '../../../../public/images/ic-close-dark.svg';
import './CompareAccountsHeader.scss';

type TCompareAccountsHeader = {
    isDemo: boolean;
    isEuRegion: boolean;
};

const CompareAccountsHeader = ({ isDemo, isEuRegion }: TCompareAccountsHeader) => {
    const history = useHistory();

    const headerTitle = isEuRegion
        ? `Deriv MT5 CFDs ${isDemo ? 'Demo' : 'real'} account`
        : `Compare CFDs ${isDemo ? 'demo ' : ''}accounts`;

    return (
        <div className='wallets-compare-accounts-header'>
            <div className='wallets-compare-accounts-header__title'>
                <WalletText size='xl' weight='bold'>
                    {headerTitle}
                </WalletText>
            </div>
            <CloseIcon
                className='wallets-compare-accounts-header__close-icon'
                onClick={() => {
                    history.push('/wallets');
                }}
            />
        </div>
    );
};

export default CompareAccountsHeader;
