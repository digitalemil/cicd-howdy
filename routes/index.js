var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let port= process.env.PORT;
  if(process.env.PORT== undefined)
    port= 3000;
  let secret= process.env.SECRET;
  var os = require( 'os' );

  var networkInterfaces = os.networkInterfaces( );

  res.render('index', { title: 'Howdy v1.2', port: port, secret: secret, interfaces: networkInterfaces  });
});

module.exports = router;
