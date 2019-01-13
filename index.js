var express = require('express');
var app = express();
var jwt = require('jsonwebtoken'); // Import JWT Package
var secret = 'harrypotter'; // Create custom secret for use in JWT
var bodyParser = require("body-parser");
app.use(bodyParser.json());
var bcrypt = require("bcrypt-nodejs");
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var sequelize = new Sequelize('db_shop', 'root', '', {
    dialect: 'mysql',
    define :{
      timestamps: false
    }
});

const nodemailer = require("nodemailer"); //mailer
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'x.hell.boys.x@gmail.com',
    pass: 'zblaclcezujwwatn'
  }
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


/*********************** Entities *************************** */
  var User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
      },
    name:Sequelize.STRING,
    surname:Sequelize.STRING,
    username: Sequelize.STRING,
    password:Sequelize.STRING,
    email:Sequelize.STRING,
    phone:Sequelize.STRING,
    adress:Sequelize.STRING,
    gender:Sequelize.STRING,
    
  });
   
  var Ad = sequelize.define('ad', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
      },
    id_user:Sequelize.INTEGER,
    id_house:Sequelize.INTEGER,
    transaction:Sequelize.STRING,
    date: Sequelize.DATE,
    price:Sequelize.FLOAT,
  });

  var Contract = sequelize.define('contract', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
      },
    title:Sequelize.STRING,
    id_seller:Sequelize.INTEGER,
    id_buyer:Sequelize.INTEGER,
    id_ad:Sequelize.INTEGER,
    date: Sequelize.DATE,
  });

  var Favorite = sequelize.define('favorite', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
      },
    id_user:Sequelize.INTEGER,
    id_ad:Sequelize.INTEGER,
  });

  var House = sequelize.define('house', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
      },
      id_user:Sequelize.INTEGER,
      city:Sequelize.STRING,
      adress:Sequelize.STRING,
      lat:Sequelize.STRING,
      lng: Sequelize.STRING,
      surface:Sequelize.FLOAT,
      description:Sequelize.STRING,
      nbr_room:Sequelize.INTEGER,
      category:Sequelize.STRING
  });

  



  /****************** SIGN IN **********************/
  app.get('/signin', function (req, res) {  
    User.findOne({where: { email: req.query.email }}).then( function (user) {
      if (user) {
        bcrypt.compare(req.query.password , user.password , function (err , result) {
          if (result == true) {
            //// getting the token to access the server
            var token = jwt.sign({ username: user.username, password: user.password }, secret, { expiresIn: '24h' }); // Logged in: Give user token
            res.json({
              id: user.id,
              name:user.name,
              surname:user.surname,
              username: user.username,
              email:user.email,
              phone:user.phone,
              adress:user.adress,
              gender:user.gender,
              token:token
            });
          } else {
            res.send("incorrect password");
          }
        })
      } else {
        res.send("incorrect email");
      }
    });
      
  });

  /****************** ADD USER **********************/
  app.post('/adduser',function(req , res){
    var u = req.body;
    u.password = bcrypt.hashSync(u.password);
    User.create(u).then(user => res.json(user));

  });


  /****************** SEND VALIDATION CODE **********************/
  app.post('/sendemail',function(req , res){

    let reciever = req.body.email;
    User.findOne({where: { email: req.body.email }}).then( function (user) {
      if (user) {
        var number = Math.floor(100000 + Math.random() * 900000);
        try {
    
          // setup email data with unicode symbols
          let mailOptions = {
            from: '"eShop 👻" <x.hell.boys.x@gmail.com>', // sender address
            to: reciever, // list of receivers
            subject: "Validation code ✔", // Subject line
            text: "Your Validation Code is "+number, // plain text body
            html: "<b>Your Validation Code is "+number+"</b>" // html body
          };
    
          // send mail with defined transport object
          let info =  transporter.sendMail(mailOptions);
    
          sequelize.query("insert into validations (id_user,code) values ("+user.id+","+number+") ON DUPLICATE KEY UPDATE code = '"+number+"'")
                    .then( res.send("sent"));
         
        } catch (err){
          console.log(err);
          res.status(500).send();
        }
      } else {
        res.send("incorrect email");
      }
    });
  });

  /****************** VALIDATE CODE **********************/
  app.post('/validatecode',function(req , res){
    sequelize.query("select count(*) as found from validations where code = "+req.body.code+" and id_user in (select id from users where email = '"+req.body.email+"')",
              { type: sequelize.QueryTypes.SELECT}).then(r => res.send(r[0]));
  });


  /****************** RESET PASSWORD **********************/
  app.put('/resetpassword',function(req , res){
    
    User.update({password:bcrypt.hashSync(req.body.new_password)} , {where : {email : req.body.email}})
          .then( r => res.json(r[0]));
     
  });


  // Middleware for Routes that checks for token - Place all routes after this route that require the user to already be logged in
  app.use(function(req, res, next) {
    var token = req.body.token || req.body.query ||  req.headers['authorization']; // Check for token in body, URL, or headers
   
    // Check if token is valid and not expired  
    if (token) {
        if (token.startsWith('Bearer ')) {
          // Remove Bearer from string
          token = token.slice(7, token.length);
        } 
        // Function to verify token
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                res.json({ success: false, message: 'Token invalid' }); // Token has expired or is invalid
            } else {
                req.decoded = decoded; // Assign to req. variable to be able to use it in next() route ('/me' route)
                next(); // Required to leave middleware
            }
        });
    } else {
        res.json({ success: false, message: 'No token provided' }); // Return error if no token was provided in the request
    }
  });


  
/************************************* USERS ***************************************** */
  /****************** GET USERS **********************/
  app.get('/users', function (req, res) {

    User.findAll().then( users =>  res.json(users));
      
  });

  

  /****************** UPDATE USER **********************/
  app.put('/updateuser',function(req , res){

    User.update(req.body , {where : {id : req.body.id}}).then( u =>
      res.json(u));
    
   });

  /****************** DELETE USER **********************/
  app.delete('/deleteuser/:userid',function(req , res){

    User.destroy({ where : {id : req.params.userid}}).then( u =>
      res.json(u));
    
  });

  
  


/************************************* HOUSES ***************************************** */
  /****************** GET ALL/MY HOUSES **********************/
  app.get('/houses/:userid?', function (req, res) {

    let query;
    if(req.params.userid) {
        query = House.findAll({
           where: { id_user: req.params.userid } });
    } else {
        query = House.findAll();
    }
    return query.then(r => res.json(r));
   
  });

  /****************** GET ONE HOUSE **********************/
  app.get('/house/:houseid', function (req, res) {

    
    House.findById(req.params.houseid).then(r => res.json(r));
      
  });

  /****************** ADD HOUSE **********************/
  app.post('/addhouse',function(req , res){
    
    House.create(req.body).then(r => res.json(r));

  });

  /****************** DELETE HOUSE **********************/
  app.delete('/deletehouse/:houseid',function(req , res){

    House.destroy({ where : {id : req.params.houseid}}).then( r =>
      res.json(r));
    
  });


  /****************** UPDATE HOUSE **********************/
  app.put('/updatehouse',function(req , res){

    House.update(req.body , {where : {id : req.body.id}}).then( r =>
      res.json(r));
    
  });



/************************************* ADS ***************************************** */
  /****************** GET ALL/MY ADS **********************/
  app.get('/ads/:userid?', function (req, res) {

    let query;
    if(req.params.userid) {
        query = "select ad.id as id_ad , ad.title,ad.transaction, ad.date , ad. price , h.id as id_house, h.city ,h.adress , h.lat , h.lng , h.surface , h.description , h.nbr_room ,h.category from ads as ad inner join houses as h where h.id = ad.id_house and ad.id_user ="+ req.params.userid;
    } else {
        query = "select ad.id   as id_ad,  ad.title,ad.transaction, ad.date , ad. price , h.id as id_house,h.city , h.adress , h.lat , h.lng , h.surface , h.description , h.nbr_room ,h.category from ads as ad join houses as h where h.id = ad.id_house";
    }
    return sequelize.query(query,{ type: sequelize.QueryTypes.SELECT}).then(r => res.json(r));
      
  });

  /****************** GET ONE AD **********************/
  app.get('/ad/:adid', function (req, res) {
   
    sequelize.query("select ad.id   as id_ad,  ad.title,ad.transaction,ad.date , ad. price , h.id as id_house,h.city , h.adress , h.lat , h.lng , h.surface , h.description , h.nbr_room ,h.category from ads  ad join houses  h on h.id = ad.id_house where ad.id ="+req.params.adid,
                { type: sequelize.QueryTypes.SELECT}).then(r => res.json(r));      

  });

  /****************** ADD AD **********************/
  app.post('/addad',function(req , res){
    
    Ad.create({  
      id_user: req.body.id_user,
      id_house: req.body.id_house,
      price: req.body.price
    
    }).then(ad => res.json(ad));

  });

  /****************** DELETE AD **********************/
  app.delete('/deletead/:adid',function(req , res){

    Ad.destroy({ where : {id : req.params.adid}}).then( u =>
      res.json(u));
    
  });

  /****************** UPDATE AD **********************/
  app.put('/updatead',function(req , res){

    Ad.update(req.body , {where : {id : req.body.id}}).then( u =>
      res.json(u));
    
  });

  /****************** GET ADS DESC/ASC PRICE **********************/
  app.get('/adsbyprice/:order', function (req, res) {
   
    sequelize.query("select ad.id   as id_ad, ad.title,ad.transaction, ad.date , ad. price , h.id as id_house,h.city , h.adress , h.lat , h.lng , h.surface , h.description , h.nbr_room ,h.category from ads  ad join houses  h on h.id = ad.id_house ORDER BY ad.price "+req.params.order,
                { type: sequelize.QueryTypes.SELECT}).then(r => res.json(r));      

  });


  /****************** GET ADS DESC/ASC DATE **********************/
  app.get('/adsbydate/:order', function (req, res) {
   
    sequelize.query("select ad.id   as id_ad,ad.title, ad.transaction,ad.date , ad. price , h.id as id_house,h.city , h.adress , h.lat , h.lng , h.surface , h.description , h.nbr_room ,h.category from ads  ad join houses  h on h.id = ad.id_house ORDER BY ad.date "+req.params.order,
                { type: sequelize.QueryTypes.SELECT}).then(r => res.json(r));      

  });


  /****************** GET ADS BY TITLE **********************/
  app.get('/adsbytitle', function (req, res) {
   
    sequelize.query("select ad.id   as id_ad, ad.title, ad.transaction, ad.date , ad. price , h.id as id_house,h.city , h.adress , h.lat , h.lng , h.surface , h.description , h.nbr_room ,h.category from ads  ad join houses  h on h.id = ad.id_house where  ad.title like '%"+req.body.title+"%'",
                { type: sequelize.QueryTypes.SELECT}).then(r => res.json(r));      

  });


  /****************** GET ADS BY CATEGORY **********************/
  app.get('/adsbycategory', function (req, res) {
   
    sequelize.query("select ad.id   as id_ad, ad.title, ad.transaction, ad.date , ad. price , h.id as id_house,h.city , h.adress , h.lat , h.lng , h.surface , h.description , h.nbr_room ,h.category from ads  ad join houses  h on h.id = ad.id_house where h.category = '"+req.body.category.toLowerCase()+"'",
                { type: sequelize.QueryTypes.SELECT}).then(r => res.json(r));      

  });



  /****************** GET ADS BY TRANSACTION **********************/
  app.get('/adsbytransaction', function (req, res) {
   
    sequelize.query("select ad.id   as id_ad, ad.title, ad.transaction, ad.date , ad. price , h.id as id_house,h.city , h.adress , h.lat , h.lng , h.surface , h.description , h.nbr_room ,h.category from ads  ad join houses  h on h.id = ad.id_house where ad.transaction = '"+req.body.transaction.toLowerCase()+"'",
                { type: sequelize.QueryTypes.SELECT}).then(r => res.json(r));      

  });


  
/************************************* Favorites ***************************************** */
  /****************** GET FAVORITES **********************/
  app.get('/favorites/:userid', function (req, res) {
   
    sequelize.
    query("select ad.id as id_ad ,  ad.title,ad.transaction, ad.date , ad. price , h.id as id_house,h.city , h.adress , h.lat , h.lng , h.surface , h.description , h.nbr_room ,h.category from ads as ad inner join houses as h where h.id = ad.id_house and ad.id in (select id_ad from favorites where id_user = "+ req.params.userid+")",
             { type: sequelize.QueryTypes.SELECT}).then( r => res.json(r));
      
  });

  /****************** GET ONE FAVORITE **********************/
  app.get('/favorite/:favoriteid', function (req, res) {
  
    sequelize.
    query("select ad.id as id_ad , ad.title,ad.transaction, ad.date , ad. price , h.id as id_house,h.city , h.adress , h.lat , h.lng , h.surface , h.description , h.nbr_room ,h.category from ads as ad inner join houses as h where h.id = ad.id_house and ad.id in (select id_ad from favorites where id = "+ req.params.favoriteid+")",
             { type: sequelize.QueryTypes.SELECT}).then( r => res.json(r));
      
  });

  /****************** ADD FAVORITE **********************/
  app.post('/addfavorite',function(req , res){
    
    Favorite.create(req.body).then(r => res.json(r));

  });

  /****************** DELETE FAVORITE **********************/
  app.delete('/deletefavorite/:favoriteid',function(req , res){

    Favorite.destroy({ where : {id : req.params.favoriteid}}).then( r =>
      res.json(r));
    
  });

  /****************** UPDATE FAVORITE **********************/
  app.put('/updatefavorite',function(req , res){

    Favorite.update(req.body , {where : {id : req.body.id}}).then( r =>
      res.json(r));
    
  });


/************************************* CONTRACTS ***************************************** */
  /****************** GET CONTRACTS **********************/
  app.get('/contracts', function (req, res) {
   
    sequelize.
    query("select c.id as id_contract , s.id as seller , s.name as seller_name , s.surname as seller_surname , s.email as seller_email , s.phone as seller_phone, s.adress as seller_adress , s.gender as seller_gender , b.id as buyer , b.name as buyer_name , b.surname as buyer_surname , b.email as buyer_email , b.phone as buyer_phone, b.adress as buyer_adress , b.gender as buyer_gender , ad.id as id_ad , ad.title, ad.transaction, ad.date as date_ad , ad. price , h.id as id_house,h.title,h.city , h.adress , h.lat , h.lng , h.surface , h.description , h.nbr_room ,h.category ,c.date as contract_date from contracts  c inner join users s on c.id_seller = s.id inner join users b on c.id_buyer = b.id inner join ads ad on ad.id = c.id_ad inner join houses h on ad.id_house = h.id",
             { type: sequelize.QueryTypes.SELECT}).then( r => res.json(r));
      
  });

  /****************** GET ONE CONTRACT **********************/
  app.get('/contract/:contractid', function (req, res) {
  
    sequelize.
    query("select c.id as id_contract , s.id as seller , s.name as seller_name , s.surname as seller_surname , s.email as seller_email , s.phone as seller_phone, s.adress as seller_adress , s.gender as seller_gender , b.id as buyer , b.name as buyer_name , b.surname as buyer_surname , b.email as buyer_email , b.phone as buyer_phone, b.adress as buyer_adress , b.gender as buyer_gender , ad.id as id_ad ,ad.title, ad.transaction, ad.date as date_ad , ad. price , h.id as id_house,h.title,h.city , h.adress , h.lat , h.lng , h.surface , h.description , h.nbr_room ,h.category,c.date as contract_date from contracts  c inner join users s on c.id_seller = s.id inner join users b on c.id_buyer = b.id inner join ads ad on ad.id = c.id_ad inner join houses h on ad.id_house = h.id where c.id = "+req.params.contractid,
             { type: sequelize.QueryTypes.SELECT}).then( r => res.json(r));
      
  });

  /****************** ADD CONTRACT **********************/
  app.post('/addcontract',function(req , res){
    
    Contract.create(req.body).then(r => res.json(r));

  });

  /****************** DELETE CONTRACT **********************/
  app.delete('/deletecontract/:contractid',function(req , res){

    Contract.destroy({ where : {id : req.params.contractid}}).then( r =>
      res.json(r));
    
  });

  /****************** UPDATE CONTRACT **********************/
  app.put('/updatecontract',function(req , res){

    Contract.update(req.body , {where : {id : req.body.id}}).then( r =>
      res.json(r));
    
  });



  app.listen(3000);
