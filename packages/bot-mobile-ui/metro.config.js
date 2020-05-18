const path = require('path');
const { applyConfigForLinkedDependencies } = require('@carimus/metro-symlinked-deps');

const projectRoot = __dirname;
const symlinked_dependencies_config = { projectRoot };
const metro_config = {
  projectRoot,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          return path.join(__dirname, `node_modules/${name}`);
        },
      },
    ),
  },
  watchFolders: [path.resolve(__dirname, '../')],
};

module.exports = applyConfigForLinkedDependencies(metro_config, symlinked_dependencies_config);