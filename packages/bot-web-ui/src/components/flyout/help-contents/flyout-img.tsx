import React from 'react';

type FlyoutImageProps = {
    url: string;
};

const FlyoutImage = (props: FlyoutImageProps) => {
    const { width, url } = props;
    const style = { width };

    return (
        <div className='flyout__item'>
            <img src={url} className='flyout__image' style={style} />
        </div>
    );
};

export default FlyoutImage;
