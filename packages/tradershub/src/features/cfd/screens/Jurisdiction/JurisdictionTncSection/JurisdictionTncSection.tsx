import React from 'react';
import { Provider } from '@deriv/library';
import { Link, Text, useBreakpoint } from '@deriv/quill-design';
import { getStaticUrl } from '../../../../../helpers/urls';
import { THooks } from '../../../../../types';
import { companyNamesAndUrls, Jurisdiction, MarketType } from '../../../constants';
import { JurisdictionFootNoteTitle } from '../JurisdictionFootNoteTitle';

type TProps = {
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

const JurisdictionTncSection = ({ isCheckBoxChecked, selectedJurisdiction, setIsCheckBoxChecked }: TProps) => {
    const { isMobile } = useBreakpoint();
    const { getCFDState } = Provider.useCFDContext();
    const marketType = getCFDState('marketType') || MarketType.ALL;
    const selectedCompany = companyNamesAndUrls[selectedJurisdiction as keyof typeof companyNamesAndUrls];

    return (
        <div className='text-center space-y-600 mt-1500 sticky bottom-50 bg-system-light-primary-background px-1000 pt-[15px] pb-500 w-screen sm:w-auto sm:bg-inherit sm:static sm:p-50 lg:h-2500'>
            {selectedJurisdiction && (
                <JurisdictionFootNoteTitle marketType={marketType} selectedJurisdiction={selectedJurisdiction} />
            )}
            {selectedJurisdiction && selectedJurisdiction !== Jurisdiction.SVG && (
                <div className='flex justify-center space-x-400'>
                    <input
                        checked={isCheckBoxChecked}
                        className='cursor-pointer'
                        id='tnc-checkbox'
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setIsCheckBoxChecked(event.target.checked)
                        }
                        type='checkbox'
                    />
                    <label className='cursor-pointer' htmlFor='tnc-checkbox'>
                        <Text size={isMobile ? 'sm' : 'md'}>
                            I confirm and accept {selectedCompany.name}&lsquo;s{' '}
                            <Link
                                className='cursor-pointer text-solid-coral-700 text-75 pl-50 sm:text-100'
                                href={getStaticUrl(selectedCompany.tncUrl)}
                                target='_blank'
                            >
                                Terms and Conditions
                            </Link>
                        </Text>
                    </label>
                </div>
            )}
        </div>
    );
};

export default JurisdictionTncSection;
