 
var pgp = require('./pgpromise.js');
// See also: https://github.com/vitaly-t/pg-promise#initialization-options
  
// Database connection details;
var cn = {  
    host: 'ec2-50-19-113-219.compute-1.amazonaws.com', // 'localhost' is the default;
    port: 5432, // 5432 is the default;
    database: 'dcic8a0u1d8tp9',
    user: 'ayribfpezkowhx',
    password: '4d497d43dfdfc772324980812ace07c51d1979af9405e1fb3e5fe30f6f988e13'
};        
// You can check for all default values in:
// https://github.com/brianc/node-postgres/blob/master/lib/defaults.js
var db = pgp(cn); // database instance;
module.exports = db;   
