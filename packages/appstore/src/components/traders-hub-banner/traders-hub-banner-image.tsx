import React from 'react';
import MigrateDesktopImage from 'Assets/svgs/banner/migrate-desktop.svg';
import MigrateMobileImage from 'Assets/svgs/banner/migrate-mobile.svg';
import MigrateCard from 'Assets/svgs/banner/migrate-card.svg';

export type TBannerImageProps<TTradersHubBannerImageListProps> = {
    image?: TTradersHubBannerImageListProps;
    class_name?: string;
    width?: React.CSSProperties['width'];
};

type TTradersHubBannerImageListProps = keyof typeof TradersHubBannerImageList;

const TradersHubBannerImageList = {
    migrate_desktop: MigrateDesktopImage,
    migrate_mobile: MigrateMobileImage,
};

const TradersHubBannerImage = ({ class_name, width }: TBannerImageProps<TTradersHubBannerImageListProps>) => {
    const Component = MigrateCard;

    return <Component className={class_name} style={{ width }} data-testid='dt_migrate_card' />;
};

export default TradersHubBannerImage;
