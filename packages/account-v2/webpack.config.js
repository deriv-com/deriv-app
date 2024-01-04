import path from 'path';
import { buildWebpackConfig } from './build/build-webpack-config';
import { Configuration } from 'webpack';

const isRelease =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';

export default env => {
    const base = env?.base && env.base !== true ? `/${env.base}/` : '/';

    const paths = {
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        output: path.resolve(__dirname, 'dist'),
        root: path.resolve(__dirname),
    };

    const buildOptions = { base, isRelease, paths };

    const config = buildWebpackConfig(buildOptions);

    return config;
};
