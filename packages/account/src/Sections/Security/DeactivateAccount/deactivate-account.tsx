// TODO: Remove once mobile team has changed this link
import { Redirect } from 'react-router-dom';
import { routes } from '@deriv-app/shared';

const DeactivateAccount = () => {
    return <Redirect to={routes.closing_account} />;
};

export default DeactivateAccount;
