import React from 'react';
import { createPortal } from 'react-dom';
import { Icon, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import ShareMyAdsIcons from '../share-my-ads-icons';

type TShareMyAdsPopupProps = {
    onClose: () => void;
};

const ShareMyAdsPopup = ({ onClose }: TShareMyAdsPopupProps) => {
    const popup = document.getElementById('modal_root');

    if (popup) {
        return createPortal(
            <div className='share-my-ads-popup'>
                <div className='share-my-ads-popup__container'>
                    <div className='share-my-ads-popup__container-header'>
                        <Text>
                            <Localize i18n_default_text='Share my ads' />
                        </Text>
                        <Icon className='share-my-ads-popup__container-icon' icon='IcCross' onClick={onClose} />
                    </div>
                    <ShareMyAdsIcons />
                </div>
            </div>,
            popup
        );
    }

    return null;
};

export default ShareMyAdsPopup;
