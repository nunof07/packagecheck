var exec = require('sync-exec');
var EOL = require('os').EOL;

Version = {}

Version.latest = {}

// Get the latest version of a given package

Version.getLatest = function(packageName) {

  // Check to see if we've cached this result

  if (Version.latest[packageName]) {
    return Version.latest[packageName];
  }

  // Rather than reimplement Meteor's entire package database mechanism in order
  // to get the latest versions, we simply call out to Meteor's command line.

  var result = exec('meteor show ' + packageName);

  if (result.status != 0) {
    throw(result.stderr);
  }
  else {
    var lines = result.stdout.split(EOL);
    var idx = 0;
    var latest = null;

    // Find the list of recent versions
    while (idx < lines.length && lines[idx++] !== 'Recent versions:') ;

    // Get the last line in this list
    while (idx < lines.length && lines[idx] !== '') {
      latest = lines[idx];
      idx++;
    }

    // If we have a line, get the version and test
    if (latest !== null) {
      latestVersion = latest.split(' ').filter(function(item) { return item != ''; })[0];
      Version.latest[packageName] = latestVersion;
      return latestVersion;
    }
  }
}

module.exports = Version;
