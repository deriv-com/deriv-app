import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Checkbox, InlineMessage, Text } from '@deriv-com/ui';
import { WalletLink } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import { THooks, TPlatforms } from '../../../../types';
import { companyNamesAndUrls, getMarketTypeDetails, PlatformDetails } from '../../constants';
import './CFDPasswordModalTnc.scss';

export type TCFDPasswordModalTncProps = {
    checked: boolean;
    onChange: () => void;
    platform: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'];
};

const CFDPasswordModalTnc = ({ checked, onChange, platform, product }: TCFDPasswordModalTncProps) => {
    const { isDesktop } = useDevice();
    const { getModalState } = useModal();
    const selectedJurisdiction = getModalState('selectedJurisdiction');
    const selectedCompany = companyNamesAndUrls[selectedJurisdiction as keyof typeof companyNamesAndUrls];
    const platformTitle = PlatformDetails[platform].title;
    const productTitle = getMarketTypeDetails(product).all.title;

    return (
        <div className='wallets-cfd-modal-tnc'>
            <InlineMessage iconPosition='top' variant='info'>
                <Text size={isDesktop ? '2xs' : 'xs'}>
                    <Localize
                        i18n_default_text='You are adding your {{platformTitle}} {{productTitle}} account under {{company}}, regulated by Malta Financial Services Authority (MFSA) (licence no. IS/70156).'
                        values={{ company: selectedCompany.name, platformTitle, productTitle }}
                    />
                </Text>
            </InlineMessage>
            <Checkbox
                checked={checked}
                label={
                    <Text size={isDesktop ? 'xs' : 'sm'}>
                        <Localize
                            components={[<WalletLink key={0} staticUrl={selectedCompany.tncUrl} variant='bold' />]}
                            i18n_default_text='I confirm and accept {{company}}’s <0>terms and conditions</0>'
                            values={{
                                company: selectedCompany.name,
                            }}
                        />
                    </Text>
                }
                name='zerospread-checkbox'
                onChange={onChange}
            />
        </div>
    );
};

export default CFDPasswordModalTnc;
