import path from 'path';
import { BuildEnv, BuildPaths } from './src/build/types/build-types';
import { buildWebpackConfig } from './src/build/build-webpack-config';
import { Configuration } from 'webpack';

const isRelease =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';

export default (env: BuildEnv) => {
    const base = env && env.base && env.base !== true ? `/${env.base}/` : '/';

    const paths: BuildPaths = {
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        output: path.resolve(__dirname, 'dist'),
        root: path.resolve(__dirname),
    };

    const buildOptions = { base, isRelease, paths };

    const config: Configuration = buildWebpackConfig(buildOptions);

    return config;
};
