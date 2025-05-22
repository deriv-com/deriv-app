import React from 'react';
import { useHistory } from 'react-router-dom';
import { LegacyClose2pxIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import './CompareAccountsHeader.scss';

type TCompareAccountsHeader = {
    isDemo: boolean;
    isLoading: boolean;
};

const CompareAccountsHeader = ({ isDemo, isLoading }: TCompareAccountsHeader) => {
    const history = useHistory();

    const headerText = isDemo ? (
        <Localize i18n_default_text='Compare CFDs demo accounts' />
    ) : (
        <Localize i18n_default_text='Compare CFDs accounts' />
    );

    return (
        <div className='wallets-compare-accounts-header'>
            <div className='wallets-compare-accounts-header__title'>
                <Text size='xl' weight='bold'>
                    {isLoading ? '' : headerText}
                </Text>
            </div>
            <LegacyClose2pxIcon
                className='wallets-compare-accounts-header__close-icon'
                data-testid='dt_wallets_compare_accounts_header_close_icon'
                iconSize='xs'
                onClick={() => {
                    history.push('/');
                }}
            />
        </div>
    );
};

export default CompareAccountsHeader;
