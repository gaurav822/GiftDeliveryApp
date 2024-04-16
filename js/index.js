//==================================index.js==================================//

var debug = false;
var authenticated = false;


$(document).ready(function () {

	localStorage.removeItem("allUsers");
	localStorage.removeItem("allOrders");
	
	
	if (!localStorage.allUsers) {
		
		alert("Users not found - creating a default user!");
	  
		if (debug) alert("Users not found - creating a default user!");
		
		var userData = {email:"admin@domain.com",password:"admin",firstName:"CQU",lastName:"User",state:"QLD",phoneNumber:"0422919919", address:"700 Yamba Road", postcode:"4701"};
		
		var allUsers = [];
		allUsers.push(userData); 
		
		if (debug) alert(JSON.stringify(allUsers));  
		localStorage.setItem("allUsers", JSON.stringify(allUsers));

	} else {
        
		if (debug) alert("Names Array found-loading.."); 		
		
		var allUsers = JSON.parse(localStorage.allUsers);    
		if (debug) alert(JSON.stringify(allUsers));
	} 



	/**
	----------------------Event handler to process login request----------------------
	**/
	
	$('#loginButton').click(function () {


		localStorage.removeItem("inputData");

		$("#loginForm").submit();

		if (localStorage.inputData != null) {

			var inputData = JSON.parse(localStorage.getItem("inputData"));
			var allUsers = JSON.parse(localStorage.getItem("allUsers"));

			allUsers.forEach(function(userData){		
			
				if (inputData.email == userData.email && inputData.password == userData.password) {
					authenticated = true;
					alert("Login success");
					localStorage.setItem("userInfo", JSON.stringify(userData));
					$.mobile.changePage("#homePage");
				} 
			}); 	
			
			if (authenticated == false){
				alert("Login failed");
			}

			$("#loginForm").trigger('reset');
		}	
	})

	

	 $("#loginForm").validate({// JQuery validation plugin
		focusInvalid: false,  
		onkeyup: false,
		submitHandler: function (form) {   
			
			var formData =$(form).serializeArray();
			var inputData = {};
			formData.forEach(function(data){
				inputData[data.name] = data.value;
			})

			localStorage.setItem("inputData", JSON.stringify(inputData));		
		},
		/* Validation rules */
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				rangelength: [3, 10]
			}
		},
		/* Validation message */
		messages: {
			email: {
				required: "Please enter your email",
				email: "The email format is incorrect"
			},
			password: {
				required: "Password cannot be empty",
				rangelength: $.validator.format("Minimum Password Length:{0}, Maximum Password Length:{1}。")

			}
		},
	});
	/**
	--------------------------end--------------------------
	**/	


	/**
	----------------------Event handler to process registration request----------------------
	**/


	$('#registerButton').click(function (){
		$.mobile.changePage("#registerPage");
	});


	$('#registerSubmit').click(function (){

		localStorage.removeItem('userInfo')

		$("#registerForm").submit();

		if (localStorage.userInfo != null) {

			var userInfo = JSON.parse(localStorage.getItem("userInfo"));

			var allUsers = [];

			if (localStorage.allUsers != null) 
			allUsers = JSON.parse(localStorage.allUsers); 

			allUsers.push(userInfo);

			localStorage.setItem("allUsers", JSON.stringify(allUsers));

			if (debug) alert(JSON.stringify(allUsers));			

			$("#registerForm").trigger('reset');

			alert("Registration Successful");
			
			$.mobile.changePage("#loginPage");
		}

	});


	



	$("#registerForm").validate({// JQuery validation plugin
		focusInvalid: false,  
		onkeyup: false,
		submitHandler: function (form) {   
			
			var formData =$(form).serializeArray();
			var userInfo = {};

			formData.forEach(function(data){
				userInfo[data.name] = data.value;
			});
			
			localStorage.setItem("userInfo", JSON.stringify(userInfo));

			if (debug)	alert(JSON.stringify(userInfo));
					
		},
		/* Validation rules */
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				rangelength: [3, 10]
			},
			firstName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			lastName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			phoneNumber: {
				required: true,
				mobiletxt:true,
				
			},
			address: {
				required: true,
				rangelength: [1, 25]
			},
			postcode: {
				required: true,
				posttxt: true
			},
			
		},
		/* Validation message */
		messages: {
			email: {
				required: "Please enter your email",
				email: "The email format is incorrect"
			},
			password: {
				required: "Password cannot be empty",
				rangelength: $.validator.format("Minimum Password Length:{0}, Maximum Password Length:{1}")

			},
			firstName:{
				required: "Please enter your first Name",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			lastName:{
				required: "Please enter your last Name",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			phoneNumber:{
				required: "Please enter your Phone Number",
			},
			address:{
				required: "Please enter your address",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			postcode:{
				required: "Post code required",
			}
	
		},
	});


	/**
	--------------------------end--------------------------
	**/	


	/**
	------------Event handler to respond to selection of gift category-------------------
	**/
	$('#itemList li').click(function () {
		
		var itemName = $(this).find('#itemName').text()
		var itemPrice = $(this).find('#itemPrice').text()
		var itemImage = $(this).find('#itemImage').attr('src');
		
		localStorage.setItem("itemName", itemName);
		localStorage.setItem("itemPrice", itemPrice);
		localStorage.setItem("itemImage", itemImage);

	}) 

	/**
	--------------------------end--------------------------
	**/	


	/**
	--------------------Event handler to process order confirmation----------------------
	**/

	$('#confirmOrderButton').on('click', function () {
		// Remove any existing orderInfo from localStorage
		localStorage.removeItem("orderInfo");
	
		// Submit the order form
		$("#orderForm").submit();
	
		// Retrieve orderInfo and allOrders from localStorage
		var orderInfo = JSON.parse(localStorage.getItem("orderInfo"));
		var allOrders = JSON.parse(localStorage.getItem("allOrders")) || {};
	
		// Retrieve the user's email from localStorage
		var userEmail = JSON.parse(localStorage.getItem("userInfo")).email;
	
		// Check if orders for this user already exist
		if (!allOrders[userEmail]) {
			allOrders[userEmail] = []; // Initialize orders array for this user
		}
	
		// Add the order to the user's orders
		allOrders[userEmail].push(orderInfo);
	
		// Store updated allOrders back to localStorage
		localStorage.setItem("allOrders", JSON.stringify(allOrders));
	
		// Optionally, you can display a confirmation message or reset the form
		// For example:
		if (debug) alert(JSON.stringify(allOrders)); // Debugging message
		$("#orderForm").trigger('reset'); // Reset the order form
		$.mobile.changePage("#confirmPage"); // Change to the confirmation page
	});
	


	$("#orderForm").validate({  
		focusInvalid: false, 
		onkeyup: false,
		submitHandler: function (form) {   
			
			var formData =$(form).serializeArray();
			var orderInfo = {};

			formData.forEach(function(data){
				orderInfo[data.name] = data.value;
			});
			
			orderInfo.item = localStorage.getItem("itemName")
			orderInfo.price = localStorage.getItem("itemPrice")
			orderInfo.img = localStorage.getItem("itemImage")
			
			var userInfo = JSON.parse(localStorage.getItem("userInfo"));

			orderInfo.customerfName = userInfo.firstName;
			orderInfo.customerlName = userInfo.lastName;
			
			localStorage.setItem("orderInfo", JSON.stringify(orderInfo));

			if (debug)	alert(JSON.stringify(orderInfo));
					
		},
		
		/* validation rules */
		
		rules: {
			firstName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			lastName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			phoneNumber: {
				required: true,
				mobiletxt: true
			},
			address: {
				required: true,
				rangelength: [1, 25]
			},
			postcode: {
				required: true,
				posttxt: true
			},
		},
		/* Validation Message */

		messages: {
			firstName: {
				required: "Please enter your firstname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),

			},
			lastName: {
				required: "Please enter your lastname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
				validateName: true
			},
			phoneNumber: {
				required: "Phone number required",
			},
			address: {
				required: "Delivery address required",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			postcode: {
				required: "Postcode required",

			},
		}
	});


	/**
	--------------------Event handler to perform initialisation before login page is displayed--------------------
	**/


	$(document).on("pagebeforeshow", "#loginPage", function() {
	
		localStorage.removeItem("userInfo");
	
		authenticated = false;
	});  
	
	/**
	--------------------------end--------------------------
	**/	

	/**
	--------------------Event handler to populate the fill order page before it is displayed---------------------
	**/

	$(document).on("pagebeforeshow", "#fillOrderPage", function() {
		
		$("#itemSelected").text(localStorage.getItem("itemName"));
		$("#priceSelected").text(localStorage.getItem("itemPrice"));
		$("#imageSelected").attr('src', localStorage.getItem("itemImage"));

	});  

	/**
	--------------------------end--------------------------
	**/	


	/**
	--------------------Event handler to populate the confirm page before it is displayed---------------------
	**/

	$(document).on("pagebeforeshow", "#confirmPage", function() {
		
		$('#orderConfirmation').html("");

		if (localStorage.orderInfo != null) {

			var orderInfo = JSON.parse(localStorage.getItem("orderInfo"));

			$('#orderConfirmation').append('<br><table><tbody>');
			$('#orderConfirmation').append('<tr><td>Customer: </td><td><span class=\"fcolor\">' + orderInfo.customerfName + ' ' + orderInfo.customerlName + '</span></td></tr>');	
			$('#orderConfirmation').append('<tr><td>Item: </td><td><span class=\"fcolor\">' + orderInfo.item + '</span></td></tr>');	
			$('#orderConfirmation').append('<tr><td>Price: </td><td><span class=\"fcolor\">' + orderInfo.price + '</span></td></tr>');
			$('#orderConfirmation').append('<tr><td>Recipient: </td><td><span class=\"fcolor\">' + orderInfo.firstName + ' ' + orderInfo.lastName + '</span></td></tr>');
			$('#orderConfirmation').append('<tr><td>Phone number: </td><td><span class=\"fcolor\">' + orderInfo.phoneNumber + '</span></td></tr>');
			$('#orderConfirmation').append('<tr><td>Address: </td><td><span class=\"fcolor\">' + orderInfo.address + ' ' + orderInfo.postcode + '</span></td></tr>');
			$('#orderConfirmation').append('<tr><td>Dispatch date: </td><td><span class=\"fcolor\">' + orderInfo.date + '</span></td></tr>');
			$('#orderConfirmation').append('</tbody></table><br>');
		}
		else {
			$('#orderConfirmation').append('<h3>There is no order to display<h3>');
		}
	});  


	/**
	--------------------------end--------------------------
	**/	



	/**
	--------------------Event handler to populate the confirm page before it is displayed---------------------
	**/

	$(document).on("pagebeforeshow", "#pastOrderPage", function() {
		$('#pastOrders').html("");
	
		if (localStorage.allOrders != null) {
			var allOrders = JSON.parse(localStorage.getItem("allOrders"));
	
			// Assuming userEmail contains the email of the user you want to retrieve orders for
			var userEmail = JSON.parse(localStorage.getItem("userInfo")).email // Replace this with the actual user's email
	
			if (allOrders[userEmail]) {
				allOrders[userEmail].forEach(function(orderInfo, index) {
					$('#pastOrders').append('<br><table><tbody>');
					$('#pastOrders').append('<tr><td>Order No: </td><td><span class=\"fcolor\">' + (1000 + index + 1) + '</span></td></tr>');
					$('#pastOrders').append('<tr><td>Customer: </td><td><span class=\"fcolor\">' + orderInfo.customerfName + ' ' + orderInfo.customerlName + '</span></td></tr>');
					$('#pastOrders').append('<tr><td>Item: </td><td><span class=\"fcolor\">' + orderInfo.item + '</span></td></tr>');
					$('#pastOrders').append('<tr><td>Price: </td><td><span class=\"fcolor\">' + orderInfo.price + '</span></td></tr>');
					$('#pastOrders').append('<tr><td>Recipient: </td><td><span class=\"fcolor\">' + orderInfo.firstName + ' ' + orderInfo.lastName + '</span></td></tr>');
					$('#pastOrders').append('<tr><td>Phone Number: </td><td><span class=\"fcolor\">' + orderInfo.phoneNumber + '</span></td></tr>');
					$('#pastOrders').append('<tr><td>Address: </td><td><span class=\"fcolor\">' + orderInfo.address + ' ' + orderInfo.postcode + '</span></td></tr>');
					$('#pastOrders').append('<tr><td>Dispatch date: </td><td><span class=\"fcolor\">' + orderInfo.date + '</span></td></tr>');
					$('#pastOrders').append('</tbody></table><br>');
				});
			} else {
				$('#pastOrders').append('<h3>No orders found for this user</h3>');
			}
		} else {
			$('#pastOrders').append('<h3>No orders found</h3>');
		}
	});
	


	/**
	--------------------------end--------------------------
	**/	





	/**
	--------------------Event handler to populate the user info page before it is displayed---------------------
	**/

	$(document).on("pagebeforeshow", "#userProfilePage", function() {
		
		$('#userProfile').html("");

		if (localStorage.userInfo != null) {

			var userInfo = JSON.parse(localStorage.getItem("userInfo"));

			$('#userProfile').append('<br><table><tbody>');
			$('#userProfile').append('<tr><td>Email: </td><td><span class=\"fcolor\">' + userInfo.email + '</span></td></tr>');	
			$('#userProfile').append('<tr><td>Name: </td><td><span class=\"fcolor\">' + userInfo.firstName +' '+userInfo.lastName+ '</span></td></tr>');	
			$('#userProfile').append('<tr><td>Address: </td><td><span class=\"fcolor\">' + userInfo.address + '</span></td></tr>');
			$('#userProfile').append('<tr><td>Phone Number: </td><td><span class=\"fcolor\">' + userInfo.phoneNumber+'</span></td></tr>');
			$('#userProfile').append('</tbody></table><br>');
		}
		else {
			$('#userProfile').append('<h3>There is no profile to display<h3>');
		}
	});  


	/**
	--------------------------end--------------------------
	**/	


	

	

});


