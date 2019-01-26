const mongoose = require("mongoose");
const User = require("../models/user");

const dbtitle = "book-circle";
mongoose.connect(
  `mongodb://localhost/${dbtitle}`,
  { useNewUrlParser: true }
);

const users = [
  {
    firstname: "Britney",
    lastname: "Schmidt",
    email: "bs@b.com",
    password: "$2b$10$RmQeidHePiRX7YvmuPc7YO/VBO/lPLTh64rMwK.o2O6TnI7aRUxWO", // passwort: t
    picture: String,
    description: "hi. i'm britney. i like books about cats.",
    favorites: [
      {
        id: String,
        title: "Cats - the musical"
      },
      {
        id: String,
        title: "Cats, Cats, Cats"
      }
    ],
    friends: [
      {
        id: String
      }
    ]
  },
  {
    firstname: "Luise",
    lastname: "Schneider",
    email: "ls@l.com",
    password: "$2b$10$RmQeidHePiRX7YvmuPc7YO/VBO/lPLTh64rMwK.o2O6TnI7aRUxWO", // passwort: t
    picture: String,
    description: "hi. i'm Luise. i like books about dogs.",
    favorites: [
      {
        id: String,
        title: "Dogs - the musical"
      },
      {
        id: String,
        title: "Dogs, Dogs, Dogs"
      }
    ],
    friends: [
      {
        id: String
      }
    ]
  },
  {
    firstname: "Juli",
    lastname: "Zeh",
    email: "jz@j.com",
    password: "$2b$10$RmQeidHePiRX7YvmuPc7YO/VBO/lPLTh64rMwK.o2O6TnI7aRUxWO", // passwort: t
    picture: String,
    description: "hi. i'm juli. i like books about weird people.",
    favorites: [
      {
        id: String,
        title: "Weird People - the musical"
      },
      {
        id: String,
        title: "People, People, People"
      }
    ],
    friends: [
      {
        id: String
      }
    ]
  }
];

User.create(users, err => {
  if (err) {
    throw err;
  }
  console.log(`Created ${users.length} users`);
  mongoose.connection.close();
});
