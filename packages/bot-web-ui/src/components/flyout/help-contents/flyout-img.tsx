import React from 'react';

type TFlyoutImageProps = {
    width: string;
    url: string;
};

const FlyoutImage = (props: TFlyoutImageProps) => {
    const { width, url } = props;
    const style = { width };

    return (
        <div className='flyout__item' data-testid='dt_flyout_image'>
            <img src={url} className='flyout__image' style={style} />
        </div>
    );
};

export default FlyoutImage;
