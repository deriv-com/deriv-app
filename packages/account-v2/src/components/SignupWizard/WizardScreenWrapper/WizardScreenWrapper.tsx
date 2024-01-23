import React from 'react';

const WizardScreenWrapper = ({ children }: { children: React.ReactNode }) => {
    return <div className='h-full flex flex-col justify-between'>{children}</div>;
};

export default WizardScreenWrapper;
