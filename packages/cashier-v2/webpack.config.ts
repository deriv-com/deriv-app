import path from 'path';
import { Configuration } from 'webpack';
import { buildWebpackConfig } from './build/build-webpack-config';
import { TBuildEnv, TBuildPaths } from './build/types/build-types';

const isRelease =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';

export default (env: TBuildEnv) => {
    const base = env?.base && env.base !== true ? `/${env.base}/` : '/';

    const paths: TBuildPaths = {
        entry: path.resolve(__dirname, './src', 'index.tsx'),
        output: path.resolve(__dirname, 'dist'),
        root: path.resolve(__dirname),
    };

    const buildOptions = { base, isRelease, paths };

    const config: Configuration = buildWebpackConfig(buildOptions);

    return config;
};
