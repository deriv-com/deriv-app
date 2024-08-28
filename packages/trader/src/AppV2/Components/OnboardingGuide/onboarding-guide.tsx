import React from 'react';
import { Modal } from '@deriv-com/quill-ui';
import { useLocalStorageData } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import GuideContainer from './guide-container';
import OnboardingVideo from './onboarding-video';

type TOnboardingGuideProps = {
    type?: 'trade_page' | 'positions_page';
};

const OnboardingGuide = ({ type = 'trade_page' }: TOnboardingGuideProps) => {
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const [should_run_guide, setShouldRunGuide] = React.useState(false);
    const guide_timeout_ref = React.useRef<ReturnType<typeof setTimeout>>();

    const [guide_dtrader_v2, setGuideDtraderV2] = useLocalStorageData<boolean>(`guide_dtrader_v2_${type}`, false);
    const is_trade_page_guide = type === 'trade_page';

    const onFinishGuide = React.useCallback(() => {
        setShouldRunGuide(false);
        setGuideDtraderV2(true);
    }, [setGuideDtraderV2]);

    const onGuideSkip = () => {
        onFinishGuide();
        setIsModalOpen(false);
    };

    const onGuideStart = () => {
        setShouldRunGuide(true);
        setIsModalOpen(false);
    };

    const modal_content = {
        image: is_trade_page_guide ? <OnboardingVideo /> : <div className='video-placeholder' />,
        title: is_trade_page_guide ? (
            <Localize i18n_default_text='Welcome to the new Deriv Trader' />
        ) : (
            <Localize i18n_default_text='View your positions' />
        ),
        content: is_trade_page_guide ? (
            <Localize i18n_default_text='Enjoy a smoother, more intuitive trading experience. Here’s a quick tour to get you started.' />
        ) : (
            <Localize i18n_default_text='You can view your open and closed positions here. Tap an item for more details.' />
        ),
        button_label: is_trade_page_guide ? (
            <Localize i18n_default_text="Let's begin" />
        ) : (
            <Localize i18n_default_text='Got it' />
        ),
        primaryButtonCallback: is_trade_page_guide ? onGuideStart : onGuideSkip,
    };

    React.useEffect(() => {
        if (!guide_dtrader_v2) guide_timeout_ref.current = setTimeout(() => setIsModalOpen(true), 800);

        return () => clearTimeout(guide_timeout_ref.current);
    }, [guide_dtrader_v2]);

    return (
        <React.Fragment>
            <Modal
                isOpened={is_modal_open}
                isMobile
                showHandleBar
                toggleModal={onGuideSkip}
                primaryButtonLabel={modal_content.button_label}
                primaryButtonCallback={modal_content.primaryButtonCallback}
            >
                <Modal.Header image={modal_content.image} title={modal_content.title} />
                <Modal.Body>{modal_content.content}</Modal.Body>
            </Modal>
            {is_trade_page_guide && <GuideContainer should_run={should_run_guide} onFinishGuide={onFinishGuide} />}
        </React.Fragment>
    );
};

export default React.memo(OnboardingGuide);
