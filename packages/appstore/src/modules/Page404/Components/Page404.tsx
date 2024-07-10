import React from 'react';
import { PageError } from '@deriv-app/components';
import { routes, getUrlBase } from '@deriv-app/shared';
import { Localize } from '@deriv-app/translations';

const Page404 = () => (
    <PageError
        header={<Localize i18n_default_text='We couldn’t find that page' />}
        messages={[
            <Localize
                key='link'
                i18n_default_text='You may have followed a broken link, or the page has moved to a new address.'
            />,
            <Localize
                key='error'
                i18n_default_text='Error code: {{error_code}} page not found'
                values={{ error_code: 404 }}
            />,
        ]}
        redirect_urls={[routes.traders_hub]}
        redirect_labels={[<Localize key='return' i18n_default_text="Return to Trader's Hub" />]}
        classNameImage='page-404__image'
        image_url={getUrlBase('/public/images/common/404.png')}
    />
);

export default Page404;
