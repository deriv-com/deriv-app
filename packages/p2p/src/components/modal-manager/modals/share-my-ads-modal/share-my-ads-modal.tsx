import React from 'react';
import { toPng } from 'html-to-image';
import {
    Button,
    Clipboard,
    DesktopWrapper,
    Icon,
    MobileWrapper,
    Modal,
    Text,
    useCopyToClipboard,
} from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import MyProfileSeparatorContainer from 'Components/my-profile/my-profile-separator-container';
import { TAdvert } from 'Types';
import ShareMyAdsIcons from './share-my-ads-socials';
import ShareMyAdsCard from './share-my-ads-card';

const ShareMyAdsModal = ({ advert }: TAdvert) => {
    const [show_popup, setShowPopup] = React.useState(false);
    const [is_copied, copyToClipboard, setIsCopied] = useCopyToClipboard();

    const isMounted = useIsMounted();
    const divRef = React.useRef(null);
    // TODO: replace with proper url when available
    const advert_url = window.location.href;

    const { hideModal, is_modal_open } = useModalManagerContext();

    let timeout_clipboard: ReturnType<typeof setTimeout>;

    const onCopy = (event: { stopPropagation: () => void }) => {
        copyToClipboard(advert_url);
        timeout_clipboard = setTimeout(() => {
            if (isMounted()) {
                setIsCopied(false);
            }
        }, 2000);
        event.stopPropagation();
    };

    const handleGenerateImage = () => {
        if (divRef.current) {
            toPng(divRef.current).then(dataUrl => {
                const link = document.createElement('a');
                link.download = 'test.png';
                link.href = dataUrl;
                link.click();
            });
        }
    };

    // TODO: Replace with proper message and url when available
    const handleShareLink = () => {
        navigator.share({
            url: advert_url,
            title: 'P2P Advert',
            text: 'This is my advert!',
        });
    };

    React.useEffect(() => {
        return () => {
            clearTimeout(timeout_clipboard);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <Modal
                has_close_icon
                is_open={is_modal_open}
                title={localize('Share this ad')}
                toggleModal={() => (show_popup ? {} : hideModal())}
                width='71rem'
            >
                <Modal.Body className='share-my-ads-modal__body'>
                    <DesktopWrapper>
                        <Text>
                            <Localize i18n_default_text='Promote your ad by sharing the QR code and link.' />
                        </Text>
                    </DesktopWrapper>
                    <div className='share-my-ads-modal__container'>
                        <div className='share-my-ads-modal__container__card'>
                            <ShareMyAdsCard advert={advert} advert_url={advert_url} divRef={divRef} />
                            <Button
                                className='share-my-ads-modal__container__card__download-button'
                                secondary
                                onClick={handleGenerateImage}
                            >
                                <Localize i18n_default_text='Download this QR code' />
                            </Button>
                            <MobileWrapper>
                                <Button.Group className='share-my-ads-modal__container__card__button-group'>
                                    <Button icon={<Icon icon='IcShare' />} secondary onClick={handleShareLink}>
                                        <Localize i18n_default_text='Share link' />
                                    </Button>
                                    <Button
                                        icon={
                                            is_copied ? (
                                                <Icon icon='IcCheckmarkCircle' custom_color='var(--status-success)' />
                                            ) : (
                                                <Icon icon='IcShareLink' data_testid='dt-copy-link-icon' />
                                            )
                                        }
                                        secondary
                                        onClick={onCopy}
                                    >
                                        <Localize i18n_default_text='Copy link' />
                                    </Button>
                                </Button.Group>
                            </MobileWrapper>
                        </div>
                        <DesktopWrapper>
                            <div className='share-my-ads-modal__share'>
                                <Text weight='bold'>
                                    <Localize i18n_default_text='Share link to' />
                                </Text>
                                <ShareMyAdsIcons />
                                <MyProfileSeparatorContainer.Line
                                    className='share-my-ads-modal__line'
                                    is_invisible={false}
                                />
                                <Text>
                                    <Localize i18n_default_text='Or copy this link' />
                                </Text>
                                <div className='share-my-ads-modal__copy'>
                                    <Text className='share-my-ads-modal__copy-link' color='less-prominent'>
                                        <Localize i18n_default_text='Click {{- link}}' values={{ link: advert_url }} />
                                    </Text>
                                    <div className='share-my-ads-modal__copy-clipboard'>
                                        <Clipboard
                                            className='share-my-ads-modal__copy-clipboard--icon'
                                            popoverAlignment='top'
                                            popoverClassName='share-my-ads-modal__copy-clipboard--popover'
                                            size='18'
                                            success_message={localize('Copied!')}
                                            text_copy={advert_url}
                                        />
                                    </div>
                                </div>
                            </div>
                        </DesktopWrapper>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default observer(ShareMyAdsModal);
