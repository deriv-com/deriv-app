import React from 'react';
import classNames from 'classnames';
import { StaticUrl } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { PlatformContext } from '@deriv/shared';
import Article from 'Components/article';

const ALArticle = () => {
    const { is_dashboard } = React.useContext(PlatformContext);
    return (
        <Article
            title={localize('Account limits')}
            descriptions={[
                <Localize key={0} i18n_default_text='These are default limits that we apply to your accounts.' />,
                <Localize
                    key={1}
                    i18n_default_text='To learn more about trading limits and how they apply, please go to the <0>Help Centre.</0>'
                    components={[
                        <StaticUrl
                            key={0}
                            className={classNames('link link--orange', { 'link--blue': is_dashboard })}
                            href='/help-centre'
                        />,
                    ]}
                />,
            ]}
        />
    );
};

export default ALArticle;
