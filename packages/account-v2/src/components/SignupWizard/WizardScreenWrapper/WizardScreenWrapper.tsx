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
    return <div className='h-full flex flex-col justify-between'>{children}</div>;
};

export default WizardScreenWrapper;
