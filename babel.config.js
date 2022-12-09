module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: 'react-native-dotenv',
      },
    ],
    'react-native-reanimated/plugin',
    // "transform-inline-environment-variables"
    // ["module:react-native-dotenv", {
    //   "envName": "APP_ENV",
    //   "moduleName": "@env",
    //   "path": ".env",
    //   "safe": false,
    //   "allowUndefined": true,
    //   "verbose": false
    // }]
  ],
};
