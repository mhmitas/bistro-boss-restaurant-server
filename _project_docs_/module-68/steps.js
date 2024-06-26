////////////////////////////////
//   Final Project Part-5     //
////////////////////////////////
/*
## 68-1: Module Introduction and save user data .
~ When user sign up to the app save user data to the database
____________________________
## 68-2: Google sign in and when to save user info
~ implement google sign in and created a different component to handle it
____________________________
## 68-3: Save user if he does't exists in the database:
~ test some different methode to do it(1. making the email unique, 2 .upsert, 3. simple checking)
    - create a query using user email and find the email in the user coll. if the user already exists return with a message 
    -  
~ Woking with dashboard: 
    - some khucra work in sidebar based on role(created navlinks)
    
____________________________
## 68-4 Load all users on the Dashboard page;
~ created an api in server side. --> use useQuery() hook to get all users data in all users page.  --> Use table and display users --> implement delete user methode --> 

____________________________
## 68-5 Display All Users And Create Make Admin API
~ created api to update user role user to admin 

____________________________
## 68-6 Make User Admin And Install JWT
~ --> create a post request using axiosSecure to update user role and successfully updated it.
=> I want to secure some api
~ so I will use jwt() | install jwt token and require it

____________________________
## 68-7 (Recap) Create a JWT token and save it on local storage
~ create jwt token: go to jwt repo --> create a token(server) and send it with res. --> recive this token and save it in the local storage and when log out remove this token
~ now i will send the token with request: so that (Request Config)using `headers (`headers` are custom headers to be sent) i will send it to the server --> verify the token in a middleware --> 

____________________________
## 68-8 (Advanced) Verify token and axios interceptor:
~ now i will verify the token in the middleware: use jwt.verify() to veriry the token in the verifyToken middleware.
~ i have this token available in client side and  i will not use this token for a single time. I need it to send to the server multiple time. so i will do some kahini in useAxiosSecure(). use headers to send the token with request in the axios inteceptor. --> get stutus code in interceptors.response.. [write functions following the axios docs]

____________________________
## 68-9 Logout unauthorize access and check is admin
~ For 401 or 403 status logout the user and navigate to the home page.
~ Here need to work for some security fix. -->to get the admin properly. --> create an api in the server to verify the admin(/users/admin/:uid). --> create an hook useAdmin, from where i will call this api  

************
create jwt token --> verify jwt token --> verify admin
************

_______________________________
## 68-10 (Advanced) make user api secure using verify admin



////////////////////////////////
//   Final Project Part-6     //
////////////////////////////////

// Module 69: Final Project Part-6
_______________________________
## 69-1 (Recap)  Why We Use React-query, axios, and react hook form
~ 

______________________________
## 69-2 create add item form using react hook from .


______________________________
## 69-3 Design from using daisy ui and react hook form .


______________________________
## 69-4 Upload image to image hosting server imgBB and get image url
~ here i have learned uploading image to imgBB in a new method
--> {headers: {"content-type": 'multipart/form-data}}
~ 

______________________________
## 69-5 Save menu item to the server and make api secure
~ post a item doc to the mongodb


______________________________
## 69-6 create manage-items admin route and load all menu items


______________________________
## 69-7 Delete Menu item with verify admin middleware
    .
    .
    .
    .
    .
    . in this module last i worked with delete and update items by the admin.
    // TODO: IMPLEMENT UPDATE FUNCTIONALITY IN MANAGE ITEM PAGE
    ```````````````````````````````````````````````````````````` 
_______________________________________


////////////////////////////////
//   Final Project Part-7     //
////////////////////////////////

# Module 70: Final project part 7

____________________________
## 70-1 module overview and create payment route
~ know some info about payment system
~ created a payment route

____________________________
## 70-2 Install stripe in client, stripe for react and create card element
~ install stripe and stripe-react. follow a stripe docs minimal from github example and create a card element.


____________________________
## 70-3 Create Stripe account and use publishable Key.
~ stripe website > for developers(test mode) > get the pk.
~ Add functionality in the Checkout form component following the stripe docs.

|
* install stripe and stripe react * create card element * create stripe account and get publishable kay * use pk and use stripe to get card information and error
|

____________________________
## 70-4 Display card error and create server side payment intents
~ create a error state and display error message.
~ then go to react.js stripe and browse payment page.
~ install stripe node library in server.
~ create a post api in server which takes price and create a client secret and send with res. 
.
.
.
.
## 70-6 created payment:

____________________________
## 70-7 Save payment info and delete cart items in the database:
~ 
















*/