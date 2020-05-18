module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    [
      'module-resolver', 
      {
        root: ['./src'],
        alias: {
          'Stores': './src/stores',
          'Components': './src/components',
          'Services': './src/services',
        }
      }
    ]
    
  ]
};
