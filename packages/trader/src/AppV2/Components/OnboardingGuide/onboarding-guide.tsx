import React from 'react';
import { Modal } from '@deriv-com/quill-ui';
import { useLocalStorageData } from '@deriv/hooks';
import { Localize } from '@deriv/translations';
import GuideContainer from './guide-container';

// TODO: add second button for Skip. Add handlebar?
const OnboardingGuide = () => {
    const [should_show_onboarding_guide, setShouldShowOnboardingGuide] = React.useState(false);
    const [should_run_onboarding_guide, setShouldRunOnboardingGuide] = React.useState(false);
    const onboarding_guide_timeout_ref = React.useRef<ReturnType<typeof setTimeout>>();

    const [onboarding_guide_dtrader_v2, setOnboardingGuideDtraderV2, clearOnboardingGuideDtraderV2] =
        useLocalStorageData<boolean>('onboarding_guide_dtrader_v2', false);

    // TODO: remove after we get a real video
    const imageSRC = 'https://live.staticflickr.com/603/21947667154_e63cc9252b_b.jpg';
    const ImageComponent = <img src={imageSRC} alt='Apples' />;

    React.useEffect(() => {
        if (!onboarding_guide_dtrader_v2) {
            onboarding_guide_timeout_ref.current = setTimeout(() => setShouldShowOnboardingGuide(true), 800);
        }
        return () => clearTimeout(onboarding_guide_timeout_ref.current);
    }, [onboarding_guide_dtrader_v2]);

    return (
        <React.Fragment>
            <Modal
                isOpened={should_show_onboarding_guide}
                isMobile
                showHandleBar={false}
                shouldCloseOnPrimaryButtonClick
                toggleModal={setShouldShowOnboardingGuide}
                primaryButtonLabel={<Localize i18n_default_text="Let's begin" />}
                primaryButtonCallback={() => setShouldRunOnboardingGuide(true)}
            >
                <Modal.Header
                    className='onboarding-guide__video'
                    image={ImageComponent}
                    title={<Localize i18n_default_text='Welcome to the new Deriv Trader' />}
                />
                <Modal.Body>
                    <Localize i18n_default_text='Enjoy a smoother, more intuitive trading experience. Here’s a quick tour to get you started.' />
                </Modal.Body>
            </Modal>
            <GuideContainer should_run={should_run_onboarding_guide} />
        </React.Fragment>
    );
};

export default React.memo(OnboardingGuide);
