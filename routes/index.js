const express = require('express');
const router = express.Router();
const jwtDecode = require('jwt-decode');
const crypto = require("crypto");


router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.get('/login', function(req, res, next) {
  req.session.idp = req.query.idp;
  req.session.state = crypto.randomBytes(10).toString('hex');
  const client = req.clients.getClient(req.session.idp);
  const redirect_uri = client.getAuthorizationUrl(req.session.state);
  console.log(redirect_uri);
  res.redirect(redirect_uri);  

});

router.get('/assertion_consumer', async function(req, res, next) {
  console.log(req.query)
  try {
    console.log(req.session.idp);
    const client = req.clients.getClient(req.session.idp);
    console.log(client);
    const query = {
      code: req.query.code,
      state: req.session.state,
    }
    let assertion = await client.getToken(req.query, req.session.state);
    console.log('expires', new Date(assertion.expires_at*1000));
    console.log('raw assertion', assertion);
    res.redirect('/assertion_decode?assertion='+JSON.stringify(assertion));
  }catch(err){
    console.log(err);
    res.send(err.toString());
  }
});

router.get('/assertion_decode', (req, res, next) => {
  const obj = JSON.parse(req.query.assertion);
  const id_token = jwtDecode(obj.id_token);
  res.render('user', { assertion:obj, id_token:id_token }); 
});


module.exports = router;
