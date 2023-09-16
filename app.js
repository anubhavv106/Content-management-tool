const express = require('express');
const path = require('path');
const app = express();
const port = 8000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// mongoose Connection
mongoose.connect('mongodb://127.0.0.1:27017/content', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define mongoose Schema
const contactSchema = new mongoose.Schema({
  blogTitle: String,
  authorName: String,
  date: String,
  imgLink: String,
  blogContent: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// Express Specific Stuff
app.use(
  express.static('public', {
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    },
  })
);

// Use body-parser for parsing POST request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoints
app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/contact', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.post('/contact', (req, res) => {
    const myData = new Contact(req.body);
    myData
      .save()
      .then(() => {
        // Redirect to contact.html with query parameter
        res.redirect(`/contact.html?success=true&blogTitle=${req.body.blogTitle}&authorName=${req.body.authorName}`);
      })
      .catch((error) => {
        console.error('Error saving data:', error);
        // Handle errors here, and maybe display an error message
        res.status(400).send(`<script>alert("Item was not saved to the database: ${error.message}");</script>`);
      });
  });

// START THE SERVER
app.listen(port, () => {
  console.log(`The application started successfully on port ${port}`);
});
