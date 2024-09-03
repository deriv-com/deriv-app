import React from 'react';
import { useHistory } from 'react-router-dom';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import CloseIcon from '../../../../public/images/ic-close-dark.svg';
import './CompareAccountsHeader.scss';

type TCompareAccountsHeader = {
    isDemo: boolean;
    isEuRegion: boolean;
};

const CompareAccountsHeader = ({ isDemo, isEuRegion }: TCompareAccountsHeader) => {
    const history = useHistory();
    const { localize } = useTranslations();

    return (
        <div className='wallets-compare-accounts-header'>
            <div className='wallets-compare-accounts-header__title'>
                <Text size='xl' weight='bold'>
                    {isEuRegion ? (
                        <Localize
                            i18n_default_text='Deriv MT5 CFDs {{demoTitle}} account'
                            values={{ demoTitle: isDemo ? localize('Demo') : localize('real') }}
                        />
                    ) : (
                        <Localize
                            i18n_default_text='Compare CFDs{{demoTitle}} accounts'
                            values={{ demoTitle: isDemo ? localize(' demo') : '' }}
                        />
                    )}
                </Text>
            </div>
            <CloseIcon
                className='wallets-compare-accounts-header__close-icon'
                data-testid='dt_wallets_compare_accounts_header_close_icon'
                onClick={() => {
                    history.push('/');
                }}
            />
        </div>
    );
};

export default CompareAccountsHeader;
