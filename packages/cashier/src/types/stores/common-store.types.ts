export type TCommonStore = {
    platform: string;
    is_from_derivgo: boolean;
    routeTo: (pathname: string) => void;
};
