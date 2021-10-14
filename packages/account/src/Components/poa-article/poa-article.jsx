import * as React from 'react';
import { StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import AccountArticle from 'Components/article/article.jsx';

export default function PoAArticle() {
    return (
        <AccountArticle
            title={localize('Personal details and proof identity')}
            descriptions={[
                <Localize
                    key={0}
                    i18n_default_text='Please ensure all your personal details are the same as in your chosen document. If you wish to update your personal details, go to <0>account-settings</0>.'
                    components={[<StaticUrl key={0} className='link' href='/account/personal-details' />]}
                />,
            ]}
        />
    );
}
