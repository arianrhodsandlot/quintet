import app from './index'

const port = parseInt(process.argv[2] || process.env.HOLLY_QUINTET_PORT || process.env.npm_package_config_port || '1025', 10)
app.listen(port)
