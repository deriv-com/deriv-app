import React from 'react';
import { Modal } from '@deriv-com/quill-ui';
import { useLocalStorageData } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import { DESCRIPTION_VIDEO_ID } from 'Modules/Trading/Helpers/video-config';
import StreamIframe from '../../StreamIframe';
import { getLocalStorage } from '@deriv/utils';

type TTradeTypeSelectionGuideProps = {
    is_dark_mode_on?: boolean;
};

const TradeTypesSelectionGuide: React.FC<TTradeTypeSelectionGuideProps> = ({ is_dark_mode_on }) => {
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const guide_timeout_ref = React.useRef<ReturnType<typeof setTimeout>>();

    const [guide_dtrader_v2, setGuideDtraderV2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2');
    const { trade_types_selection } = guide_dtrader_v2 || {};

    const video_src = is_dark_mode_on
        ? DESCRIPTION_VIDEO_ID.trade_type_selection.dark
        : DESCRIPTION_VIDEO_ID.trade_type_selection.light;

    const onFinishGuide = () => {
        const latest_guide_dtrader_v2 = getLocalStorage('guide_dtrader_v2');
        setIsModalOpen(false);
        setGuideDtraderV2({ ...latest_guide_dtrader_v2, trade_types_selection: true });
    };

    React.useEffect(() => {
        if (!trade_types_selection) guide_timeout_ref.current = setTimeout(() => setIsModalOpen(true), 800);

        return () => clearTimeout(guide_timeout_ref.current);
    }, [trade_types_selection]);

    if (trade_types_selection) return null;

    return (
        <Modal
            isOpened={is_modal_open}
            isNonExpandable
            isMobile
            showHandleBar
            shouldCloseModalOnSwipeDown
            toggleModal={onFinishGuide}
            primaryButtonLabel={<Localize i18n_default_text='Got it' />}
            primaryButtonCallback={onFinishGuide}
        >
            <Modal.Header
                image={<StreamIframe src={video_src} title='trade_types_selection' />}
                title={<Localize i18n_default_text='Add, reorder or remove from pinned' />}
            />
            <Modal.Body>
                <Localize i18n_default_text='Manage your preferred trade types for easy access on the trade page.' />
            </Modal.Body>
        </Modal>
    );
};

export default React.memo(TradeTypesSelectionGuide);
