import React from 'react';
import MigrateCard from '../../Assets/banner/migrate-card.svg';
import MigrateCardDark from '../../Assets/banner/migrate-card-dark.svg';

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

    return <Component className='mt5-migration-banner__image' data-testid={`dt_${image}`} />;
};

export default MigrationBannerImage;
