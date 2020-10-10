module.exports = {
	runtimeCompiler: true,
	publicPath: './',
	devServer: {
		proxy: {
			'/api': {
				target: 'https://hktjs.hktvip.cn',
				changeOrigin: true,
				pathRewrite: {
          '^/api': ''
        }
			}
		}
	}
}