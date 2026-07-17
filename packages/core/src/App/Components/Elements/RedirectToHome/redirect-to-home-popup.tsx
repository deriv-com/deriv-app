import { StandaloneArrowRightBoldIcon, StandaloneCircleInfoBoldIcon } from '@deriv/quill-icons';
import { deriv_urls } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Button, Modal, Text } from '@deriv-com/quill-ui';
import { useDevice } from '@deriv-com/ui';

type TRedirectToHomePopup = {
    onContinue: () => void;
    onDismiss: () => void;
};

const RedirectToHomePopup = ({ onContinue, onDismiss }: TRedirectToHomePopup) => {
    const { isMobile } = useDevice();

    const handleContactSupport = () => {
        window.open(deriv_urls.HELP_CENTRE, '_blank', 'noopener,noreferrer');
    };

    return (
        <Modal
            isOpened
            isMobile={isMobile}
            showCrossIcon
            showHandleBar={false}
            showPrimaryButton={false}
            hasFooter={false}
            toggleModal={onDismiss}
            className='redirect-to-home-popup'
        >
            <Modal.Body>
                <div className='redirect-to-home-popup__content'>
                    <Text
                        as='p'
                        size='sm'
                        color='var(--text-less-prominent)'
                        className='redirect-to-home-popup__eyebrow'
                    >
                        <Localize i18n_default_text='Deriv has a new home' />
                    </Text>
                    <Text as='h2' size='lg' bold className='redirect-to-home-popup__title'>
                        <Localize
                            i18n_default_text='Deriv now lives at <0>home.deriv.com</0>'
                            components={[<span key={0} className='redirect-to-home-popup__highlight' />]}
                        />
                    </Text>
                    <Text as='p' size='md'>
                        <Localize i18n_default_text='Faster, simpler, all in one place — trading, deposits and account management included.' />
                    </Text>
                    <div className='redirect-to-home-popup__info'>
                        <StandaloneCircleInfoBoldIcon
                            iconSize='sm'
                            fill='var(--brand-red-coral)'
                            className='redirect-to-home-popup__info-icon'
                        />
                        <Text as='p' size='sm'>
                            <Localize
                                i18n_default_text="<0>New here?</0> Your old login won't carry over — signing up takes about a minute."
                                components={[<strong key={0} />]}
                            />
                        </Text>
                    </div>
                    <div className='redirect-to-home-popup__actions'>
                        <Button
                            variant='primary'
                            color='coral'
                            size='lg'
                            fullWidth
                            icon={<StandaloneArrowRightBoldIcon iconSize='sm' fill='#FFFFFF' />}
                            iconPosition='end'
                            label={<Localize i18n_default_text='Continue to home.deriv.com' />}
                            onClick={onContinue}
                        />
                        <Button
                            variant='secondary'
                            color='black'
                            size='lg'
                            fullWidth
                            label={<Localize i18n_default_text='Contact support' />}
                            onClick={handleContactSupport}
                        />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default RedirectToHomePopup;
