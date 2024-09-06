import React from 'react';
import { Modal } from '@deriv-com/quill-ui';
import { useLocalStorageData } from '@deriv/hooks';
import { Localize } from '@deriv/translations';

type TTradeTypesSelectionGuideProps = {
    is_open?: boolean;
};

const TradeTypesSelectionGuide = ({ is_open }: TTradeTypesSelectionGuideProps) => {
    const [is_modal_open, setIsModalOpen] = React.useState(is_open);
    const guide_timeout_ref = React.useRef<ReturnType<typeof setTimeout>>();

    const [guide_dtrader_v2, setGuideDtraderV2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2', {
        trade_types_selection: false,
        trade_page: false,
        positions_page: false,
    });
    const { trade_types_selection } = guide_dtrader_v2 || {};

    const onFinishGuide = () => {
        setIsModalOpen(false);
        setGuideDtraderV2({ ...guide_dtrader_v2, trade_types_selection: true });
    };

    React.useEffect(() => {
        if (!is_open) return;
        if (!trade_types_selection) guide_timeout_ref.current = setTimeout(() => setIsModalOpen(true), 800);

        return () => clearTimeout(guide_timeout_ref.current);
    }, [trade_types_selection, is_open]);

    return (
        <React.Fragment>
            <Modal
                handleBarIndex={2}
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
                    image={<div className='video-placeholder' />}
                    title={<Localize i18n_default_text='Manage your trade types' />}
                />
                <Modal.Body>
                    <Localize i18n_default_text='Pin, rearrange, or remove your favorite trade types for easy access.' />
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default React.memo(TradeTypesSelectionGuide);
