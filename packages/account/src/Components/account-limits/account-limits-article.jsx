import PropTypes from 'prop-types';
import * as React from 'react';
import { StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import AccountArticle from 'Components/article/article.jsx';

const AccountLimitsArticle = ({ is_navigated_from_deriv_go }) => {
    const getDescription = () => {
        const description = [];
        description.push(
            <Localize key={0} i18n_default_text='These are default limits that we apply to your accounts.' />
        );
        if (!is_navigated_from_deriv_go) {
            description.push(
                <Localize
                    key={1}
                    i18n_default_text='To learn more about trading limits and how they apply, please go to the <0>Help Centre.</0>'
                    components={[<StaticUrl key={0} className='link' href='/help-centre' />]}
                />
            );
        }
        return description;
    };

    return <AccountArticle title={localize('Account limits')} descriptions={getDescription()} />;
};

AccountLimitsArticle.propTypes = {
    is_navigated_from_deriv_go: PropTypes.bool,
};

export default AccountLimitsArticle;
