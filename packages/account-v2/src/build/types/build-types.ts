export interface BuildPaths {
    entry: string;
    output: string;
    root: string;
}

export interface BuildEnv {
    base?: boolean | string;
}

export interface BuildOptions {
    base: string;
    isRelease: boolean;
    paths: BuildPaths;
}
