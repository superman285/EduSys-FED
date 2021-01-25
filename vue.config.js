
module.exports = {
	css: {
		loaderOptions: {
			scss: {
				prependData: `@import "~@/styles/variables.scss";`
			}
		}
	},
	devServer: {
		proxy: {
			// /front的请求会被转发到 edufront.lagou.com
			'/front': {
				target: 'http://edufront.lagou.com',
				changeOrigin: true // 设置请求头中的 host 为 target，防⽌后端反向代理服务器⽆法识别 不配的话为真实地址 e.g. localhost:8080
			},
			'/boss': {
				target: 'http://eduboss.lagou.com',
				changeOrigin: true
			}
		}
	}
}
