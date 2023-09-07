import React from 'react';
import { Icon, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';

type TTourGuide = {
    content: string[] | React.ReactElement[];
    media?: string;
    label: string | boolean;
    step_index: number;
    show_actions?: boolean;
    has_localize_component?: boolean;
};

const TourGuide = observer(
    ({ content, media, label, step_index, has_localize_component = false, show_actions = true }: TTourGuide) => {
        const { dashboard } = useDBotStore();
        const { onCloseTour } = dashboard;

        return (
            <React.Fragment>
                <div className='onboard'>
                    {show_actions && (
                        <div className='onboard__header'>
                            <Text color='less-prominent' line_height='l'>
                                {step_index}/6
                            </Text>
                            <span onClick={onCloseTour}>
                                <Icon icon='IcCross' className='db-contract-card__result-icon' />
                            </span>
                        </div>
                    )}
                    <div className='onboard__label'>
                        <Text as='h' line_height='l' weight='bold'>
                            {label}
                        </Text>
                    </div>

                    {media && (
                        <video
                            autoPlay={true}
                            loop
                            controls
                            preload='auto'
                            playsInline
                            disablePictureInPicture
                            controlsList='nodownload'
                            style={{ width: '100%' }}
                            src={media}
                        />
                    )}

                    <div className='onboard__content'>
                        <>
                            {content.map((content_data, index) => {
                                return has_localize_component ? (
                                    content_data
                                ) : (
                                    <div className='onboard__content__block' key={`onboard--${index}`}>
                                        <Text align='left' as='h' size='xs' line_height='l'>
                                            {content_data}
                                        </Text>
                                    </div>
                                );
                            })}
                        </>
                    </div>
                </div>
            </React.Fragment>
        );
    }
);

export default TourGuide;
