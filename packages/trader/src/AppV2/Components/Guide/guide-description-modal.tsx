import React from 'react';
import { ActionSheet, Heading, Chip, Text } from '@deriv-com/quill-ui';
import { VideoPlayer } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { clickAndKeyEventHandler } from '@deriv/shared';
import { AVAILABLE_CONTRACTS, CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import { getDescriptionVideoIds } from 'AppV2/Utils/contract-description-utils';
import TradeDescription from './Description/trade-description';
import VideoPreview from './Description/video-preview';

type TGuideDescriptionModal = {
    is_open?: boolean;
    is_dark_mode_on?: boolean;
    onClose: () => void;
    onChipSelect: (id: string) => void;
    onTermClick: (term: string) => void;
    selected_contract_type: string;
    show_guide_for_selected_contract?: boolean;
};

const GuideDescriptionModal = ({
    is_open,
    is_dark_mode_on,
    onClose,
    onChipSelect,
    onTermClick,
    selected_contract_type,
    show_guide_for_selected_contract,
}: TGuideDescriptionModal) => {
    const [is_video_player_opened, setIsVideoPlayerOpened] = React.useState(false);
    const modal_ref = React.useRef<HTMLDialogElement>(null);

    const video_src = getDescriptionVideoIds(selected_contract_type, is_dark_mode_on);
    //TODO: temporary, until we'll have ordered list, coming from contract type selection
    const order = [
        CONTRACT_LIST.RISE_FALL,
        CONTRACT_LIST.ACCUMULATORS,
        CONTRACT_LIST.MULTIPLIERS,
        CONTRACT_LIST.VANILLAS,
        CONTRACT_LIST.TURBOS,
        CONTRACT_LIST.HIGHER_LOWER,
        CONTRACT_LIST.TOUCH_NO_TOUCH,
        CONTRACT_LIST.MATCHES_DIFFERS,
        CONTRACT_LIST.EVEN_ODD,
        CONTRACT_LIST.OVER_UNDER,
    ];

    const toggleVideoPlayer = (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        clickAndKeyEventHandler(() => setIsVideoPlayerOpened(!is_video_player_opened), e);
    };

    const ordered_contract_list = [...AVAILABLE_CONTRACTS].sort(
        (a, b) => order.findIndex(item => item === a.id) - order.findIndex(item => item === b.id)
    );

    React.useEffect(() => {
        if (modal_ref.current) is_video_player_opened ? modal_ref.current.showModal() : modal_ref.current.close();
    }, [is_video_player_opened]);

    return (
        <React.Fragment>
            <ActionSheet.Root isOpen={is_open} onClose={onClose} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Content className='guide__wrapper--content'>
                        <Heading.H4 className='guide__title'>
                            {show_guide_for_selected_contract ? (
                                selected_contract_type
                            ) : (
                                <Localize i18n_default_text='Trade types' />
                            )}
                        </Heading.H4>
                        {!show_guide_for_selected_contract && (
                            <div className='guide__menu'>
                                {ordered_contract_list.map(({ tradeType, id }) => (
                                    <Chip.Selectable
                                        key={id}
                                        onChipSelect={() => onChipSelect(id)}
                                        selected={id === selected_contract_type}
                                    >
                                        <Text size='sm'>{tradeType}</Text>
                                    </Chip.Selectable>
                                ))}
                            </div>
                        )}
                        <div className='guide__contract-description' key={selected_contract_type}>
                            <TradeDescription contract_type={selected_contract_type} onTermClick={onTermClick} />
                            <VideoPreview
                                contract_type={selected_contract_type}
                                toggleVideoPlayer={toggleVideoPlayer}
                                video_src={video_src}
                            />
                        </div>
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
            {is_video_player_opened && (
                <dialog
                    ref={modal_ref}
                    onClick={toggleVideoPlayer}
                    onKeyDown={toggleVideoPlayer}
                    className='modal-player'
                >
                    <div onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}>
                        <VideoPlayer
                            className='modal-player__wrapper'
                            data_testid='dt_video_player'
                            height='180px'
                            is_mobile
                            src={video_src}
                        />
                    </div>
                </dialog>
            )}
        </React.Fragment>
    );
};

export default React.memo(GuideDescriptionModal);
