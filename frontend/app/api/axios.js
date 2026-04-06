/* 
Write this in notes:
register request body + success/failure response JSON
login request body + success/failure response JSON
me success/failure response JSON
What happens on page refresh
What happens when token expires
*/

Q1.

1)register

req body{
    name: "mantra patel",
    email : "patelmantra551@gmail.com",
    password : "Mantra@19."
}

success Response(201):
{
    success : true,
    message : "user has been registered succesufully",
    "data":
    {
        "user":{
            user_id : id,
            name:
            email:
        }
        token : JWT_TOKEN
    }
}

failure Response(400/409/500):
{
    sucesss : false,
    message :user already exists
}

