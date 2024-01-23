import React from 'react';

/**
 * @name WizardScreenWrapper
 * @description The WizardScreenWrapper component is used to wrap the screens in the SignupWizard component.
 * @param {React.ReactNode} children - The content to be wrapped.
 * @example
 * return (
 *    <WizardScreenWrapper>
 *       <div>Content</div>
 *   </WizardScreenWrapper>
 * );
 */

const WizardScreenWrapper = ({ children }: { children: React.ReactNode }) => {
    return <div className='flex flex-col justify-between h-full'>{children}</div>;
};

export default WizardScreenWrapper;
