import React from 'react';
import MigrateCard from 'Assets/svgs/banner/migrate-card.svg';
import MigrateCardDark from 'Assets/svgs/banner/migrate-card-dark.svg';

export type TBannerImageProps<TMigrationBannerListProps> = {
    image: TMigrationBannerListProps;
};

type TMigrationBannerListProps = keyof typeof MigrationBannerList;

const MigrationBannerList = {
    migrate_card: MigrateCard,
    migrate_card_dark: MigrateCardDark,
};

const MigrationBannerImage = ({ image }: TBannerImageProps<TMigrationBannerListProps>) => {
    const Component = MigrationBannerList[image];

    return <Component className='traders-hub-banner__migrate-banner__image' data-testid={`dt_${image}`} />;
};

export default MigrationBannerImage;
