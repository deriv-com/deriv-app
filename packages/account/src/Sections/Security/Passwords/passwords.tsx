import { useState, useEffect } from 'react';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import DerivPassword from './deriv-password';
import DerivEmail from './deriv-email';

/**
 *  Displays the Email, Password, section under Account settings.
 * @name Passwords
 * @returns {ReactNode}
 */
const Passwords = observer(() => {
    const { client } = useStore();
    const { is_populating_mt5_account_list, is_populating_dxtrade_account_list, is_social_signup } = client;

    const [is_loading, setIsLoading] = useState(true);

    useEffect(() => {
        if (
            is_populating_mt5_account_list === false &&
            is_populating_dxtrade_account_list === false &&
            is_social_signup !== undefined
        ) {
            setIsLoading(false);
        }
    }, [is_populating_mt5_account_list, is_populating_dxtrade_account_list, is_social_signup]);

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <div className='account__passwords'>
            <DerivEmail />
            <DerivPassword />
        </div>
    );
});

export default Passwords;
