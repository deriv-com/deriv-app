import React from 'react';

type TCard = {
    width: number;
};

const Card = ({ children, width }: React.PropsWithChildren<TCard>) => (
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
