import app from './src'

const port = (process.argv[2] || process.env.HOLLY_QUINTET_PORT || process.env.npm_package_config_port || 1025)
app.listen(port)
