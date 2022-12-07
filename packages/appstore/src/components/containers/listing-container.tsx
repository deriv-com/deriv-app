import React, { ReactNode } from 'react';

type ListingContainerProps = {
    title: ReactNode;
    description: ReactNode;
};

const ListingContainer = ({ title, description }: ListingContainerProps) => {
    return <div className='listing-container__main-container'>Listing Container</div>;
};

export default ListingContainer;
