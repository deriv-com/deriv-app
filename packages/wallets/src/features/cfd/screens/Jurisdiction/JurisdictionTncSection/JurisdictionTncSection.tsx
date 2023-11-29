import React from 'react';
import { WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { getStaticUrl } from '../../../../../helpers/urls';
import useDevice from '../../../../../hooks/useDevice';
import { THooks } from '../../../../../types';
import { companyNamesAndUrls } from '../../../constants';
import { JurisdictionFootNoteTitle } from '../JurisdictionFootNoteTitle';
import './JurisdictionTncSection.scss';

type TProps = {
    isCheckBoxChecked: boolean;
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
    setIsCheckBoxChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

const JurisdictionTncSection: React.FC<TProps> = ({
    isCheckBoxChecked,
    selectedJurisdiction,
    setIsCheckBoxChecked,
}) => {
    const { isMobile } = useDevice();
    const { getModalState } = useModal();
    const marketType = getModalState('marketType') || 'all';
    const selectedCompany = companyNamesAndUrls[selectedJurisdiction as keyof typeof companyNamesAndUrls];

    return (
        <div className='wallets-jurisdiction-tnc'>
            {selectedJurisdiction && (
                <JurisdictionFootNoteTitle marketType={marketType} selectedJurisdiction={selectedJurisdiction} />
            )}
            {selectedJurisdiction && selectedJurisdiction !== 'svg' && (
                <div className='wallets-jurisdiction-tnc-checkbox'>
                    <input
                        checked={isCheckBoxChecked}
                        className='wallets-jurisdiction-tnc-checkbox-input'
                        id='tnc-checkbox'
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setIsCheckBoxChecked(event.target.checked)
                        }
                        type='checkbox'
                    />
                    <label className='wallets-jurisdiction-tnc-checkbox-label' htmlFor='tnc-checkbox'>
                        <WalletText size={isMobile ? 'sm' : 'md'}>
                            I confirm and accept {selectedCompany.name}&lsquo;s{' '}
                            <a
                                className='wallets-jurisdiction-tnc-checkbox__link'
                                onClick={() => {
                                    window.open(getStaticUrl(selectedCompany.tncUrl), '_blank');
                                }}
                                // Reason: To fix sonarcloud issue
                                onKeyDown={(event: React.KeyboardEvent<HTMLAnchorElement>) => {
                                    if (event.key === 'Enter') {
                                        window.open(
                                            getStaticUrl(
                                                companyNamesAndUrls[
                                                    selectedJurisdiction as keyof typeof companyNamesAndUrls
                                                ].tncUrl
                                            ),
                                            '_blank'
                                        );
                                    }
                                }}
                            >
                                Terms and Conditions
                            </a>
                        </WalletText>
                    </label>
                </div>
            )}
        </div>
    );
};

export default JurisdictionTncSection;
