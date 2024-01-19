import React from 'react';
import { getUUID } from '@deriv/bot-skeleton/src/services/tradeEngine/utils/helpers';
import { Text } from '@deriv/components';
import { observer } from '@deriv/stores';

type TTourSteps = {
    content: string[] | React.ReactElement[];
    media?: string;
    label: string | boolean;
    step_index: number;
    show_actions?: boolean;
    has_localize_component?: boolean;
};

const TourSteps = observer(
    ({ content, media, label, step_index, has_localize_component = false, show_actions = true }: TTourSteps) => {
        return (
            <React.Fragment>
                <div className='onboard'>
                    {show_actions && (
                        <div className='onboard__header'>
                            <Text color='less-prominent' line_height='l'>
                                {step_index}/6
                            </Text>
                        </div>
                    )}
                    <div className='onboard__steps'>
                        <div className='onboard__label'>
                            <Text as='p' line_height='l' weight='bold'>
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
                                        <div className='onboard__content__block' key={`onboard--${getUUID()}`}>
                                            <Text align='left' as='p' size='xs' line_height='l'>
                                                {content_data}
                                            </Text>
                                        </div>
                                    );
                                })}
                            </>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
);

export default TourSteps;
