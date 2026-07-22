import { Localize } from '@deriv/translations';
import { Button, Text } from '@deriv-com/quill-ui';
import { useDevice } from '@deriv-com/ui';

type TRedirectToHomeBanner = {
    is_contacting_support: boolean;
    onContactSupport: () => void;
};

const RedirectToHomeBanner = ({ is_contacting_support, onContactSupport }: TRedirectToHomeBanner) => {
    const { isMobile } = useDevice();

    return (
        <div className='redirect-to-home-banner' data-testid='dt_redirect_to_home_banner'>
            <div className='redirect-to-home-banner__content'>
                <div className='redirect-to-home-banner__text'>
                    <Text as='h2' size='md' bold>
                        <Localize i18n_default_text='Deriv has a new home' />
                    </Text>
                    <Text as='p' size='sm'>
                        {isMobile ? (
                            <Localize i18n_default_text='Sign in with your usual Deriv credentials, nothing to set up.' />
                        ) : (
                            <Localize i18n_default_text='Faster, simpler and packed with new features for trading, deposits and account management. Sign in with your usual Deriv credentials, nothing to set up.' />
                        )}
                    </Text>
                </div>
                <div className='redirect-to-home-banner__actions'>
                    <Button
                        variant='primary'
                        color='coral'
                        size='md'
                        isLoading={is_contacting_support}
                        label={<Localize i18n_default_text='Contact support' />}
                        onClick={onContactSupport}
                    />
                </div>
            </div>
        </div>
    );
};

export default RedirectToHomeBanner;
