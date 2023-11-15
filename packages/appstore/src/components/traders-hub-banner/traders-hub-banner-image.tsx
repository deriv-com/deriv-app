import React from 'react';
import MigrateDesktopImage from 'Assets/svgs/banner/migrate-desktop.svg';
import MigrateMobileImage from 'Assets/svgs/banner/migrate-mobile.svg';

export type TBannerImageProps<TTradersHubBannerImageListProps> = {
    image: TTradersHubBannerImageListProps;
    class_name?: string;
    width?: React.CSSProperties['width'];
};

type TTradersHubBannerImageListProps = keyof typeof TradersHubBannerImageList;

const TradersHubBannerImageList = {
    migrate_desktop: MigrateDesktopImage,
    migrate_mobile: MigrateMobileImage,
};

const TradersHubBannerImage = ({ image, class_name, width }: TBannerImageProps<TTradersHubBannerImageListProps>) => {
    const Component = TradersHubBannerImageList[image];
    const data_testid = `dt_${image}`;

    return <Component className={class_name} style={{ width }} data-testid={data_testid} />;
};

export default TradersHubBannerImage;
