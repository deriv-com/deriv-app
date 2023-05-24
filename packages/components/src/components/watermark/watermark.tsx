import React, { CSSProperties } from 'react';
import './watermark.scss';

type TProps = {
    image: CSSProperties['backgroundImage'];
};

const Watermark: React.FC<React.PropsWithChildren<TProps>> = ({ image }) => (
    <div className='watermark' style={{ backgroundImage: image }} />
);

export default Watermark;
