## Hotel Management System - backend

Daniel and Mathias final year project.

create .env.development file in source and add MONGODB_URI, JWT_SECRET, RESET_PASSWORD_SECRET

## To run

```bash
# development mode
$ npm run dev

# TypeScript compilation in watch mode (use in development mode)
$ npm run tsw

# TypeSript compilation (use to compile before going into production)
$ npm run ts

# production
$ npm start
```

## Supported routes

1. Auth routes
   - POST http://localhost:3000/auth/signup (signup)
   - POST http://localhost:3000/auth/signin (signin)
   - GET http://localhost:3000/auth/forget-password/olanrewaju@gmail.com (forget password)
   - POST http://localhost:3000/auth//reset-password/token (reset password)
   - POST http://localhost:3000/auth/contact-us (contact us)
   - POST http://localhost:3000/auth/newsletter (subscribe to newsletter)
2. User routes (authentication required)
   - POST http://localhost:3000/user/evaluation (submit evaluation)
   - GET http://localhost:3000/user/get-evaluation?emailAddress=user@email.com&all=false (get all evaluations or user specific evaluation. admin only route)
   - GET http://localhost:3000/user/contact-us (get all 'contact-us'. admin only route)
   - GET http://localhost:3000/user/newsletter (get users that signed up for newsletters. admin only route)
3. Room routes (authentication required)
   - POST http://localhost:3000/room/add-room (Add room. admin only route)
   - GET http://localhost:3000/room/rooms (get rooms)
   - PATCH http://localhost:3000/room/room (update room. admin only route)
   - POST http://localhost:3000/room/book-room (book room).
   - DELETE http://localhost:3000/room/remove-room/roomId (remove booked room)
   - GET http://localhost:3000/room/room (get booked rooms)
