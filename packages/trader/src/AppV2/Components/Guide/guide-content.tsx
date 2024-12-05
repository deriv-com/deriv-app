import React from 'react';
import clsx from 'clsx';
import { Chip, Text } from '@deriv-com/quill-ui';
import TradeDescription from './Description/trade-description';
import VideoPreview from './Description/video-preview';

type TGuideContent = {
    contract_list: { tradeType: React.ReactNode; id: string }[];
    onChipSelect: (id: string) => void;
    onTermClick: (term: string) => void;
    selected_contract_type: string;
    show_guide_for_selected_contract?: boolean;
    show_description_in_a_modal?: boolean;
    toggleVideoPlayer: (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    video_src: string;
};

const GuideContent = ({
    contract_list,
    onChipSelect,
    onTermClick,
    selected_contract_type,
    show_guide_for_selected_contract,
    show_description_in_a_modal = true,
    toggleVideoPlayer,
    video_src,
}: TGuideContent) => (
    <React.Fragment>
        {!show_guide_for_selected_contract && (
            <div className='guide__menu'>
                {contract_list.map(({ tradeType, id }: { tradeType: React.ReactNode; id: string }) => (
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
        <div
            className={clsx('guide__contract-description', {
                'guide__contract-description--without-btn': !show_description_in_a_modal,
            })}
            key={selected_contract_type}
        >
            <TradeDescription contract_type={selected_contract_type} onTermClick={onTermClick} />
            <VideoPreview
                contract_type={selected_contract_type}
                toggleVideoPlayer={toggleVideoPlayer}
                video_src={video_src}
            />
        </div>
    </React.Fragment>
);

export default GuideContent;
