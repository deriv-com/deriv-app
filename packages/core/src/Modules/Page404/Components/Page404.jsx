import React from 'react';
import { PageError } from '@deriv/components';
import { localize } from '@deriv/translations';
import { routes } from 'Constants/index';

const Page404 = () => (
    <PageError
        header={localize('We couldn’t find that page')}
        messages={[
            localize('You may have followed a broken link, or the page has moved to a new address.'),
            localize('Error Code: {{error_code}} page not found', { error_code: 404 }),
        ]}
        redirect_url={routes.trade}
        redirect_label={localize('Return to Trade')}
        classNameImage='page-404__image'
    />
);

export default Page404;
