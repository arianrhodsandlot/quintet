const packageJson = require('./package.json')

module.exports = {
  apps: [{
    name: 'holly-quintet',
    script: 'server.js',
    interpreter_args: '-r esm',
    env: {
      NODE_ENV: 'production',
      HOLLY_QUINTET_PORT: 1025
    },
    exec_mode: 'cluster',
    instances: 0
  }],

  deploy : {
    production : {
      host : process.env.HOLLY_QUINTET_HOST,
      ref  : 'origin/master',
      repo : packageJson.repository.url,
      path : process.env.HOLLY_QUINTET_HOST_DEPLOY_PATH,
      'post-deploy' : 'npm i && npx pm2 startOrGracefulReload ecosystem.config.js'
    }
  }
};
