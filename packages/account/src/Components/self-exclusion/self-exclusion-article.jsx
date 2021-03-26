import * as React from 'react';
import { StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import AccountArticle from 'Components/article/article.jsx';
import SelfExclusionContext from './self-exclusion-context';

const SelfExclusionArticle = () => {
    const { is_eu, toggleArticle } = React.useContext(SelfExclusionContext);

    return (
        <AccountArticle
            title={localize('Trading limits and self-exclusion')}
            descriptions={[
                is_eu ? (
                    <Localize
                        i18n_default_text='These trading limits and self-exclusion help you control the amount of money and time you spend on Deriv.com and exercise <0>responsible trading</0>.'
                        components={[<StaticUrl key={0} className='link' href='/responsible' />]}
                    />
                ) : (
                    <Localize
                        i18n_default_text='These self-exclusion limits help you control the amount of money and time you spend trading on DTrader, DBot, and SmartTrader. The limits you set here will help you exercise <0>responsible trading</0>.'
                        components={[<StaticUrl key={0} className='link' href='/responsible' />]}
                    />
                ),
            ]}
            onClickLearnMore={toggleArticle}
        />
    );
};

export default SelfExclusionArticle;
