const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const password = process.argv[2];

const url = `mongodb+srv://admin:${password}@moocwebdev.jjrpd.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length === 3) {
  console.log("phonebook:");

  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close();
  });
}

const contact = new Contact({
  name: process.argv[3],
  number: process.argv[4],
});

contact.save().then((result) => {
  console.log("contact saved!");
  console.log(result);
  mongoose.connection.close();
});
