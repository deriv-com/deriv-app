import React from 'react';
import { StaticLink } from '@/components';
import { useCFDContext } from '@/providers';
import { companyNamesAndUrls, Jurisdiction, MarketType } from '@cfd/constants';
import { Checkbox, Text } from '@deriv-com/ui';
import { URLUtils } from '@deriv-com/utils';
import { JurisdictionFootNoteTitle } from '../JurisdictionFootNoteTitle';

type TJurisdictionTncSectionProps = {
    isCheckBoxChecked: boolean;
    setIsCheckBoxChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Component to show the Terms and Conditions for the selected jurisdiction
 * @param isCheckBoxChecked
 * @param setIsCheckBoxChecked
 * @param selectedCompany
 * @param selectedJurisdiction
 * @param param0
 * @returns
 */

const JurisdictionTncSection = ({ isCheckBoxChecked, setIsCheckBoxChecked }: TJurisdictionTncSectionProps) => {
    const { getDerivStaticURL } = URLUtils;
    const { cfdState } = useCFDContext();
    const { marketType: marketTypeState, selectedJurisdiction } = cfdState;
    const marketType = marketTypeState ?? MarketType.ALL;
    const selectedCompany = companyNamesAndUrls[selectedJurisdiction as keyof typeof companyNamesAndUrls];

    return (
        <div className='text-center space-y-12 bg-system-light-primary-background pt-15 lg:pb-10 w-full p-10 lg:p-0 fixed bottom-[72px] lg:unset lg:min-h-90'>
            {selectedJurisdiction && (
                <JurisdictionFootNoteTitle marketType={marketType} selectedJurisdiction={selectedJurisdiction} />
            )}
            {selectedJurisdiction && selectedJurisdiction !== Jurisdiction.SVG && (
                <div className='flex justify-center space-x-8'>
                    <Checkbox
                        checked={isCheckBoxChecked}
                        label={
                            <Text className='text-sm lg:text-default'>
                                I confirm and accept {selectedCompany.name}&lsquo;s{' '}
                                <StaticLink
                                    className='no-underline cursor-pointer text-solid-coral-700 hover:no-underline'
                                    href={getDerivStaticURL(selectedCompany.tncUrl)}
                                >
                                    Terms and Conditions
                                </StaticLink>
                            </Text>
                        }
                        name='tnc'
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setIsCheckBoxChecked(event.target.checked)
                        }
                        wrapperClassName='w-auto'
                    />
                </div>
            )}
        </div>
    );
};

export default JurisdictionTncSection;
