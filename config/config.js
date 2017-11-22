var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'z-love'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/zlovedb'
  },

  test: {
    root: rootPath,
    app: {
      name: 'z-love'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/zlovedb'
  },

  production: {
    root: rootPath,
    app: {
      name: 'z-love'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/zlovedb'
  }
};

module.exports = config[env];
