module.exports = config => {
	config.optimization.minimizer.filter(({ constructor: { name } }) => name === 'TerserPlugin')
		.forEach(terser => {
			terser.options.terserOptions.keep_classnames = true;
		});

	return config;
};