import React from 'react';

type TCard = {
    children: React.ReactNode | React.ReactNode[];
    width: number;
};

const Card = ({ children, width }: TCard) => (
    <div
        className='dc-carousel__card'
        style={{
            width: `${width}px`,
        }}
    >
        {children}
    </div>
);

export default Card;
