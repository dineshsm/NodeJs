var jsforce = require('jsforce');

// Salesforce OAuth2 client information
var conn = new jsforce.Connection({
  oauth2 : {
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : 'https://login.salesforce.com',
    clientId: process.env.Consumer_Key,
    clientSecret:  process.env.Consumer_Secret,
    redirectUri: process.env.Callback_URL,
  }
});

  
//all the routes for our application
module.exports = function(app,db,pgp) {
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });
         
  	app.get('/api/student/:sId', function(req, res) {
			var studId = req.params.sId;    
	    	console.log("orderId : " + studId);
			  
			conn.login(process.env.SF_Username, process.env.SF_PWD, function(err, userInfo) {
				  
				  // Now you can get the access token and instance URL information.
				var records = [];
				conn.query("SELECT DateTaken__c,ExamResult__c,MinutesTaken__c,Id,Name FROM Student__c WHERE Id='"+studId+"' LIMIT 1", function(err, result) {
				if (err) { return res.status(500).json({ success: false,error : err}); }
					console.log("total : " + result.totalSize);
					console.log("fetched : " , result.records);
					console.log("done ? : "+ result.done);
					records = result.records[0];    
					if (!result.done) {
					// you can use the locator to fetch next records set.
					// Connection#queryMore()  
					console.log("next records URL : " + records);
					}
     				
     				 // Single record creation
					conn.sobject("Student__c").create({
						DateTaken__c: 'sfnewcheckst_d',
						ExamResult__c: 'Pending - New Hire',
						MinutesTaken__c: '012F00000lvIAC'
						}, function(err, ret) {
						  if (err || !ret.success) { return console.error(err, ret); }
						     console.log("Created record id : " + ret.id);
						   // ...
						 });    

					res.render('index.ejs');      

     				/*
					var stud = new Student__c();
				    stud.DateTaken__c= '2';
				    stud.ExamResult__c = '2';
				    stud.MinutesTaken__c = '3';
				    stud.Name =  'vicky';
					conn.login(process.env.SF_Username, process.env.SF_PWD, function(err, userInfo) {
					  if (err) { return res.status(500).json({ success: false,err:err}); }
					  // Now you can get the access token and instance URL information.
					  // Save them to establish connection next time.
					  console.log(conn.accessToken);
					  console.log(conn.instanceUrl);
					 
					  // Single record creation   
					  console.log("stud Dtls Id+"+stud);
					    
						conn.sobject("Student__c").create(stud, function(err, ret) {
						if (err || !ret.success) { return res.status(500).json({ success: false,err:err,ret:ret}); }
							console.log("Created record id : " + ret.id);
						});
					});*/


				});
			});
		
	}); 
   
	app.post('/api/studentpost', function(req, res) {
	  
		conn.login(process.env.SF_Username, process.env.SF_PWD, function(err, userInfo) {
		         
		    // Single record creation
			conn.sobject("Student__c").create({
				DateTaken__c: 'sfnewcheckst_d',
				ExamResult__c: 'Pending - New Hire',
				MinutesTaken__c: '012F00000lvIAC'
				}, function(err, ret) {
				  if (err || !ret.success) { return console.error(err, ret); }
				     console.log("Created record id : " + ret.id);
				   // ...
				 });

		});
	});


   	app.get('/api/studentid/:sId', function(req, res) {
		      
        var sId = req.params.sId;   
        console.log('sId+'+sId);      
                  //WHERE s_id ="+sId+"::int"
		db.query("SELECT * FROM student where s_id="+sId+"", true)
	    .then(function (data) {
			console.log('data+'+data);
			var studentDtls = data;
			     
			conn.login(process.env.SF_Username, process.env.SF_PWD, function(err) {
			  if (err) { return res.status(500).json({ success: false,err:err}); }
			  // Now you can get the access token and instance URL information.
			  // Save them to establish connection next time.
			  console.log(conn.accessToken);
			  console.log(conn.instanceUrl);
			
			  // Single record creation
			  console.log("Order Id",studentDtls[0]); 

			  	conn.sobject("Student__c").upsert({ 
					Name : studentDtls[0].name,     
					DateTaken__c: studentDtls[0].datetaken,
					ExamResult__c: studentDtls[0].examresult,
					MinutesTaken__c: studentDtls[0].minutestaken,
					Student_Id__c: sId
				}, 'Student_Id__c', function(err, ret) {
				  if (err || !ret.success) { return console.error(err, ret); }
				  console.log('Upserted Successfully');
				  // ... 
				});   
			         

			    /*
				// Single record creation
				conn.sobject("Student__c").create({         
					Name : studentDtls[0].name,     
					DateTaken__c: studentDtls[0].datetaken,
					ExamResult__c: studentDtls[0].examresult,
					MinutesTaken__c: studentDtls[0].minutestaken
					}, function(err, ret) {
					  if (err || !ret.success) { return console.error(err, ret); }
					     console.log("Created record id : " + ret.id);
					   // ...
					 });  */  

				res.render('index.ejs');     
			});

	        return res.json(data);
	    })
	    .catch(function (err) {
	        console.log("ERROR:", err); // print the error;
	        return res.status(500).json({ success: false,error : err});
	    })
	    .finally(function (){
	        // If we do not close the connection pool when exiting the application,
	        // it may take 30 seconds (poolIdleTimeout) before the process terminates,
	        // waiting for the connection to expire in the pool.
	
	        // But if you normally just kill the process, then it doesn't matter.
	        pgp.end(); // for immediate app exit, closing the connection pool.
	        // See also:
	        // https://github.com/vitaly-t/pg-promise#library-de-initialization
	    });
  	});
   
};
