import React from 'react';
import { Modal } from '@deriv-com/quill-ui';
import { useLocalStorageData } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import GuideContainer from './guide-container';
import OnboardingVideo from './onboarding-video';

const OnboardingGuide = () => {
    const [should_show_onboarding_guide, setShouldShowOnboardingGuide] = React.useState(false);
    const [should_run_onboarding_guide, setShouldRunOnboardingGuide] = React.useState(false);
    const onboarding_guide_timeout_ref = React.useRef<ReturnType<typeof setTimeout>>();

    const [onboarding_guide_dtrader_v2, setOnboardingGuideDtraderV2] = useLocalStorageData<boolean>(
        'onboarding_guide_dtrader_v2',
        false
    );

    const onFinishGuide = React.useCallback(() => {
        setShouldRunOnboardingGuide(false);
        setOnboardingGuideDtraderV2(true);
    }, [setOnboardingGuideDtraderV2]);

    const onGuideSkip = () => {
        onFinishGuide();
        setShouldShowOnboardingGuide(false);
    };

    const onGuideStart = () => {
        setShouldRunOnboardingGuide(true);
        setShouldShowOnboardingGuide(false);
    };

    React.useEffect(() => {
        if (!onboarding_guide_dtrader_v2)
            onboarding_guide_timeout_ref.current = setTimeout(() => setShouldShowOnboardingGuide(true), 800);

        return () => clearTimeout(onboarding_guide_timeout_ref.current);
    }, [onboarding_guide_dtrader_v2]);

    return (
        <React.Fragment>
            <Modal
                isOpened={should_show_onboarding_guide}
                isMobile
                showHandleBar={false}
                showSecondaryButton
                secondaryButtonLabel={<Localize i18n_default_text='Skip' />}
                secondaryButtonCallback={onGuideSkip}
                toggleModal={onGuideSkip}
                primaryButtonLabel={<Localize i18n_default_text="Let's begin" />}
                primaryButtonCallback={onGuideStart}
            >
                <Modal.Header
                    className='onboarding-guide__video'
                    image={<OnboardingVideo />}
                    title={<Localize i18n_default_text='Welcome to the new Deriv Trader' />}
                />
                <Modal.Body>
                    <Localize i18n_default_text='Enjoy a smoother, more intuitive trading experience. Here’s a quick tour to get you started.' />
                </Modal.Body>
            </Modal>
            <GuideContainer should_run={should_run_onboarding_guide} onFinishGuide={onFinishGuide} />
        </React.Fragment>
    );
};

export default React.memo(OnboardingGuide);
