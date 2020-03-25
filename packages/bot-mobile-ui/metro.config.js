const path = require('path');

// const extraNodeModules = {
// };
// const watchFolders = [
//   path.resolve(__dirname + '/node_modules/@deriv/bot-skeleton/')
// ];

module.exports = {
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

// const path = require('path');

// module.exports = {
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: false,
//       },
//     }),
//   },
//   resolver: {
//     extraNodeModules: new Proxy(
//       {},
//       {
//         get: (target, name) => {
//           return path.join(__dirname, `node_modules/${name}`);
//         }, 
//       },
//     ),
//   },
//   watchFolders: [
//     path.resolve(__dirname, '..'),
//     path.resolve(__dirname, '../node_modules'),
//   ],
// };