import React from 'react';
import { toPng } from 'html-to-image';
import { QRCode } from 'react-qrcode-logo';
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
import { isMobile, useIsMounted } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import MyProfileSeparatorContainer from 'Components/my-profile/my-profile-separator-container';
import { base64_images } from 'Constants/base64-images';
import { TAdvertProps } from 'Types';
import ShareMyAdsIcons from './share-my-ads-icons';
import ShareMyAdsPopup from './share-my-ads-popup';

const ShareMyAdsModal = ({ advert }: TAdvertProps) => {
    const [show_popup, setShowPopup] = React.useState(false);
    const [is_copied, copyToClipboard, setIsCopied] = useCopyToClipboard();

    const isMounted = useIsMounted();
    const divRef = React.useRef(null);
    const advert_url = window.location.href;

    const { hideModal, is_modal_open } = useModalManagerContext();
    const { id, min_order_amount_limit_display, max_order_amount_limit_display, account_currency, type, rate_display } =
        advert;

    const options = {
        enableCORS: true,
        size: isMobile() ? 120 : 150,
        removeQrCodeBehindLogo: true,
        logoPadding: 4,
        logoImage: base64_images.dp2p_logo,
        logoWidth: isMobile() ? 30 : 40,
        logoHeight: isMobile() ? 30 : 40,
        logoOpacity: 1,
    };

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
            toPng(divRef.current)
                .then(dataUrl => {
                    const link = document.createElement('a');
                    link.download = 'test.png';
                    link.href = dataUrl;
                    link.click();
                })
                .catch(error => {
                    throw new Error(error);
                });
        }
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
                    <MobileWrapper>
                        {show_popup && <ShareMyAdsPopup onClose={() => setShowPopup(false)} />}
                    </MobileWrapper>
                    <DesktopWrapper>
                        <Text>
                            <Localize i18n_default_text='Promote your ad by sharing the QR code and link.' />
                        </Text>
                    </DesktopWrapper>
                    <div className='share-my-ads-modal__container'>
                        <div className='share-my-ads-modal__container__card'>
                            <div className='share-my-ads-modal__container__card-details' ref={divRef}>
                                <img
                                    className='share-my-ads-modal__container__card-details-icon'
                                    src={base64_images.deriv_p2p}
                                />
                                <Text
                                    className='share-my-ads-modal__container__card-details-title'
                                    weight='bold'
                                    size='m'
                                >
                                    <Localize
                                        i18n_default_text='{{type}} {{account_currency}}'
                                        values={{ type, account_currency }}
                                    />
                                </Text>
                                <div className='share-my-ads-modal__container__card-details--numbers'>
                                    <div className='share-my-ads-modal__container__card-details--numbers-text'>
                                        <Text color='colored-background' size='xs'>
                                            <Localize i18n_default_text='ID number' />
                                        </Text>
                                        <Text color='colored-background' size='xs'>
                                            <Localize i18n_default_text='Limit' />
                                        </Text>
                                        <Text color='colored-background' size='xs'>
                                            <Localize i18n_default_text='Rate' />
                                        </Text>
                                    </div>
                                    <div className='share-my-ads-modal__container__card-details--numbers-text'>
                                        <Text color='colored-background' size='xs' weight='bold'>
                                            <Localize i18n_default_text='{{id}}' values={{ id }} />
                                        </Text>
                                        <Text color='colored-background' size='xs' weight='bold'>
                                            <Localize
                                                i18n_default_text='{{min_order_amount_limit_display}} - {{max_order_amount_limit_display}} {{account_currency}}'
                                                values={{
                                                    min_order_amount_limit_display,
                                                    max_order_amount_limit_display,
                                                    account_currency,
                                                }}
                                            />
                                        </Text>
                                        <Text color='colored-background' size='xs' weight='bold'>
                                            <Localize i18n_default_text='{{rate_display}}%' values={{ rate_display }} />
                                        </Text>
                                    </div>
                                </div>
                                <div className='share-my-ads-modal__container__card-qr'>
                                    <div className='share-my-ads-modal__container__card-qr__background'>
                                        <QRCode value={advert_url} {...options} />
                                    </div>
                                    <Text
                                        className='share-my-ads-modal__container__card-qr__text'
                                        color='less-prominent'
                                        size='xxs'
                                    >
                                        <Localize i18n_default_text='Scan this code to order via Deriv P2P' />
                                    </Text>
                                </div>
                            </div>
                            <Button
                                className='share-my-ads-modal__container__card__download-button'
                                secondary
                                onClick={handleGenerateImage}
                            >
                                <Localize i18n_default_text='Download this QR code' />
                            </Button>
                            <MobileWrapper>
                                <Button.Group className='share-my-ads-modal__container__card__button-group'>
                                    <Button icon={<Icon icon='IcShare' />} secondary onClick={() => setShowPopup(true)}>
                                        <Localize i18n_default_text='Share link' />
                                    </Button>
                                    <Button
                                        icon={
                                            is_copied ? (
                                                <Icon icon='IcCheckmarkCircle' custom_color='var(--status-success)' />
                                            ) : (
                                                <Icon icon='IcShareLink' />
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
                                            text_copy={advert_url}
                                            size='18'
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
