import React from 'react';

type CardProps = {
    width: number;
};

const Card = ({ children, width }: CardProps) => (
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
