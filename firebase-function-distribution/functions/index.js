var functions = require('firebase-functions');

// Import Admin SDK
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

/*
เป็นส่วน call api Drupal
*/
var request = require('request');

// Get a database reference to our posts
var db = admin.database();



/*

*/
var app_name = 'iDNA';

/*
FRIEND_STATUS
*/
var FRIEND_STATUS_FRIEND 			= "10";
var FRIEND_STATUS_FRIEND_CANCEL 	= "13";
var FRIEND_STATUS_FRIEND_REQUEST 	= "11";  
var FRIEND_STATUS_WAIT_FOR_A_FRIEND = "12";  

/*
Header 
Refer : https://stackoverflow.com/questions/17121846/node-js-how-to-send-headers-with-form-data-using-request-module
*/
var bundle_identifier = 'heart.idna';
var platform          = 'firebase';

var headers = { 
    'bundle_identifier': bundle_identifier,
    'platform' : platform 
};


// Distribution
// API_URL_IDNA            = @"http://128.199.210.45";

// Development
var API_URL_IDNA 						= 'http://128.199.210.45';
var END_POINT_IDNA 						= '/api';
var PATH_ROOT_IDNA  					= 'idna';
var PATH_USER_IDNA  					= 'user'; 
var PATH_CENTER_IDNA  					= 'center'; 
var PATH_CHAT_GROUP                     = 'chat_groups';

// chat_groups
var PATH_UPDATE_PROFILE 				= '/update_profile';
var PATH_UPDATE_USER_CHAT_GROUP    	    = '/update_user_chat_group';//'/update_group_chat'; // 

var PATH_USER_FOR_FRIEND_EDITUPDATE 	= '/user_for_friend_editupdate';
var PATH_USER_FOR_FRIEND_DELETE 		= '/user_for_friend_delete';

var PATH_UPDATE_MY_APPLICATIONS 		= '/update_my_applications';
var PATH_UPDATE_MY_APPLICATIONS_FOLLOW 	= '/update_my_applications_follow';
// var PATH_DELETE_MY_APPLICATION_FOLLOW 	= '/delete_my_application_follow';

var PATH_UPDATE_CHAT_GROUP   			 = '/update_chat_group';


var PATH_UPDATE_MY_APPLICATION_POST_LIKE = '/update_my_application_post_like';
// var PATH_DELETE_MY_APPLICATION_POST_LIKE = '/delete_my_application_post_like';

// iDNA_Center_Post_Add_Comments
var PATH_CENTER_POST_UPDATE_COMMENTS     = '/center_post_update_comments';
var PATH_CENTER_POST_DELETE_COMMENTS     = '/center_post_delete_comments';
var PATH_CENTER_POST_COMMENTS_LIKE 		 = '/center_post_comments_like';


var PATH_DELETE_MY_APPLICATION           = '/delete_my_application';
var PATH_DELETE_CHAT_GROUP   			 = '/delete_chat_group';
var PATH_DELETE_MEMBER_GROUP_CHAT   	 = '/delete_member_group_chat';

var PATH_DELETE_POST_MY_APPLICATION  	 = '/delete_post';
var PATH_DELETE_COMMENT_OF_POSTS  	     = '/delete_comment_of_posts';
var PATH_DELETE_REPLYCOMMENT_OF_MYAPPLICATION = '/delete_replycomment_of_myapplication';


var PATH_DELETE_MAIL  					 = '/edit_multi_email';
var PATH_DELETE_PHONE  					 = '/edit_multi_phone';

var PATH_DELETE_CLASSS					 = "/delete_classs";

var PATH_DELETE_CENTER_CHAT			     = "/delete_center_chat";

var PATH_DELETE_FOLLOWING                = "/delete_following" ;// following

var PATH_UPATE_TOKEN_NOTICATION          = "/update_token_notication";

var PATH_UPATE_TOKEN_PUSHKIT             = "/update_token_pushkit";

// var PATH_UPDATE_DEVICE_ACCESS            = "/update_device_access";

var PATH_INCOMING_CALL			 	     = "/incoming_call";

var PATH_OUTGOING_CALL			 	     = "/outgoing_call";

var PATH_CONVERSATION_SEND_NOTIFICATION	 = "/conversation_send_notification";


// Refer : https://stackoverflow.com/questions/43486278/how-do-i-structure-cloud-functions-for-firebase-to-deploy-multiple-functions-fro
exports.iDNA = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/{type}/').onWrite(event => {
    
    /*
	ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	*/
	if (!event.data.exists()) {
		return false;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;
	
	switch(event.params.type) {
		case 'profiles':{
			
			// console.log('#1 : iDNA profiles xx >>');
			/*
			กรณีแก้ใขข้อมูลจาก firebase โดยตรงจึงเป้นต้องวิ่งไป update ข้อมูลที่ drupal ด้วย
			*/

			/*
			if (crnt.val() && !prev.val()) {
				// กรณี profile user มีการ add
				return true;
			}else{
				// กรณี profile user มีการ edit | Update
				request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_UPDATE_PROFILE, form: {uid:event.params.uid, data:event.data.current.val()}, headers: headers}, function(err,httpResponse,body){ 
		
					// เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
					var objectValue = JSON.parse(body);
					if (!objectValue.result) {
						// console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
					}

					return true;
				});
			}
			*/

			var options = {
			  uri: API_URL_IDNA + END_POINT_IDNA + PATH_UPDATE_PROFILE,
			  method: 'POST',
			  headers: headers,
			  json: {
			    "uid" 	: event.params.uid,
			    "data"	: crnt.val()
			  }
			};

			request(options, function (error, response, body) {

				if (error == null){
					if (body.result) {
						console.log(body);
					}else{
						console.log(body.message);
					}
				}
			});
		}
		break;

		/*
		case 'friends':{
			console.log('#2 : iDNA friends');
			
			
			
		}
		*/
		break;

	}

	return true;
});

/*
	Delete Mail & Phone
*/
exports.iDNA_User_for_Email_Phone_Delete = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/profiles/{type}/{item_id}').onDelete(event => {		

	var URI;
	switch(event.params.type) {
		case 'mails':{
			URI = PATH_DELETE_MAIL;
		}
		break;

		case 'phones':{
			URI = PATH_DELETE_PHONE;
		}
		break;
	}

	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + URI,
	  method: 'POST',
	  headers: headers,
	  json: {
	  	"fction" 	: "delete",
	    "uid"		: event.params.uid,
	    "item_id" 	: event.params.item_id
	  }
	};

	request(options, function (error, response, body) {

		if (error == null){
			if (body.result) {

			}else{
				console.log(body.message);
			}
		}
	});
});

/*
 สำหรับ Tigger กรณี friend for user มีการเปลียนแปลง เช่น is_block, close notification, ตั้งชื่อเพือน, status
*/
exports.iDNA_User_for_Friend_EditUpdate = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/friends/{friend_id}/').onWrite(event => {
    
    /*
	ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	*/
	if (!event.data.exists()) {
		return;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;

    if (crnt.val() && !prev.val()) {
		// กรณี Add

		// console.log('#1 : iDNA_User_Friend > Add');
	}else{
		// กรณี Edit | Update

		// console.log('#1 : iDNA_User_for_Friend_EditUpdate > edit & updated');

		
		/*
			เราต้องเช็ดกรณี status เปลียนแปลง
		
		if (event.data.previous.val().status !== event.data.val().status) {
			// console.log('previous : ' + event.data.previous.val().status);
			// console.log('Text : ' + event.data.val().status);

			console.log('มีการเปลียนแปลงข้อมูล');

			// var ref = db.ref(PATH_ROOT_IDNA);
			// ref.child(PATH_USER_IDNA).child(event.params.friend_id).child('friends').child(event.params.uid).update({'status': event.data.val().status});
		
			switch(event.data.val().status) {
			    case FRIEND_STATUS_FRIEND:{
					console.log('FRIEND_STATUS_FRIEND');
					var ref = db.ref(PATH_ROOT_IDNA);
					ref.child(PATH_USER_IDNA).child(event.params.friend_id).child('friends').child(event.params.uid).update({'status': event.data.val().status});
			    }
			        break;
			    case FRIEND_STATUS_FRIEND_CANCEL:{
					console.log('FRIEND_STATUS_FRIEND_CANCEL');
			    }
			        break;

			    case FRIEND_STATUS_FRIEND_REQUEST:{
					console.log('FRIEND_STATUS_FRIEND_REQUEST');
			    }
			        break;

			    case FRIEND_STATUS_WAIT_FOR_A_FRIEND:{
					console.log('FRIEND_STATUS_WAIT_FOR_A_FRIEND');
			    }
			        break;
			    default:
			        {

			        }
			}
		}
		*/

		/*
		request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_USER_FOR_FRIEND_EDITUPDATE, form: {uid:event.params.uid, friend_id:event.params.friend_id, data:event.data.current.val()}, headers: headers}, function(err,httpResponse,body){ 
				
				// เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
				// var objectValue = JSON.parse(body);
				// if (!objectValue.result) {
				// 	console.log('#1 : iDNA profiles > edit & updated, Erorr : ' + err);
				// }

				// console.log(body);
		});
		*/

		var options = {
		  uri: API_URL_IDNA + END_POINT_IDNA + PATH_USER_FOR_FRIEND_EDITUPDATE,
		  method: 'POST',
		  headers: headers,
		  json: {
		    "uid" 		: event.params.uid,
		    "friend_id" : event.params.friend_id,
		    "data"		: crnt.val()
		  }
		};

		request(options, function (error, response, body) {

			if (error == null){
				if (body.result) {
					console.log(body);
				}else{
					console.log(body.message);
				}
			}
		});

		return true;
	}
});

exports.iDNA_User_for_Friend_Delete = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/friends/{friend_id}/').onDelete(event => {		
	request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_USER_FOR_FRIEND_DELETE, form: {uid:event.params.uid, friend_id:event.params.friend_id}, headers: headers}, function(err,httpResponse,body){ 
			/* ... */
			// เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
			// var objectValue = JSON.parse(body);
			// if (!objectValue.result) {
			// 	
			// }

			// console.log('#1 : user_for_friend_delete : || ');

			console.log(body);
	});
});


/*
  function : กรณี group มีการ edit, update ข้อมูล รวมถึงการ เพิ่ม-ลบ member

  iDNA_Chat_Group

*/
/*
exports.iDNA_Chat_Group = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_CHAT_GROUP + '/{chat_group_id}/').onWrite(event => {
   
	// ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	if (!event.data.exists()) {
		return;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;
	
	if (crnt.val() && !prev.val()) {
		// กรณี profile user มีการ add
		// console.log('#3 : iDNA groups');

		return true;
	}else{
		// กรณี profile user มีการ edit | Update
		var options = {
		  uri: API_URL_IDNA + END_POINT_IDNA + PATH_UPDATE_USER_CHAT_GROUP,
		  method: 'POST',
		  headers: headers,
		  json: {
		    "uid" 		: event.params.uid,
		    "group_id"  : event.params.group_id,
		    "data"      : crnt.val()
		  }
		};

		request(options, function (error, response, body) {

			if (error == null){
				if (body.result) {
					console.log(body);
					return true;
				}else{
					console.log(body.message);
					return false;
				}
			}
		});

		return true;
	}
});
*/

/*
 กรณี  มีการเปลียนสถานะ(status)
*/
exports.iDNA_Update_User_Chat_Group = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/groups/{chat_group_id}/').onWrite(event => {
	/*
	  กรณีมีการ Delete Group Member
	*/
	// request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_MEMBER_GROUP_CHAT, form: {uid:event.params.uid, group_id:event.params.group_id, member_id:event.params.member_id}, headers: headers}, function(err,httpResponse,body){ 
	//     /* ... */
	//     // เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
	//     // var objectValue = JSON.parse(body);
	//     // if (!objectValue.result) {
	//     //  console.log('#1 : iDNA Group Delete, Erorr : ' + err);
	//     // }
	//     // console.log(body)
	//     return true;
	// });


	/*
	ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	*/
	if (!event.data.exists()) {
		return false;
	}

	const crnt = event.data.current;
	const prev = event.data.previous;

	if (crnt.val() && !prev.val()) {
		// กรณี profile user มีการ add
		// console.log('#1 : Add > iDNA_Group_Chat_Member_Add');

		// return true;

		/*
		var options = {
		  uri: API_URL_IDNA + END_POINT_IDNA + URI,
		  method: 'POST',
		  headers: headers,
		  json: {
		  	"fction" 	: "delete",
		    "uid"		: event.params.uid,
		    "item_id" 	: event.params.item_id
		  }
		};

		request(options, function (error, response, body) {

			if (error == null){
				if (body.result) {
					console.log(body);
				}else{
					console.log(body.message);
				}
			}
		});
		*/
	}else{
		// console.log('#1 : Edit & Update > iDNA_User_Chat_Group');
		// console.log(crnt.val());

		var options = {
		  uri: API_URL_IDNA + END_POINT_IDNA + PATH_UPDATE_USER_CHAT_GROUP,
		  method: 'POST',
		  headers: headers,
		  json: {
		  	"uid"   : event.params.uid,
		  	"chat_group_id"   : event.params.chat_group_id,
		    "data" 	: crnt.val()
		  }
		};

		request(options, function (error, response, body) {

			if (error == null){
				if (body.result) {
					console.log(body)
					return true;
				}else{
					console.log(body.message);
					return false;
				}
			}
		});

		return true;
	}

  	return false;
});

/*
 function : ลบ My Application
*/
exports.iDNA_Delete_MyApplication = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/my_applications/{app_id}/').onDelete(event => {
	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_MY_APPLICATION,
	  method: 'POST',
	  headers: headers,
	  json: {
	    "app_id" 	: event.params.app_id
	  }
	};

	request(options, function (error, response, body) {

		if (error == null){
			if (body.result) {
				console.log(body);
				return true;
			}else{
				console.log(body.message);
				return false;
			}
		}
	});

	return true;
});


/*
 function : ลบ Post ของ My Application
*/
exports.iDNA_Delete_Post_MyApplication = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/my_applications/{app_id}/posts/{post_id}/').onDelete(event => {
	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_POST_MY_APPLICATION,
	  method: 'POST',
	  headers: headers,
	  json: {
	  	"post_id"    : event.params.post_id
	  }
	};

	request(options, function (error, response, body) {
		if (error == null){			
			if (body.result) {
				console.log(body);
				return true;
			}else{
				console.log(body.message);
				return false;
			}
		}else{
			return false;
		}
	});
	
	return true;
});


/*
 function : ลบ Comment ของ Posts
*/
exports.iDNA_Delete_Comment_Of_Posts = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/my_applications/{app_id}/posts/{post_id}/comments/{comment_id}').onDelete(event => {
	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_COMMENT_OF_POSTS,
	  method: 'POST',
	  headers: headers,
	  json: {
	  	"uid"           : event.params.uid,
	  	"comment_id"    : event.params.comment_id
	  }
	};

	request(options, function (error, response, body) {
		if (error == null){			
			if (body.result) {
				console.log(body);
				return true;
			}else{
				console.log(body.message);
				return false;
			}
		}else{
			return false;
		}
	});
	
	return true;
});

/*
 function : ลบ Group Chat
*/
/*
exports.iDNA_Group_Chat_Delete = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/groups/{group_id}/').onDelete(event => {

	request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_GROUP_CHAT, form: {uid:event.params.uid, group_id:event.params.group_id}, headers: headers}, function(err,httpResponse,body){ 
			
			// เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
			// var objectValue = JSON.parse(body);
			// if (!objectValue.result) {
			// 	console.log('#1 : iDNA Group Delete, Erorr : ' + err);
			// }

			// console.log(body)
	});
});
*/

exports.iDNA_Update_Chat_Group = functions.database.ref(PATH_ROOT_IDNA +'/'+ PATH_CHAT_GROUP + '/{chat_group_id}/').onWrite(event => {

	// ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	if (!event.data.exists()) {
		return;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;

    if (crnt.val() && !prev.val()) {
		// console.log("add");
    }else{
    	// console.log("edit & update");

    	var options = {
		  uri: API_URL_IDNA + END_POINT_IDNA + PATH_UPDATE_CHAT_GROUP,
		  method: 'POST',
		  headers: headers,
		  json: {
		  	"chat_group_id" : event.params.chat_group_id,
		  	"data" 			: crnt.val(),
		  }
		};

		request(options, function (error, response, body) {
			if (error == null){			
				if (body.result) {
					console.log(body);
				}else{
					console.log(body);
				}
			}
			return true;
		});
    }
	return true;
});

exports.iDNA_Chat_Group_Delete = functions.database.ref(PATH_ROOT_IDNA +'/'+ PATH_CHAT_GROUP + '/{chat_group_id}/').onDelete(event => {

	/*
	request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_GROUP_CHAT, form: {uid:event.params.uid, group_id:event.params.group_id}, headers: headers}, function(err,httpResponse,body){ 
			
			// เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
			// var objectValue = JSON.parse(body);
			// if (!objectValue.result) {
			// 	console.log('#1 : iDNA Group Delete, Erorr : ' + err);
			// }

			// console.log(body)
	});
	*/

	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_CHAT_GROUP,
	  method: 'POST',
	  headers: headers,
	  json: {
	  	"chat_group_id" : event.params.chat_group_id,
	  	"data" 			: event.data.previous.val(),
	  }
	};

	request(options, function (error, response, body) {
		if (error == null){			
			if (body.result) {
				console.log(body);
			}else{
				console.log(body);
			}
		}
		return true;
	});

	return true;
});

/*
 กรณี ลบ member ของ Group
*/
exports.iDNA_Group_Chat_Member_Delete = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/groups/{group_id}/members/{member_id}/').onDelete(event => {
	/*
	กรณีมีการ Delete Group Member
	*/
	request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_MEMBER_GROUP_CHAT, form: {uid:event.params.uid, group_id:event.params.group_id, member_id:event.params.member_id}, headers: headers}, function(err,httpResponse,body){ 
			/* ... */
			// เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
			// var objectValue = JSON.parse(body);
			// if (!objectValue.result) {
			// 	console.log('#1 : iDNA Group Delete, Erorr : ' + err);
			// }

			// console.log(body)

			return true;
	});
	return true;
});

/*
 function : ลบ Classs
*/
exports.iDNA_Classs_Delete = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/classs/{item_id}/').onDelete(event => {
	/*
	กรณีมีการ Delete Group Member
	*/
	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_CLASSS,
	  method: 'POST',
	  headers: headers,
	  json: {
	  	"uid"		: event.params.uid,
	    "item_id" 	: event.params.item_id
	  }
	};

	request(options, function (error, response, body) {

		if (error == null){
			if (body.result) {
				// console.log(body);
			}else{
				console.log(body.message);
			}
		}
	});

	return true;
});

/*
 กรณี ลบ Post ของ My Application
*/
/*
exports.iDNA_MyApplication_Post_Delete = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/my_applications/{app_id}/posts/{post_id}/').onDelete(event => {
	
	// กรณีมีการ Delete Post ของ My Application
	
	// console.log('กรณีมีการ Delete Post ของ My Application');
	
	request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_POST_MY_APPLICATION, form: {uid:event.params.uid, app_id:event.params.app_id, post_id:event.params.post_id}, headers: headers}, function(err,httpResponse,body){ 
			
			// เราต้อง parse value ก่อนถึงจะสามารถใช้งานได้
			// var objectValue = JSON.parse(body);
			// if (!objectValue.result) {
			// 	console.log('#1 : iDNA Group Delete, Erorr : ' + err);
			// }

			// console.log(body)
	});
});
*/

/*
	เป็นการ กด follows โดยมีหลักการดังนี้
	เนื่องจากเราต้องการ ความเร็วในการ following & unfollow เราจึงต้องวิ่งเข้า firebase โดยตรง ดังนั้นครังของการกด following จะไม่มี id field collection ที่ database
	ดังนั้นเราต้อง เช็ดก่อนว่า มี item_id หรือเปล่าจาก tigger ถ้าไม่มีแสดงว่าเราต้องวิ่งไป สร้างแล้ว return item_id เพือมา  update โดยครั้งต้องไปเราแค้ update field status following & unfollow เท่านั้น
*/
/*
exports.iDNA_MyApplication_Follow_Unfollow = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_CENTER_IDNA + '/{category_id}/{app_id}/follows/{object_id}').onWrite(event => {
    

	// ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	if (!event.data.exists()) {
		return;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;
	

	var val = event.data.current.val();

	var ref = db.ref(PATH_ROOT_IDNA);

	if (crnt.val() && !prev.val()) {
		console.log("#1 : iDNA_MyApplication_Follow_Unfollow");
		
		// call api เพือไป create follow
		request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_CREATE_MY_APPLICATIOM_FOLLOW, form: {owner_id:val.owner_id, friend_id:event.params.uid, app_id:event.params.app_id}, headers: headers}, function(err,httpResponse,body){ 
			
			var $objectValue = JSON.parse(body);
			
			if ($objectValue.result) {
				
				//  update item_id ที่ firebase เพราะว่าถ้าเราใช้ครั้งต่อไป เช่น unfollow เราจะสามารถวิ่งไป update database ได้ถูกต้อง
				
				ref.child(PATH_CENTER_IDNA).child(event.params.category_id).child(event.params.app_id).child('follows').child(event.params.uid).update({'item_id':$objectValue.item_id });
			

				// var $objectValue = JSON.parse(body);// 
				// idna/user/{uid}/my_applications/{item_id}/followers/{friend_id}/{status=[0,1]}

				// console.log('owner_id :' + $objectValue.owner_id + ", friend_id : " + event.params.uid);

				ref.child(PATH_USER_IDNA).child(val.owner_id).child('my_applications').child(event.params.app_id).child('followers').child(event.params.uid).update({'status': '1'});
			}	
		});

	}else{

		console.log("#2 : iDNA_MyApplication_Follow_Unfollow");
		
		// item_id
		console.log('item_id : ' + val.item_id + ', owner_id : ' + val.owner_id + ', friend_id : ' + event.params.uid + ', status : ' + val.status);

		// 
		// idna/user/{val.owner_id}/my_applications/{app_id}/followers/{event.params.uid}/{status=[0,1]}

		ref.child(PATH_USER_IDNA).child(val.owner_id).child('my_applications').child(event.params.app_id).child('followers').child(event.params.uid).update({'status': val.status});

		request.post({url:API_URL_IDNA + END_POINT_IDNA + PATH_UPDATE_MY_APPLICATION_FOLLOW, form: {friend_id:event.params.uid, app_id:event.params.app_id, data:event.data.current.val()}, headers: headers}, function(err,httpResponse,body){ 
			// console.log(body);
		});

	}
});
*/





exports.iDNA_Update_MyApplications = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{owner_id}/my_applications/{node_id}/').onWrite(event => {

	// ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	if (!event.data.exists()) {
		return;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;

    if (crnt.val() && !prev.val()) {
		// console.log("add");
    }else{
    	// console.log("edit & update");
		var options = {
		  uri: API_URL_IDNA + END_POINT_IDNA + PATH_UPDATE_MY_APPLICATIONS,
		  method: 'POST',
		  headers: headers,
		  json: {
		  	"owner_id" 	: event.params.owner_id,
		  	"node_id" 	: event.params.node_id,
		    "data"		: event.data.val()
		  }
		};

		request(options, function (error, response, body) {
			if (error == null){			
				if (body.result) {
					console.log(body);
				}else{
					console.log(body);
				}
			}
			return true;
		});
	}
	
	return true;
});

exports.iDNA_Update_MyApplications_Follow = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{owner_id}/my_applications/{node_id}/follow/{object_id}/').onWrite(event => {

	// ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	if (!event.data.exists()) {
		return;
	}

	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + PATH_UPDATE_MY_APPLICATIONS_FOLLOW,
	  method: 'POST',
	  headers: headers,
	  json: {
	  	"owner_id"	: event.params.owner_id,
	  	"node_id"   : event.params.node_id,
	  	"object_id" : event.params.object_id,
	    "data"		: event.data.val()
	  }
	};

	request(options, function (error, response, body) {
		if (error == null){			
			if (body.result) {
				// console.log(body);
			}else{
				console.log(body);
			}
		}

		return true;
	});
	
	return true;
});


/*
	เป็นการ กด Like โดยมีหลักการดังนี้
	เนื่องจากเราต้องการ ความเร็วในการ like & unlike เราจึงต้องวิ่งเข้า firebase โดยตรง ดังนั้นครังของการกด like จะไม่มี id field collection ที่ database
	ดังนั้นเราต้อง เช็ดก่อนว่า มี item_id หรือเปล่าจาก tigger ถ้าไม่มีแสดงว่าเราต้องวิ่งไป สร้างแล้ว return item_id เพือมา  update โดยครั้งต้องไปเราแค้ update field status like & unlike เท่านั้น

	friend_id ซ: คือ id ของคนที่กด like
*/
exports.iDNA_Update_MyApplications_Post_Like = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{owner_id}/my_applications/{node_id}/posts/{post_id}/likes/{object_id}/').onWrite(event => {
	// ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	if (!event.data.exists()) {
		return false;
	}

	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + PATH_UPDATE_MY_APPLICATION_POST_LIKE,
	  method: 'POST',
	  headers: headers,
	  json: {
	  	"owner_id"  : event.params.owner_id,
	  	"node_id"   : event.params.node_id,
	  	"post_id"   : event.params.post_id,
	  	"object_id" : event.params.object_id,
	    "data"		: event.data.val()
	  }
	};

	request(options, function (error, response, body) {
		if (error == null){			
			if (body.result) {
				console.log(body);
				return true;
			}else{
				console.log(body.message);
				return false;
			}
		}else{
			return false;
		}
	});
	
	return true;
});


// idna/user/548595/my_applications/497/posts/1111345/comments/1111370/replys/1111374/

exports.iDNA_Delete_ReplyComment_of_MyApplication = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{owner_id}/my_applications/{node_id}/posts/{post_id}/comments/{comment_id}/replys/{reply_id}/').onDelete(event => {
	
	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_REPLYCOMMENT_OF_MYAPPLICATION,
	  method: 'POST',
	  headers: headers,
	  json: {
	  	"reply_id"    : event.params.reply_id
	  }
	};

	request(options, function (error, response, body) {
		if (error == null){			
			if (body.result) {
				console.log(body);
				return true;
			}else{
				console.log(body.message);
				return false;
			}
		}else{
			return false;
		}
	});
	
	return true;

});

/*
	Tigger เวลาที่ลบ post จาก Center 
*/
/*
exports.iDNA_Center_Delete_Posts = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_CENTER_IDNA + '/{category}/{app_id}/posts/{post_id}/').onDelete(event => {

	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_POST_MY_APPLICATION,
	  method: 'POST',
	  headers: headers,
	  json: {
	  	"post_id"    : event.params.post_id
	  }
	};

	request(options, function (error, response, body) {
		if (error == null){			
			if (body.result) {
				console.log(body);
				return true;
			}else{
				console.log(body.message);
				return false;
			}
		}else{
			return false;
		}
	});
	
	return true;

});
*/

/*
	เพิ่ม & แก้ไข comment ของ post
*/
/*
exports.iDNA_Center_Post_Update_Comments = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_CENTER_IDNA + '/{category}/{app_id}/posts/{post_id}/comments/{object_id}/').onWrite(event => {
 
	// ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	if (!event.data.exists()) {

		// console.log(">>>> iDNA_MyApplication_Post_Like_Unlike");
		return false;
	}


	const crnt = event.data.current;
    const prev = event.data.previous;

    if (crnt.val() && !prev.val()) {
		// กรณี profile user มีการ add
	}else{
		// กรณี profile user มีการ edit | Update

		var options = {
		  uri: API_URL_IDNA + END_POINT_IDNA + PATH_CENTER_POST_UPDATE_COMMENTS,
		  method: 'POST',
		  headers: headers,
		  json: {
		  	"app_id"    : event.params.app_id,
		  	"post_id"   : event.params.post_id,
		  	"object_id" : event.params.object_id,
		    "data"		: event.data.val()
		  }
		};

		request(options, function (error, response, body) {
			if (error == null){			
				if (body.result) {
					// console.log(body);
					return true;
				}else{
					console.log(body);
					return false;
				}
			}else{
				return false;
			}
		});
	}

	return true;
});
*/

/*
	ลบ comment ของ post
*/
/*
exports.iDNA_Center_Post_Delete_Comments = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_CENTER_IDNA + '/{category}/{app_id}/posts/{post_id}/comments/{object_id}/').onDelete(event => {
 
	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + PATH_CENTER_POST_DELETE_COMMENTS,
	  method: 'POST',
	  headers: headers,
	  json: {
	  	"app_id"    : event.params.app_id,
	  	"post_id"   : event.params.post_id,
	  	"object_id" : event.params.object_id
	    // "data"		: event.data.previous.val()
	  }
	};
	
	request(options, function (error, response, body) {
		if (error == null){			
			if (body.result) {
				// console.log(body);
				return true;
			}else{
				console.log(body);
				return false;
			}
		}else{
			return false;
		}
	});
	
	return true;
});
*/

/*
	like comment ของ post
	NSString *child = [NSString stringWithFormat:@"%@center/%@/%@/posts/%@/comments/%@/likes/"
*/
/*
exports.iDNA_Update_MyApplication_Post_Comments_Like = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_CENTER_IDNA + '/{category}/{app_id}/posts/{post_id}/comments/{comment_id}/likes/{object_id}/').onWrite(event => {
	// ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	if (!event.data.exists()) {
		return false;
	}

	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + PATH_CENTER_POST_COMMENTS_LIKE,
	  method: 'POST',
	  headers: headers,
	  json: {
	  	"app_id"    : event.params.app_id,
	  	"post_id"   : event.params.post_id,
	  	"comment_id": event.params.comment_id,
	  	"object_id" : event.params.object_id,
	    "data"		: event.data.val()
	  }
	};

	request(options, function (error, response, body) {
		if (error == null){			
			if (body.result) {
				console.log(body);
				return true;
			}else{
				console.log(body);
				return false;
			}
		}else{
			return false;
		}
	});
	
	return true;
});
*/


/*
exports.UPDATE_DEVICE_ACCESS = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/profiles/device_access/{item_id}/').onWrite(event => {
    
	// ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	if (!event.data.exists()) {
		return false;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;

    if (crnt.val() && !prev.val()) {
		// กรณี profile user มีการ add
	}else{
		// กรณี profile user มีการ edit | Update
		// console.log('#1 : iDNAXXX  >>');
		// console.log(event.data.current.val());

		var options = {
		  uri: API_URL_IDNA + END_POINT_IDNA + PATH_UPDATE_DEVICE_ACCESS,
		  method: 'POST',
		  headers: headers,
		  json: {
		  	"item_id" 	: event.params.item_id,
		    "data"	: event.data.current.val()
		  }
		};

		request(options, function (error, response, body) {
			if (error == null){
				if (body.result) {
					// console.log(body);
				}else{
					console.log(body.message);
				}
			}
		});
	}
	return true;
});
*/

/*
 Update token notication
*/
exports.Update_Token_Notication = functions.database.ref(PATH_ROOT_IDNA + '/token_notification/{key}/').onWrite(event => {
    
    /*
	ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	*/
	if (!event.data.exists()) {
		return false;
	}
	
	const crnt = event.data.current;
    const prev = event.data.previous;

    // if (crnt.val() && !prev.val()) {
		// กรณี มีการ add ใหม่เท่านั้น
	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + PATH_UPATE_TOKEN_NOTICATION,
	  method: 'POST',
	  headers: headers,
	  json: {
	  	"key" 	: event.params.key,
	    "data"	: event.data.current.val()
	  }
	};

	request(options, function (error, response, body) {
		if (error == null){
			if (body.result) {
				// console.log(body);
			}else{
				console.log(body.message);
			}
		}
	});
	// }

	return true;
});

/*
 Update token pushkit
*/
exports.Update_Token_Pushkit = functions.database.ref(PATH_ROOT_IDNA + '/token_pushkit/{key}/').onWrite(event => {
    
    /*
	ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	*/
	if (!event.data.exists()) {
		return false;
	}
	
	const crnt = event.data.current;
    const prev = event.data.previous;

    // if (crnt.val() && !prev.val()) {
		// กรณี มีการ add ใหม่เท่านั้น
	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + PATH_UPATE_TOKEN_PUSHKIT,
	  method: 'POST',
	  headers: headers,
	  json: {
	  	"key" 	: event.params.key,
	    "data"	: event.data.current.val()
	  }
	};

	request(options, function (error, response, body) {
		if (error == null){
			if (body.result) {
				console.log(body);
			}else{
				console.log(body.message);
			}
		}
	});
	
	return true;
});


exports.outgoing_call = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/outgoing_call/{uuid}/').onWrite(event => {
    
    /*
	ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	*/
	if (!event.data.exists()) {
		return;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;

	if (crnt.val() && !prev.val()) {
		// add
		return true;
	}else{

		// console.log("incoming_call edit | update" /* + crnt.child("callSid").val()*/ );

		// console.log("outgoing_call flag" + flag );

		return true;
		/*
		var uid 		= event.params.uid;
		var uuid        = event.params.uuid;
		var data 		= event.data.current.val();

		var members 	= data.members;

		var flag  = false;
		for(key in members) {
			var member = members[key];
			if (member.type == 'caller' && member.status == 'rejected') {
				flag = true;
				break;
			}
		}

	
		var ref = db.ref(PATH_ROOT_IDNA);
		if (flag) {
			for(key in members) {
				var member = members[key];
				if (member.type == 'participant') {
					ref.child(PATH_USER_IDNA).child(member.friend_id).child('incoming_call').child(uuid).update({'status': 'rejected'});
				}
			}
		}
		return false
		*/
	}
});

/*
กรณีกดรับสาย(incoming call) เราจะทำการส่ง cancel voip ไปยัง device ทีไม่ได้รับสาย

https://stackoverflow.com/questions/42743608/cloud-functions-for-firebase-onwrite
*/
exports.incoming_call = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/incoming_call/{uuid}/').onWrite(event => {
    
    /*
	ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return 
	*/
	if (!event.data.exists()) {
		return;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;

	if (crnt.val() && !prev.val()) {
		// add
		// console.log("incoming_call add");
		return true;
	}else{
		// console.log("incoming_call edit | update" /* + crnt.child("callSid").val()*/ );

		// .exists()
		
		// เช็กว่ามี field นี้หรือไม
		// console.log("1. >" + crnt.child("callSid").exists());
		// console.log("2. >" + crnt.child("callSidC").exists());

		// 

		/*
		หลักการเงีอนไขทำงาน
		จะทำงานก็ต่อเมือ กดรับสายแล้วจะมีการ update field device_id จะมีค่าโดยเราจะเช็ดว่า ก่อนหน้าไม่มี และข้อมูลปัจจุบันมีข้อมูลเราถึงจะทำงาน

		สามารถเช็ด previous data กับ current data เราก็ comparm เอา 
		โดยเงือนว่า previous field device_id =="" && current field device_id != "" แค่นี้น่าจะได้
		*/

		return true;

		/*
		var uid 		= event.params.uid;
		var uuid        = event.params.uuid;
		var data 		= event.data.current.val();

		var ref = db.ref(PATH_ROOT_IDNA);

		if (data.status == 'connected' || data.status == 'rejected') {
			ref.child(PATH_USER_IDNA).child(data.uid).child('outgoing_call').child(uuid).child('members').child(data.outgoing_call_member_item_id).update({'status': data.status});
		}

		return true;
		*/
	}
});


exports.iDNA_Delete_Center_Chat = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{uid}/center_chat/{item_id}/').onDelete(event => {		
	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_CENTER_CHAT,
	  method: 'POST',
	  headers: headers,
	  json: {
	    "item_id" 	: event.params.item_id
	  }
	};

	request(options, function (error, response, body) {

		if (error == null){
			if (body.result) {
				// console.log(body);
			}else{
				console.log(body.message);
			}
		}
	});

	return true;
});

exports.iDNA_Delete_Following = functions.database.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/{owner_id}/following/{object_id}/').onDelete(event => {
	var options = {
	  uri: API_URL_IDNA + END_POINT_IDNA + PATH_DELETE_FOLLOWING,
	  method: 'POST',
	  headers: headers,
	  json: {
	  	"owner_id" 	: event.params.owner_id,
	  	"object_id" : event.params.object_id,
	  	"data" 		: event.data.previous.val(),
	  }
	};

	request(options, function (error, response, body) {
		if (error == null){			
			if (body.result) {
				// console.log(body);
			}else{
				console.log(body);
			}
		}
		return true;
	});

	return true;
});



exports.iDNA_Conversation = functions.database.ref('conversation/{chat_id}/{message_id}/').onWrite(event => {
	/*
	ต้องเช็กด้วยว่าเป้นการลบ ข้อมูลหรือไม่ ถ้าใช่ให้ return เพราะเราไม่คิด
	*/
	if (!event.data.exists()) {
		return;
	}

	const crnt = event.data.current;
    const prev = event.data.previous;

    if (crnt.val() && !prev.val()) {
		// กรณี Add
		// console.log('iDNA_Conversation > Add : ' + event.params.message_id);

		// console.log(crnt.val().type);


		/*
		กรณีไม่มี field type เราถือว่า message นี้มีไม่สมบูรณ์ เรา return false เลย
		*/
		if(!crnt.val().hasOwnProperty('type')){
		    return false;
		}

		var options = {
		  uri: API_URL_IDNA + END_POINT_IDNA + PATH_CONVERSATION_SEND_NOTIFICATION,
		  method: 'POST',
		  headers: headers,
		  json: {
		    "chat_id" 	: event.params.chat_id,
		    "message_id": event.params.message_id,
		    "data"		: crnt.val()
		  }
		};

		request(options, function (error, response, body) {

			if (error == null){
				if (body.result) {
					// console.log(body);
				}else{
					console.log(body.message);
				}
			}
		});
	
		/*
		switch(crnt.val().type) {
		    case 1:{

		    	//if(!crnt.val().hasOwnProperty('to')){
				//	return false;
				//}

				// ownerId
				admin.database().ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/' + crnt.val().ownerId +'/friends/').orderByChild('chat_id').equalTo(event.params.chat_id).once('child_added').then(qshot => {
			
					// console.log('mmmm ----> ');
					// console.log('key ' + qshot.key);
				 //   	console.log(qshot.val());
				 //   	console.log('mmmm <---- ');
				   	// console.log(snapshot.val().randomValue + ' .. ' + snapshot.val().sorter);
				   	// console.log(snapshot.child('randomValue').val() + ' .. ' + snapshot.child('sorter').val());

				   	var ref = db.ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/' + qshot.key + '/profiles/device_access/');

			    	// Attach an asynchronous callback to read the data at our posts reference
					ref.on("value", function(snapshot) {
					  // console.log('var ref = db.ref(PATH_ROOT_IDNA ++ PATH_USER_IDNA)'); 
					  // console.log('-snapshot-');
					  // console.log(snapshot.val());

					  	console.log('-- value -- 1');
					  	// console.log('-- value -- 1' + snapshot.val());
						if (snapshot.val() === null) {
						  	return false;
						}

						// console.log('-- value -- 2');
						var tokens = [];
						for(var key in snapshot.val()) {
						  	var value = snapshot.val()[key];
						  	if(!value.hasOwnProperty('token_notification')){
							    continue;
							}
							// console.log(value.token_notification);

							tokens.push(value.token_notification);
						}

						if (tokens.length == 0) {
							return false;
						}

						// console.log('-- value -- 3');
						
						admin.database().ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/' + qshot.key + '/profiles/badge/').once('value').then(function(st) {
							
							var count = 0;
							if (st.val() === null) {
						  		
							}else{
								count = st.val();
							}

							count++;


							// var tokens = [ 'fyMMpr8P0SI:APA91bEAvIOoMQoIjY9pGhMJ5S2hPO2QmEXicM9-73N4hDtAvLBI4r69w_nBBCxFJcTdj1qUadHPKNfOEvS2KAyfojkvq3QyImvmgbqUVhP9SfmIuRWLjhgdB3m0jHn1CBDvMPeP27jD' ];

							// https://stackoverflow.com/questions/43103538/payload-error-in-cloud-functions-for-firebase-messaging
							// Notification details.
					        const payload = {
					          'notification': {
					            // title: app_name,
					            body: crnt.val().content,
					            // icon: follower.photoURL
					            badge:count.toString(),
					          },
					          'data': { 
						        	'chat_id'		: event.params.chat_id,
							        'message_id'	: event.params.message_id,
							        'type'        	:'conversation',
							        'message_type'	: '1',
							        'friend_id'   	: crnt.val().ownerId,
						      }
					        };
				        	admin.messaging().sendToDevice(tokens, payload);

							return admin.database().ref(PATH_ROOT_IDNA + '/'+ PATH_USER_IDNA + '/' + qshot.key + '/profiles/').update({
							    "badge": count.toString()
							});
						});

						return true;
						
					}, function (errorObject) {
					  console.log("The read failed: " + errorObject.code);
					});
				});

				return false;

				

		  //   	var tokens = [ 'fyMMpr8P0SI:APA91bEAvIOoMQoIjY9pGhMJ5S2hPO2QmEXicM9-73N4hDtAvLBI4r69w_nBBCxFJcTdj1qUadHPKNfOEvS2KAyfojkvq3QyImvmgbqUVhP9SfmIuRWLjhgdB3m0jHn1CBDvMPeP27jD' ];

				// // Notification details.
		  //       const payload = {
		  //         notification: {
		  //           // title: app_name,
		  //           body: crnt.val().content
		  //           // icon: follower.photoURL
		  //         }
		  //       };

		  //       // Send notifications to all tokens.
		  //       return admin.messaging().sendToDevice(tokens, payload);
		        
		    }
		        break;
		    default:
		        break;
		}
		*/

		return true;
	}else{
		// กรณี Edit | Update
		// console.log('iDNA_Conversation > Edit | Update : ' + event.params.message_id);
		return true;
	}
});