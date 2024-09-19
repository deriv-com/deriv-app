import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Checkbox } from '@deriv-com/ui';
import { useModal } from '../../../../../components/ModalProvider';
import { getStaticUrl } from '../../../../../helpers/urls';
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
    const { getModalState } = useModal();
    const marketType = getModalState('marketType') || 'all';
    const selectedCompany = companyNamesAndUrls[selectedJurisdiction as keyof typeof companyNamesAndUrls];

    return (
        <div className='wallets-jurisdiction-tnc'>
            <div className='wallets-jurisdiction-tnc__container'>
                {selectedJurisdiction && (
                    <JurisdictionFootNoteTitle marketType={marketType} selectedJurisdiction={selectedJurisdiction} />
                )}
                {selectedJurisdiction && selectedJurisdiction !== 'svg' && (
                    <Checkbox
                        checked={isCheckBoxChecked}
                        label={
                            <Localize
                                components={[
                                    <a
                                        className='wallets-jurisdiction-tnc-checkbox__link'
                                        key={0}
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
                                    />,
                                ]}
                                i18n_default_text="I confirm and accept {{companyName}}'s <0>Terms and Conditions</0>"
                                values={{ companyName: selectedCompany.name }}
                            />
                        }
                        labelClassName='wallets-jurisdiction-tnc-checkbox__label'
                        name='tnc-checkbox'
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setIsCheckBoxChecked(event.target.checked)
                        }
                        wrapperClassName='wallets-jurisdiction-tnc-checkbox'
                    />
                )}
            </div>
        </div>
    );
};

export default JurisdictionTncSection;
