// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add the additional `cjs` extension to the resolver
config.resolver.sourceExts.push('cjs');

module.exports = config; 