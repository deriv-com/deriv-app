/* eslint-disable camelcase */
import React, { memo, MouseEvent, useEffect, useRef } from 'react';
import clsx from 'clsx';
import html2canvas from 'html2canvas';
import Modal from 'react-modal';
import { Clipboard } from '@/components';
import { BUY_SELL, RATE_TYPE } from '@/constants';
import { useCopyToClipboard } from '@/hooks';
import { p2p } from '@deriv/api-v2';
import { Button, Divider, Text, useDevice } from '@deriv-com/ui';
//TODO: replace below icons with the one from quill once available
import CheckmarkCircle from '../../../public/ic-checkmark-circle.svg';
import ShareIcon from '../../../public/ic-share.svg';
import ShareLinkIcon from '../../../public/ic-share-link.svg';
import { customStyles } from '../helpers';
import ShareMyAdsCard from './ShareAdsCard';
import ShareMyAdsSocials from './ShareAdsSocials';
import './ShareAdsModal.scss';

type TShareAdsModalProps = {
    id: string;
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const websiteUrl = () => `${location.protocol}//${location.hostname}/`;

const ShareAdsModal = ({ id, isModalOpen, onRequestClose }: TShareAdsModalProps) => {
    const timeoutClipboardRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { isMobile } = useDevice();
    const { data: advertInfo, isLoading: isLoadingInfo } = p2p.advert.useGet({ id });
    const [isCopied, copyToClipboard, setIsCopied] = useCopyToClipboard();
    const { account_currency, advertiser_details, local_currency, rate_display, rate_type, type } = advertInfo ?? {};
    const { id: advertiserId } = advertiser_details ?? {};

    const divRef = useRef<HTMLDivElement | null>(null);
    const advertUrl = `${websiteUrl()}cashier/p2p/advertiser?id=${advertiserId}&advert_id=${id}`;
    const isBuyAd = type === BUY_SELL.BUY;
    const firstCurrency = isBuyAd ? local_currency : account_currency;
    const secondCurrency = isBuyAd ? account_currency : local_currency;
    const adRateType = rate_type === RATE_TYPE.FLOAT ? '%' : ` ${local_currency}`;
    const customMessage = `Hi! I'd like to exchange ${firstCurrency} for ${secondCurrency} at ${rate_display}${adRateType} on Deriv P2P.\n\nIf you're interested, check out my ad 👉\n\n${advertUrl} \n\nThanks!`;

    useEffect(() => {
        Modal.setAppElement('#v2_modal_root');
    }, []);

    const onCopy = (event: MouseEvent) => {
        copyToClipboard(advertUrl);
        setIsCopied(true);
        timeoutClipboardRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
        event.stopPropagation();
    };

    const handleGenerateImage = async () => {
        if (divRef.current) {
            const p2pLogo = divRef.current.querySelector('.p2p-v2-share-ads-card__qr-icon');
            if (p2pLogo) {
                const canvas = await html2canvas(divRef.current, { allowTaint: true, useCORS: true });
                const screenshot = canvas.toDataURL('image/png', 1.0);
                const fileName = `${type}_${id}.png`;
                const link = document.createElement('a');
                link.download = fileName;
                link.href = screenshot;
                link.click();
            }
        }
    };

    const handleShareLink = () => {
        navigator.share({
            text: customMessage,
        });
    };

    useEffect(() => {
        return () => {
            if (timeoutClipboardRef.current) {
                clearTimeout(timeoutClipboardRef.current);
            }
        };
    }, []);

    return (
        <>
            {!isLoadingInfo && (
                <Modal
                    className={clsx('p2p-v2-modal-styles p2p-v2-share-ads-modal p-[2.4rem] flex flex-col')}
                    isOpen={isModalOpen}
                    onRequestClose={onRequestClose}
                    style={customStyles}
                    testId='dt_p2p_v2_share_ads_modal'
                >
                    <Text weight='bold'>Share this ad</Text>
                    {!isMobile && <Text className='pt-[2.6rem]'>Promote your ad by sharing the QR code and link.</Text>}
                    <div className='flex flex-row p2p-v2-share-ads-modal__container'>
                        <div className='flex flex-col p2p-v2-share-ads-modal__container__card'>
                            <ShareMyAdsCard advert={advertInfo} advertUrl={advertUrl} ref={divRef} />
                            <Button
                                isFullWidth={isMobile}
                                onClick={handleGenerateImage}
                                textSize={isMobile ? 'md' : 'sm'}
                                variant='outlined'
                            >
                                Download this QR code
                            </Button>
                            {isMobile && (
                                <div className='flex w-full gap-4 justify-between mt-6'>
                                    <Button
                                        className='flex items-center gap-4 w-full p2p-v2-share-ads-modal__container__card__button'
                                        onClick={handleShareLink}
                                        textSize='md'
                                        variant='outlined'
                                    >
                                        <ShareIcon />
                                        Share link
                                    </Button>
                                    <Button
                                        className='flex items-center gap-4 w-full p2p-v2-share-ads-modal__container__card__button'
                                        onClick={onCopy}
                                        textSize='md'
                                        variant='outlined'
                                    >
                                        {isCopied ? <CheckmarkCircle /> : <ShareLinkIcon />}
                                        Copy link
                                    </Button>
                                </div>
                            )}
                        </div>
                        {!isMobile && (
                            <div className='pl-[2.4rem] w-[52%]'>
                                <Text weight='bold'>Share via</Text>
                                <ShareMyAdsSocials advertUrl={advertUrl} customMessage={customMessage} />
                                <Divider margin='0 0 2.5rem 0' />
                                <Text>Or copy this link</Text>
                                <div className=' flex flex-row items-center p2p-v2-share-ads-modal__copy'>
                                    <Text className='p2p-v2-share-ads-modal__copy-link' color='less-prominent'>
                                        {advertUrl}
                                    </Text>
                                    {/* TODO: clipboard to be replaced */}
                                    <div className='flex items-center justify-center p2p-v2-share-ads-modal__copy-clipboard'>
                                        <Clipboard textCopy={advertUrl} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
};

export default memo(ShareAdsModal);
