import {
    DerivLightSettingsInProgressIcon,
    StandaloneArrowRightBoldIcon,
    StandaloneCircleCheckBoldIcon,
    StandaloneCircleCheckFillIcon,
    StandalonePasskeyBoldIcon,
    StandaloneXmarkBoldIcon,
} from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import { Button, Modal, Text } from '@deriv-com/quill-ui';
import { useDevice } from '@deriv-com/ui';

type TRedirectToHomePopup = {
    view: 'prompt' | 'success' | 'error';
    is_migrating: boolean;
    is_contacting_support: boolean;
    is_redirecting: boolean;
    is_go_now_enabled: boolean;
    is_migration_delayed: boolean;
    can_close: boolean;
    error_message?: string;
    countdown: number;
    onContinue: () => void;
    onContactSupport: () => void;
    onGoNow: () => void;
    onClose: () => void;
};

const PopupCloseButton = ({ onClose }: { onClose: () => void }) => (
    <button
        type='button'
        className='redirect-to-home-popup__close'
        onClick={onClose}
        aria-label='Close'
        data-testid='dt_redirect_to_home_popup_close'
    >
        <StandaloneXmarkBoldIcon iconSize='sm' fill='var(--text-general)' />
    </button>
);

const RedirectToHomePopup = ({
    view,
    is_migrating,
    is_contacting_support,
    is_redirecting,
    is_go_now_enabled,
    is_migration_delayed,
    can_close,
    error_message,
    countdown,
    onContinue,
    onContactSupport,
    onGoNow,
    onClose,
}: TRedirectToHomePopup) => {
    const { isMobile } = useDevice();

    if (view === 'success') {
        return (
            <Modal
                isOpened
                isMobile={isMobile}
                showCrossIcon={false}
                showHandleBar={false}
                showPrimaryButton={false}
                hasFooter={false}
                disableCloseOnOverlay
                className='redirect-to-home-popup'
            >
                <Modal.Body>
                    <div className='redirect-to-home-popup__content redirect-to-home-popup__content--success'>
                        {can_close && <PopupCloseButton onClose={onClose} />}
                        {is_migration_delayed ? (
                            <DerivLightSettingsInProgressIcon
                                height='120px'
                                width='120px'
                                className='redirect-to-home-popup__success-icon'
                            />
                        ) : (
                            <StandaloneCircleCheckFillIcon
                                iconSize='2xl'
                                fill='var(--brand-red-coral)'
                                className='redirect-to-home-popup__success-icon'
                            />
                        )}
                        <Text as='p' size='md' className='redirect-to-home-popup__centered-text'>
                            {is_migration_delayed ? (
                                <Localize i18n_default_text='This seems to be taking a while. Contact support for assistance.' />
                            ) : (
                                <Localize
                                    i18n_default_text='Taking you to <0>home.deriv.com</0> in <1>{{seconds}}s</1>.'
                                    values={{ seconds: countdown }}
                                    components={[
                                        <span key={0} className='redirect-to-home-popup__highlight' />,
                                        <span key={1} className='redirect-to-home-popup__highlight' />,
                                    ]}
                                />
                            )}
                        </Text>
                        {!is_migration_delayed && (
                            <div className='redirect-to-home-popup__info'>
                                <StandalonePasskeyBoldIcon
                                    iconSize='sm'
                                    fill='var(--brand-red-coral)'
                                    className='redirect-to-home-popup__info-icon'
                                />
                                <Text as='p' size='sm'>
                                    <Localize
                                        i18n_default_text="Log in with the <0>same credentials</0> you've always used, no new password needed."
                                        components={[<strong key={0} />]}
                                    />
                                </Text>
                            </div>
                        )}
                        <div className='redirect-to-home-popup__actions'>
                            {is_migration_delayed ? (
                                <Button
                                    variant='primary'
                                    color='coral'
                                    size='lg'
                                    fullWidth
                                    isLoading={is_contacting_support}
                                    label={<Localize i18n_default_text='Contact support' />}
                                    onClick={onContactSupport}
                                />
                            ) : (
                                <Button
                                    variant='primary'
                                    color='coral'
                                    size='lg'
                                    fullWidth
                                    isLoading={is_redirecting}
                                    disabled={!is_go_now_enabled && !is_redirecting}
                                    icon={
                                        is_redirecting ? undefined : (
                                            <StandaloneArrowRightBoldIcon iconSize='sm' fill='#FFFFFF' />
                                        )
                                    }
                                    iconPosition='end'
                                    label={<Localize i18n_default_text='Go now' />}
                                    onClick={onGoNow}
                                />
                            )}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal
            isOpened
            isMobile={isMobile}
            showCrossIcon={false}
            showHandleBar={false}
            showPrimaryButton={false}
            hasFooter={false}
            disableCloseOnOverlay
            className='redirect-to-home-popup'
        >
            <Modal.Body>
                <div className='redirect-to-home-popup__content'>
                    {can_close && <PopupCloseButton onClose={onClose} />}
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
                    {view === 'error' ? (
                        <Text as='p' size='md'>
                            {error_message}
                        </Text>
                    ) : (
                        <>
                            <Text as='p' size='md'>
                                <Localize i18n_default_text='Faster, simpler and packed with new features for trading, deposits and account management.' />
                            </Text>
                            <div className='redirect-to-home-popup__info'>
                                <StandaloneCircleCheckBoldIcon
                                    iconSize='sm'
                                    fill='var(--brand-red-coral)'
                                    className='redirect-to-home-popup__info-icon'
                                />
                                <Text as='p' size='sm'>
                                    <Localize
                                        i18n_default_text='<0>Same login, new home.</0> Sign in with your usual Deriv credentials, nothing to set up.'
                                        components={[<strong key={0} />]}
                                    />
                                </Text>
                            </div>
                        </>
                    )}
                    <div className='redirect-to-home-popup__actions'>
                        {view !== 'error' && (
                            <Button
                                variant='primary'
                                color='coral'
                                size='lg'
                                fullWidth
                                isLoading={is_migrating}
                                disabled={is_contacting_support}
                                icon={
                                    is_migrating ? undefined : (
                                        <StandaloneArrowRightBoldIcon iconSize='sm' fill='#FFFFFF' />
                                    )
                                }
                                iconPosition='end'
                                label={<Localize i18n_default_text='Continue to home.deriv.com' />}
                                onClick={onContinue}
                            />
                        )}
                        <Button
                            variant={view === 'error' ? 'primary' : 'secondary'}
                            color={view === 'error' ? 'coral' : 'black'}
                            size='lg'
                            fullWidth
                            isLoading={is_contacting_support}
                            disabled={is_migrating}
                            label={<Localize i18n_default_text='Contact support' />}
                            onClick={onContactSupport}
                        />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default RedirectToHomePopup;
