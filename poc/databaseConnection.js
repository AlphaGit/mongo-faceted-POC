module.exports = (function () {
  var mongoose = require('mongoose');

  return {
    initDbConnection: function (cb) {
      mongoose.connect('mongodb://localhost:27017/faceted', function (err) {
        if (err) { return console.error('Error connecting to database', err); }
        console.log('Connected to database');

        cb(mongoose);
      });
    }
  };
})();
