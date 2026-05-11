import React from 'react';
import { useHistory } from 'react-router-dom';

import { useLocalStorageData } from '@deriv/hooks';
import { getUrlBase, routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Button, Modal, Text } from '@deriv-com/quill-ui';

const PositionsBannerModal = () => {
    const history = useHistory();
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const timeout_ref = React.useRef<ReturnType<typeof setTimeout>>();
    const [positions_banner_seen, setPositionsBannerSeen] = useLocalStorageData<boolean>(
        'positions_banner_seen',
        false
    );

    const onClose = () => {
        setPositionsBannerSeen(true);
        setIsModalOpen(false);
    };

    const onReview = () => {
        setPositionsBannerSeen(true);
        setIsModalOpen(false);
        history.push(routes.trader_positions);
    };

    React.useEffect(() => {
        if (!positions_banner_seen) {
            timeout_ref.current = setTimeout(() => setIsModalOpen(true), 800);
        }
        return () => clearTimeout(timeout_ref.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [positions_banner_seen]);

    return (
        <Modal
            isOpened={is_modal_open}
            isNonExpandable
            isMobile
            showHandleBar
            showCrossIcon={false}
            shouldCloseModalOnSwipeDown
            toggleModal={onClose}
            showPrimaryButton={false}
            hasFooter={false}
            className='positions-banner-modal'
        >
            <Modal.Header
                image={
                    <img src={getUrlBase('/public/images/common/clock_warning.png')} alt='' width={128} height={111} />
                }
                className='positions-banner-modal__header'
            />
            <Modal.Body>
                <div className='positions-banner-modal__content'>
                    <Text as='h2' size='lg' bold className='positions-banner-modal__title'>
                        <Localize i18n_default_text='Close positions by 13 June' />
                    </Text>
                    <Text size='md' className='positions-banner-modal__description'>
                        <Localize i18n_default_text="We're upgrading Deriv Trader on 13 June at 06:00 UTC." />
                    </Text>
                    <Text size='md' className='positions-banner-modal__description'>
                        <Localize i18n_default_text='Any open positions will be automatically closed at this time, so please review and close yours beforehand.' />
                    </Text>
                    <Text size='md' className='positions-banner-modal__description'>
                        <Localize i18n_default_text="You'll be able to open new positions after the upgrade." />
                    </Text>
                    <Button
                        className='positions-banner-modal__cta'
                        variant='primary'
                        color='coral'
                        size='lg'
                        fullWidth
                        label={<Localize i18n_default_text='Review positions' />}
                        onClick={onReview}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default React.memo(PositionsBannerModal);
