import { StandaloneArrowRightBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import { Button, Text } from '@deriv-com/quill-ui';

type TRedirectToHomeBanner = {
    onContinue: () => void;
};

const RedirectToHomeBanner = ({ onContinue }: TRedirectToHomeBanner) => (
    <div className='redirect-to-home-banner'>
        <div className='redirect-to-home-banner__text-group'>
            <Text as='p' size='md' bold>
                <Localize i18n_default_text='Deriv has a new home' />
            </Text>
            <Text as='p' size='sm' color='var(--text-less-prominent)'>
                <Localize i18n_default_text='Sign in at home.deriv.com with your usual credentials.' />
            </Text>
        </div>
        <Button
            variant='primary'
            color='coral'
            size='lg'
            className='redirect-to-home-banner__cta'
            icon={<StandaloneArrowRightBoldIcon iconSize='sm' fill='#FFFFFF' />}
            iconPosition='end'
            label={<Localize i18n_default_text='Go to home.deriv.com' />}
            onClick={onContinue}
        />
    </div>
);

export default RedirectToHomeBanner;
