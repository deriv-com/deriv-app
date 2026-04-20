import { StandaloneCircleCheckBoldIcon } from '@deriv/quill-icons';
import { deriv_urls, isProduction } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { Button, Link, Modal, Text } from '@deriv-com/quill-ui';

import './migration-modal.scss';

const MigrationModal = observer(() => {
    const { client } = useStore();
    const { is_platform_migrated } = client;

    const home_url = isProduction() ? deriv_urls.HOME_PRODUCTION : deriv_urls.HOME_STAGING;

    const handleLogin = () => {
        window.location.assign(`${home_url}/dashboard/login`);
    };

    return (
        <Modal
            isOpened={is_platform_migrated}
            isNonExpandable
            showCrossIcon={false}
            disableCloseOnOverlay
            showPrimaryButton={false}
            hasFooter={false}
            className='migration-modal'
        >
            <Modal.Body>
                <div className='migration-modal__content'>
                    <StandaloneCircleCheckBoldIcon
                        className='migration-modal__icon'
                        iconSize='2xl'
                        fill='var(--purchase-main-1)'
                    />
                    <Text as='h2' size='lg' bold className='migration-modal__title'>
                        <Localize i18n_default_text='Your platform has been upgraded' />
                    </Text>
                    <Text size='md' className='migration-modal__description'>
                        <Localize i18n_default_text="We've made improvements to give you a better trading experience. Please log in again to continue." />
                    </Text>
                    <Button
                        className='migration-modal__cta'
                        variant='primary'
                        color='coral'
                        size='lg'
                        fullWidth
                        label={<Localize i18n_default_text='Log in' />}
                        onClick={handleLogin}
                    />
                    <Text size='md' className='migration-modal__support'>
                        <Localize
                            i18n_default_text='Having trouble logging in? <0>Contact customer support</0>'
                            components={[
                                <Link
                                    key={0}
                                    size='md'
                                    className='migration-modal__support-link'
                                    href={deriv_urls.HELP_CENTRE}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                />,
                            ]}
                        />
                    </Text>
                </div>
            </Modal.Body>
        </Modal>
    );
});

export default MigrationModal;
