import React from 'react';

const usePhoneVerification = () => {
    const [show_phone_verification_page, set_show_phone_verification_page] = React.useState(true);

    return {
        show_phone_verification_page,
        set_show_phone_verification_page,
    };
};

export default usePhoneVerification;
