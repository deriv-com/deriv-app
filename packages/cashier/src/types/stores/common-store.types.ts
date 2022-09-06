export type TCommonStore = {
    is_from_derivgo: boolean;
    platform: string;
    routeTo: (pathname: string) => void;
};
