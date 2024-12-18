import React from 'react';
import { Modal } from '@deriv-com/quill-ui';
import { useLocalStorageData } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import OnboardingVideo from './onboarding-video';

type TOnboardingGuideProps = {
    callback?: () => void;
    is_dark_mode_on?: boolean;
    type?: 'trade_page' | 'positions_page';
};

const OnboardingGuide = ({ type = 'trade_page', is_dark_mode_on, callback }: TOnboardingGuideProps) => {
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const guide_timeout_ref = React.useRef<ReturnType<typeof setTimeout>>();

    const [guide_dtrader_v2, setGuideDtraderV2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2', {
        trade_types_selection: false,
        trade_page: false,
        positions_page: false,
        market_selector: false,
        trade_param_quick_adjustment: false,
        trade_params: false,
    });

    const is_trade_page_guide = type === 'trade_page';

    const onFinishGuide = React.useCallback(() => {
        setGuideDtraderV2({ ...guide_dtrader_v2, [type]: true });
        callback?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setGuideDtraderV2]);

    const onGuideDismiss = () => {
        onFinishGuide();
        setIsModalOpen(false);
    };

    const modal_content = {
        image: <OnboardingVideo type={is_dark_mode_on ? `${type}_dark` : type} />,
        title: <Localize i18n_default_text='View your positions' />,
        content: (
            <Localize i18n_default_text='You can view your open and closed positions here. Tap an item for more details.' />
        ),
        button_label: <Localize i18n_default_text='Got it' />,
        primaryButtonCallback: onGuideDismiss,
        ...(is_trade_page_guide
            ? {
                  title: <Localize i18n_default_text='Welcome to the Deriv Trader' />,
                  content: <Localize i18n_default_text='Discover a smoother, more intuitive trading experience.' />,
                  button_label: <Localize i18n_default_text="Let's go" />,
                  primaryButtonCallback: onGuideDismiss,
              }
            : {}),
    };

    React.useEffect(() => {
        if (!guide_dtrader_v2?.[type]) guide_timeout_ref.current = setTimeout(() => setIsModalOpen(true), 800);

        return () => clearTimeout(guide_timeout_ref.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guide_dtrader_v2?.[type]]);

    return (
        <React.Fragment>
            <Modal
                isOpened={is_modal_open}
                isNonExpandable
                isMobile
                showHandleBar
                shouldCloseModalOnSwipeDown
                toggleModal={onGuideDismiss}
                primaryButtonLabel={modal_content.button_label}
                primaryButtonCallback={modal_content.primaryButtonCallback}
            >
                <Modal.Header image={modal_content.image} title={modal_content.title} />
                <Modal.Body>{modal_content.content}</Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default React.memo(OnboardingGuide);
