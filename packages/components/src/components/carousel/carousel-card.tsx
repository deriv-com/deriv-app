import React from 'react';

type TCard = {
    width: number;
};

const Card = ({ children, width }: React.PropsWithChildren<TCard>) => (
    <div
        className='dc-carousel__card'
        style={{
            width: `calc(100vw - 1.6rem)`,
        }}
    >
        {children}
    </div>
);

export default Card;
