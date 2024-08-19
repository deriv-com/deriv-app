import React from 'react';
import { Checkbox, InlineMessage } from '@deriv-com/ui';
import { URLUtils } from '@deriv-com/utils';
import { WalletText } from '../../../../components/Base';
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
                <WalletText size={isDesktop ? '2xs' : 'xs'}>
                    You are adding your {platformTitle}
                    {productTitle} account under {selectedCompany.name}, regulated by Malta Financial Services Authority
                    (MFSA) (licence no. IS/70156).
                </WalletText>
            </InlineMessage>
            <Checkbox
                checked={checked}
                label={
                    <WalletText size={isDesktop ? 'xs' : 'sm'}>
                        I confirm and accept {selectedCompany.name}’s{' '}
                        <a
                            className='wallets-cfd-modal-tnc__tnc-link'
                            href={URLUtils.getDerivStaticURL(selectedCompany.tncUrl)}
                            rel='noreferrer'
                            target='_blank'
                        >
                            terms and conditions
                        </a>
                    </WalletText>
                }
                name='zerospread-checkbox'
                onChange={onChange}
            />
        </div>
    );
};

export default CFDPasswordModalTnc;
