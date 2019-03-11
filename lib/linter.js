// Dependencies
var chalk = require('chalk');
var sassLint = require('sass-lint');
var path = require('path');

/**
 * Linter
 *
 * @param {String} sasslint file globbing pattern
 * @param {Object} config scsslint configuration
 * @return {Array} file report containing error/warning files
 */
function lint(input, options) {
  // Run sassLint via lintFiles, which takes a glob
  var report = sassLint.lintFiles(input, {}, options.configFile);
  var fileReport = [];

  if (report.length) {
    report.forEach(function(file) {
      // Skip report if file is ignored
      if (options.ignoreFiles &&
        -1 !== options.ignoreFiles.indexOf(file.filePath)
      ) {
        return;
      }

      if (file.warningCount && options.quiet) {
        file.warningCount = 0;
      }

      // Push seperate error counts and warning counts w/ filenames return
      if (file.errorCount) {
        fileReport.push({
          'error': true,
          'file': file,
        });
      }

      if (file.warningCount) {
        fileReport.push({
          'error': false,
          'file': file,
        });
      }

      // Allow dying on sasslint error of set
      if (options.failOnError && file.errorCount) {
        throw new Error('Failed because of a sasslint error.\n');
      } else if (options.failOnWarning && file.warningCount) {
        throw new Error('Failed because of a sasslint warning.\n');
      }
    });
  }

  return fileReport;
}

module.exports = lint;