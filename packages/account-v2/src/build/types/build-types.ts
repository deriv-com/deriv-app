export interface TBuildPaths {
    entry: string;
    output: string;
    root: string;
}

export interface TBuildEnv {
    base?: boolean | string;
}

export interface TBuildOptions {
    base: string;
    isRelease: boolean;
    paths: TBuildPaths;
}
