import { Localize } from '@deriv-com/translations';
import Article from '../../../Components/article';

const openDerivAPIWebsite = () => {
    window.open('https://api.deriv.com/', '_blank', 'noopener');
};

const ConnectedAppsEarnMore = () => (
    <Article
        title={<Localize i18n_default_text='Earn more with Deriv API' />}
        descriptions={[
            <Localize
                key={0}
                i18n_default_text='Use our powerful, flexible, and free API to build a custom trading platform for yourself or for your business.'
            />,
        ]}
        onClickLearnMore={openDerivAPIWebsite}
    />
);

export default ConnectedAppsEarnMore;
