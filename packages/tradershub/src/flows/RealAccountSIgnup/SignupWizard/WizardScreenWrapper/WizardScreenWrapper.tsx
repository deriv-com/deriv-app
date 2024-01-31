import React, { ReactNode } from 'react';
import { Heading, useBreakpoint } from '@deriv/quill-design';

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
        <div className='flex flex-col justify-between h-full'>
            {!isMobile && <Heading.H5 className='pt-2400 pl-1200'>{heading}</Heading.H5>}
            {children}
        </div>
    );
};

export default WizardScreenWrapper;
