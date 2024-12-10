import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Checkbox, Text, useDevice } from '@deriv-com/ui';
import { WalletLink } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { companyNamesAndUrls } from '../../../constants';
import './MT5PasswordModalTnc.scss';

export type TMT5PasswordModalTncProps = {
    checked: boolean;
    companyName?: string;
    onChange: () => void;
};

const MT5PasswordModalTnc = ({ checked, companyName, onChange }: TMT5PasswordModalTncProps) => {
    const { isDesktop } = useDevice();
    const { getModalState } = useModal();
    const selectedJurisdiction = getModalState('selectedJurisdiction');
    // TODO: replace the company name with the information provided by the trading_platform_account_available API's BE response
    const selectedCompany = companyNamesAndUrls[selectedJurisdiction as keyof typeof companyNamesAndUrls];

    return (
        <div className='wallets-mt5-modal-tnc'>
            <Checkbox
                checked={checked}
                data-testid='dt_wallets_mt5_tnc_checkbox'
                label={
                    <Text size={isDesktop ? 'xs' : 'sm'}>
                        <Localize
                            components={[
                                <WalletLink key={0} language='en' staticUrl={selectedCompany.tncUrl} variant='bold' />,
                            ]}
                            i18n_default_text="I confirm and accept {{companyName}}'s <0>terms and conditions</0>"
                            values={{ companyName }}
                        />
                    </Text>
                }
                name='mt5-tnc-checkbox'
                onChange={onChange}
            />
        </div>
    );
};

export default MT5PasswordModalTnc;
