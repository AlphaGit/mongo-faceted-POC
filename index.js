function facetedSearch(ImageModel, filters, callback) {
  var search = ImageModel.find();
  if (filters.tags)
    search = search.find({ tags: filters.tags });

  if (filters.height)
    search = search.find({ height: filters.height });

  if (filters.width)
    search = search.find({ width: filters.width });

  if (filters.name)
    search = search.find({ name: new Regex(filters.name) });

  search.exec(callback);
};

/******************************************************************************/

var async = require('async');
var databaseConnection = require('./databaseConnection');
databaseConnection.initDbConnection(function(mongoose) {
  var ImageModel = require('./ImageModel')(mongoose);

  ImageModel.count({}, function(error, count) {
    console.log('Total results:', count);
  });

  var showResults = function(filter, showResults, cb) {
    facetedSearch(ImageModel, filter, function(err, results) {
      if (err) return cb(err);

      console.log('Searching by', filter, results.length, 'results.');
      if (showResults) { console.log(results); }
      cb(null);
    });
  }


  async.waterfall([
      function (cb) {
        showResults({ height: 100 }, false, cb);
      },
      function (cb) {
        showResults({ width: 1920 }, false, cb);
      },
      function (cb) {
        // { tags: ['e1', 'e2'] } matches whole array for exact contents
        showResults({ tags: ['person'] }, true, cb);
      }
    ], function(err) {
      if (err) console.error('Error searching: ', err);
      process.exit(0);
    });
}); // initDbConnection()