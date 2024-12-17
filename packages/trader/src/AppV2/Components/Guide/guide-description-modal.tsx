import React from 'react';
import { ActionSheet, Heading } from '@deriv-com/quill-ui';
import { VideoPlayer } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { clickAndKeyEventHandler } from '@deriv/shared';
import { getDescriptionVideoIds } from 'AppV2/Utils/contract-description-utils';
import GuideContent from './guide-content';
import ReactDOM from 'react-dom';

type TGuideDescriptionModal = {
    contract_list: { tradeType: React.ReactNode; id: string }[];
    is_dark_mode_on?: boolean;
    is_open?: boolean;
    onChipSelect: (id: string) => void;
    onClose: () => void;
    onTermClick: (term: string) => void;
    selected_contract_type: string;
    show_guide_for_selected_contract?: boolean;
    show_description_in_a_modal?: boolean;
};

const PortalModal = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className='modal-player' aria-modal='true'>
            <div
                className='modal-player__container'
                onClick={e => e.stopPropagation()}
                onKeyDown={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
};

const GuideDescriptionModal = ({
    contract_list,
    is_dark_mode_on,
    is_open,
    onChipSelect,
    onClose,
    onTermClick,
    selected_contract_type,
    show_guide_for_selected_contract,
    show_description_in_a_modal = true,
}: TGuideDescriptionModal) => {
    const [is_video_player_opened, setIsVideoPlayerOpened] = React.useState(false);
    const modal_ref = React.useRef<HTMLDialogElement>(null);

    const video_src = getDescriptionVideoIds(selected_contract_type, is_dark_mode_on);

    const toggleVideoPlayer = (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        clickAndKeyEventHandler(() => setIsVideoPlayerOpened(!is_video_player_opened), e);
    };

    const guide_content_props = {
        contract_list,
        onChipSelect,
        onTermClick,
        selected_contract_type,
        show_guide_for_selected_contract,
        show_description_in_a_modal,
        toggleVideoPlayer,
        video_src,
    };

    React.useEffect(() => {
        if (modal_ref.current) is_video_player_opened ? modal_ref.current.showModal() : modal_ref.current.close();
    }, [is_video_player_opened]);

    return (
        <React.Fragment>
            {show_description_in_a_modal ? (
                <ActionSheet.Root isOpen={is_open} onClose={onClose} position='left' expandable={false}>
                    <ActionSheet.Portal shouldCloseOnDrag>
                        <ActionSheet.Content className='guide__wrapper__content'>
                            <Heading.H4 className='guide__title'>
                                {show_guide_for_selected_contract ? (
                                    selected_contract_type
                                ) : (
                                    <Localize i18n_default_text='Trade types' />
                                )}
                            </Heading.H4>
                            <GuideContent {...guide_content_props} />
                        </ActionSheet.Content>
                        <ActionSheet.Footer
                            alignment='vertical'
                            primaryAction={{
                                content: <Localize i18n_default_text='Got it' />,
                                onAction: onClose,
                            }}
                            className='guide__button'
                        />
                    </ActionSheet.Portal>
                </ActionSheet.Root>
            ) : (
                <div className='guide__wrapper__content--separate'>
                    <GuideContent {...guide_content_props} />
                </div>
            )}
            <PortalModal isOpen={is_video_player_opened}>
                <VideoPlayer
                    className='modal-player__wrapper'
                    data_testid='dt_video_player'
                    is_v2
                    is_mobile
                    increased_drag_area
                    src={video_src}
                    onModalClose={toggleVideoPlayer}
                />
            </PortalModal>
        </React.Fragment>
    );
};

export default React.memo(GuideDescriptionModal);
