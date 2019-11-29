import React        from 'react';
import { routes }   from 'Constants/index';
import { localize } from 'deriv-translations';
import PageError    from 'Modules/PageError';

const Page404 = () => (
    <PageError
        header={localize('Oops, page not available.')}
        error_code={404}
        messages={[localize('The page you requested could not be found. Either it no longer exists or the address is wrong. Please check for any typos.')]}
        redirect_url={routes.trade}
        redirect_label={localize('Return to Trade')}
    />
);

export default Page404;
