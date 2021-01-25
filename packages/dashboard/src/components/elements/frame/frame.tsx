import * as React from 'react';
import classNames from 'classnames';

const Frame: React.FC<TFrameProps> = ({ src, alt, className }) => {
    const image_ref = React.createRef<HTMLImageElement>();

    return (
        <img
            draggable={true}
            ref={image_ref}
            className={classNames('dw-frame', className)}
            src={src}
            alt={alt}
            width='200'
            height='200'
        />
    );
};

type TFrameProps = {
    src: string;
    alt: string;
    className?: string;
};

export default Frame;
