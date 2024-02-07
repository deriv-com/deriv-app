import React, { ReactNode } from 'react';
import { useBreakpoint } from '@deriv/quill-design';
import { Text } from '@deriv/ui';

type TWizardScreenWrapper = { children: React.ReactNode; heading: ReactNode };

/**
 * @name WizardScreenWrapper
 * @description The WizardScreenWrapper component is used to wrap the screens in the SignupWizard component.
 * @param {Object} props - React props object
 * @param {React.ReactNode} props.children - The content to be wrapped.
 * @param {React.ReactNode} props.heading - The heading of the screen.
 * @example
 * return (
 *    <WizardScreenWrapper heading="Heading">
 *       <div>Content</div>
 *   </WizardScreenWrapper>
 * );
 */

const WizardScreenWrapper = ({ children, heading }: TWizardScreenWrapper) => {
    const { isMobile } = useBreakpoint();
    return (
        <div className='flex flex-col justify-between h-full bg-system-light-primary-background min-h-50'>
            {!isMobile && (
                <Text as='p' className='font-bold pt-2400 pl-1200 text-100'>
                    {heading}
                </Text>
            )}
            {children}
        </div>
    );
};

export default WizardScreenWrapper;
