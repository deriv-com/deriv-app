import React from 'react';

const usePhoneVerification = () => {
    const [showPhoneVerificationPage, setShowPhoneVerificationPage] = React.useState(true);

    return {
        showPhoneVerificationPage,
        setShowPhoneVerificationPage,
    };
};

export default usePhoneVerification;
