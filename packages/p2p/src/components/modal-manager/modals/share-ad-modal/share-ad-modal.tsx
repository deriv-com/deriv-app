import React from 'react';
import domtoimage from 'dom-to-image';
import { QRCode } from 'react-qrcode-logo';
import {
    EmailIcon,
    FacebookShareButton,
    FacebookIcon,
    TelegramShareButton,
    TelegramIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
} from 'react-share';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const ShareAdModal = ({ advert }) => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { id, min_order_amount_limit_display, max_order_amount_limit_display, account_currency, type, rate_display } =
        advert;

    const divRef = React.useRef(null);

    const options = {
        ecLevel: 'M',
        enableCORS: true,
        size: 200,
        quietZone: 10,
        bgColor: '#FFFFFF',
        fgColor: '#000',
        logoPadding: 5,
        removeQrCodeBehindLogo: true,
        logoImage:
            'https://play-lh.googleusercontent.com/ah8RkaAnph2gouJ48fVeybeJgw-tu2dzTDYL7miccIWxvd0ZcK5-MM20bGxjpjb2lXU',
        logoWidth: 50,
        logoHeight: 50,
        logoOpacity: 1,
        qrStyle: 'squares',
    };

    const handleGenerateImage = () => {
        if (divRef.current) {
            domtoimage
                .toPng(divRef.current)
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

    return (
        <Modal has_close_icon is_open={is_modal_open} title='Share this ad' toggleModal={hideModal}>
            <Modal.Body>
                <div className='share-ad-modal'>
                    <div className='share-ad-modal__card' ref={divRef}>
                        <Text className='share-ad-modal__card-title' color='colored-background' weight='bold' size='m'>
                            <Localize i18n_default_text='deriv P2P' />
                        </Text>
                        <Text className='share-ad-modal__card-title' weight='bold' size='m'>
                            <Localize
                                i18n_default_text='{{type}} {{account_currency}}'
                                values={{ type, account_currency }}
                            />
                        </Text>
                        <Text color='colored-background'>
                            <Localize i18n_default_text='ID number {{id}}' values={{ id }} />
                        </Text>
                        <Text color='colored-background'>
                            <Localize
                                i18n_default_text='Limit {{min_order_amount_limit_display}} - {{max_order_amount_limit_display}} {{account_currency}}'
                                values={{
                                    min_order_amount_limit_display,
                                    max_order_amount_limit_display,
                                    account_currency,
                                }}
                            />
                        </Text>
                        <Text color='colored-background'>
                            <Localize i18n_default_text='Rate {{rate_display}}' values={{ rate_display }} />
                        </Text>
                        <div className='share-ad-modal__card--image'>
                            <QRCode value={window.location.href} {...options} />;
                        </div>
                    </div>
                    <Button primary onClick={handleGenerateImage}>
                        <Localize i18n_default_text='Share advert' />
                    </Button>
                    <div>
                        <WhatsappShareButton url={window.location.href}>
                            <WhatsappIcon size={32} round={true} />
                        </WhatsappShareButton>
                        <FacebookShareButton url={window.location.href}>
                            <FacebookIcon size={32} round={true} />
                        </FacebookShareButton>
                        <TwitterShareButton url={window.location.href}>
                            <TwitterIcon size={32} round={true} />
                        </TwitterShareButton>
                        <TelegramShareButton url={window.location.href}>
                            <TelegramIcon size={30} round={true} />
                        </TelegramShareButton>
                        <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&body=${window.location.href}`}
                            target='_blank'
                            rel='noreferrer'
                        >
                            <Icon icon='IcStockGoogle' size={32} />
                        </a>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default observer(ShareAdModal);
