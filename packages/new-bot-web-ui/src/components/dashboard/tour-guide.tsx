import React from 'react';
import { Text, Loading } from '@deriv/components';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import { localize } from '@deriv/translations';

type TTourGuide = {
    content: string[];
    img?: string;
    label: string | boolean;
    onCloseTour: () => void;
    step_index: number;
};

const TourGuide = ({ content, img, label, onCloseTour, step_index }: TTourGuide) => {
    const [has_image_loaded, setImageLoaded] = React.useState(false);

    React.useEffect(() => {
        if (img) {
            const tour_image = new Image();
            tour_image.onload = () => {
                setImageLoaded(true);
            };
            tour_image.src = img;
        }
    }, [step_index]);

    return (
        <React.Fragment>
            <div className='onboard'>
                <div className='onboard__header'>
                    <Text color='less-prominent' line_height='l'>
                        {step_index}/6
                    </Text>
                    <Text className='onboard__header--close' line_height='l' onClick={onCloseTour}>
                        {localize('Exit tour')}
                    </Text>
                </div>
                <div className='onboard__label'>
                    <Text as='h' line_height='l' weight='bold'>
                        {label}
                    </Text>
                </div>

                {img && (
                    <div className='onboard__container'>
                        {has_image_loaded ? <img src={img} loading='eager' /> : <Loading />}
                    </div>
                )}

                <div className='onboard__content'>
                    {content.map(content_text => {
                        return (
                            <div className='onboard__content__block' key={content_text}>
                                <Text align='left' as='h' size='xs' line_height='l'>
                                    {content_text}
                                </Text>
                            </div>
                        );
                    })}
                </div>
            </div>
        </React.Fragment>
    );
};
export default connect(({ dashboard }: RootStore) => ({
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    setTourActive: dashboard.setTourActive,
    onCloseTour: dashboard.onCloseTour,
}))(TourGuide);
