import React from 'react';
import { useHistory } from 'react-router-dom';
import { LegacyClose2pxIcon } from '@deriv/quill-icons';
import { WalletText } from '../../../../components';
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
            <LegacyClose2pxIcon
                className='wallets-compare-accounts-header__close-icon'
                iconSize='xs'
                onClick={() => {
                    history.push('/');
                }}
            />
        </div>
    );
};

export default CompareAccountsHeader;
