require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import des packages necessaires à Mailgun
const Mailgun = require("mailgun.js");
const formData = require("form-data");

const app = express();
app.use(express.json());
app.use(cors());

// -- création du client mailgun
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  // Le nom que vous voulez
  username: "LABAT",
  key: process.env.MAILGUN_API_KEY,
});

app.get("/", (req, res) => {
  console.log("route /");

  res.status(200).json({
    message: "Welcome",
  });
});

app.post("/form", async (req, res) => {
  // console.log("route form test");

  //   console.log(process.env.MAILGUN_API_KEY);
  //   console.log(req.body);

  //   -- Destructuration du body
  const { firstname, lastname, email, subject, message } = req.body;

  //   -- création du message
  const messageData = {
    from: `${firstname} ${lastname} <${email}>`,
    // -- Dois être l'un des emails valider de votre sandbox
    to: "labat.isabelle@gmail.com",
    subject: "Contact form",
    subject: `${subject}`,
    text: message,
  };

  //   -- Avec la syntaxe async/await et try/catch
  try {
    const response = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );

    console.log(response);

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server has server🤓");
});
