import React from 'react';
import SVGMigrateDesktopImage from 'Assets/svgs/banner/svg-migrate-desktop.svg';
import SVGMigrateDesktopImageDark from 'Assets/svgs/banner/svg-migrate-desktop-dark.svg';
import SVGMigrateMobileImage from 'Assets/svgs/banner/svg-migrate-mobile.svg';
import SVGMigrateMobileImageDark from 'Assets/svgs/banner/svg-migrate-mobile-dark.svg';

export type BannerImageProps<T> = {
    image: T;
    className?: string;
    width?: number;
};

type TAppstoreBannerImageList = keyof typeof AppstoreBannerImageList;

const AppstoreBannerImageList = {
    svg_migrate_desktop: SVGMigrateDesktopImage,
    svg_migrate_mobile: SVGMigrateMobileImage,
    svg_migrate_desktop_dark: SVGMigrateDesktopImageDark,
    svg_migrate_mobile_dark: SVGMigrateMobileImageDark,
};

const AppstoreBannerImage = ({ image, className, width }: BannerImageProps<TAppstoreBannerImageList>) => {
    const Component = AppstoreBannerImageList[image] as React.ElementType;
    const data_testid = `dt_${image}`;

    return <Component className={className} style={{ width }} data-testid={data_testid} />;
};

export default AppstoreBannerImage;
