import React from 'react';
import { StaticLink } from '@/components';
import { getStaticUrl } from '@/helpers';
import { THooks } from '@/types';
import { companyNamesAndUrls, Jurisdiction, MarketType } from '@cfd/constants';
import { Provider } from '@deriv/library';
import { Checkbox, Text, useDevice } from '@deriv-com/ui';
import { JurisdictionFootNoteTitle } from '../JurisdictionFootNoteTitle';

type TJurisdictionTncSectionProps = {
    isCheckBoxChecked: boolean;
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
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

const JurisdictionTncSection = ({
    isCheckBoxChecked,
    selectedJurisdiction,
    setIsCheckBoxChecked,
}: TJurisdictionTncSectionProps) => {
    const { isDesktop } = useDevice();
    const { getCFDState } = Provider.useCFDContext();
    const marketType = getCFDState('marketType') ?? MarketType.ALL;
    const selectedCompany = companyNamesAndUrls[selectedJurisdiction as keyof typeof companyNamesAndUrls];

    return (
        <div className='text-center space-y-12 mt-30 sticky bottom-0 bg-system-light-primary-background px-20 pt-[15px] pb-10 w-screen sm:w-auto sm:bg-inherit sm:static sm:p-0'>
            {selectedJurisdiction && (
                <JurisdictionFootNoteTitle marketType={marketType} selectedJurisdiction={selectedJurisdiction} />
            )}
            {selectedJurisdiction && selectedJurisdiction !== Jurisdiction.SVG && (
                <div className='flex justify-center space-x-8'>
                    <Checkbox
                        checked={isCheckBoxChecked}
                        label={
                            <Text size={isDesktop ? 'md' : 'sm'}>
                                I confirm and accept {selectedCompany.name}&lsquo;s{' '}
                                <StaticLink
                                    className='no-underline cursor-pointer text-solid-coral-700 hover:no-underline'
                                    href={getStaticUrl(selectedCompany.tncUrl)}
                                >
                                    Terms and Conditions
                                </StaticLink>
                            </Text>
                        }
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
