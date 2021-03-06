'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _processResources = require('./utils/processResources');

var _processResources2 = _interopRequireDefault(_processResources);

var _parseResources = require('./utils/parseResources');

var _parseResources2 = _interopRequireDefault(_parseResources);

var _logger = require('./utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (source) {
  var webpack = this;

  if (webpack.cacheable) webpack.cacheable();

  var callback = webpack.async();

  global.__DEBUG__ = process.env.DEBUG === 'sass-resources-loader' || process.env.DEBUG === '*';

  _logger2.default.debug('Hey, we\'re in DEBUG mode! Yabba dabba doo!');

  // TODO: Remove `webpack.options.sassResources` support after first stable webpack@2 release
  var resourcesFromConfig = webpack.version !== 2 ? webpack.options.sassResources : _loaderUtils2.default.parseQuery(this.query).resources;

  if (!resourcesFromConfig) {
    resourcesFromConfig = webpack.options.sassResources;
  }
  var resourcesLocations = (0, _parseResources2.default)(resourcesFromConfig);
  var moduleContext = webpack.context;
  var webpackConfigContext = webpack.options.context || process.cwd();

  if (!webpack.options || !webpack.options.context) {
    _logger2.default.log('`options.context` is missing. Using current working directory as a root instead:', process.cwd());
  }

  _logger2.default.debug('Module context:', moduleContext);
  _logger2.default.debug('Webpack config context:', webpackConfigContext);
  _logger2.default.debug('Resources:', resourcesLocations);

  if (!resourcesLocations.length) {
    var error = new Error('\n      Something wrong with provided resources.\n      Make sure \'options.resources\' is String or Array of Strings.\n    ');

    return callback(error);
  }

  var files = resourcesLocations.map(function (resource) {
    var file = _path2.default.resolve(webpackConfigContext, resource);
    webpack.addDependency(file);
    return file;
  });

  _async2.default.map(files, function (file, cb) {
    return _fs2.default.readFile(file, 'utf8', cb);
  }, function (error, resources) {
    (0, _processResources2.default)(error, resources, source, moduleContext, callback);
  });
}; /* eslint func-names: 0 */