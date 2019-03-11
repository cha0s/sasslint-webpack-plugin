// Modules
const formatter = require('./lib/formatter');
const linter = require('./lib/linter');

class SassLintWebpackPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    const options = this.options;
    compiler.hooks.emit.tapAsync('sasslint', (compilation, callback) => {
      // Linter returns a simple report of FilePath + Warning or Errors
      const contexts = options.context || [
        compiler.context,
      ];
      let reports = [];
      contexts.forEach(function(context) {
        reports = reports.concat(linter(context + '/' + options.glob, options));
      });
      // Errors/Warnings are pushed to the compilation's error handling
      // so we can drop out of the processing tree on warn/error
      reports.forEach(({error, file}) => {
        const message = formatter(file.messages, file.filePath);
        compilation[error ? 'errors' : 'warnings'].push(new Error(message));
      });
      callback();
    });
  }
}

module.exports = SassLintWebpackPlugin;
