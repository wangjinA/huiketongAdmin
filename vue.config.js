module.exports = {
	runtimeCompiler: true,
	publicPath: './',
	devServer: {
		proxy: {
			'/api': {
				target: 'http://120.27.240.67:8888',
				changeOrigin: true,
				pathRewrite: {
          '^/api': ''
        }
			}
		}
	}
}