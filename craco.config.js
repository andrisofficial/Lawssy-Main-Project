module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find the source-map-loader rule
      const sourceMapRule = webpackConfig.module.rules
        .find(rule => rule.enforce === 'pre' && rule.use && rule.use.some(u => u.loader && u.loader.includes('source-map-loader')));
      
      if (sourceMapRule) {
        // Add exclude pattern for node_modules
        sourceMapRule.exclude = /node_modules/;
      }

      return webpackConfig;
    }
  }
}; 