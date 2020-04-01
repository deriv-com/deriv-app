import React from 'react';
import { PageError } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { routes } from 'Constants/index';

const Page404 = () => (
    <PageError
        header={localize('Oops, page not available.')}
        error_code_message={<Localize i18n_default_text={'Error Code: {{error_code}}'} values={404} />}
        messages={[
            localize(
                'The page you requested could not be found. Either it no longer exists or the address is wrong. Please check for any typos.'
            ),
        ]}
        redirect_url={routes.trade}
        redirect_label={localize('Return to Trade')}
    />
);

export default Page404;
