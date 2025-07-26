const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());

const booksFile = path.join(__dirname, "books.json");

function loadBooks() {
  if (fs.existsSync(booksFile)) {
    return JSON.parse(fs.readFileSync(booksFile, "utf-8"));
  }
  return [];
}

function saveBooks(books) {
  fs.writeFileSync(booksFile, JSON.stringify(books, null, 2));
}

let books = loadBooks();

const getNextId = () => books.length + 1;

app.get("/api/books", (req, res) => {
  console.log("/api/books executed");
  res.json({
    data: books,
  });
});

app.get("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`/api/books/:id is executed`);
  const book = books.find((x) => x.id === id);
  res.json({
    data: book,
  });
});

app.delete("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex((x) => x.id === id);
  const deletedBook = books.splice(bookIndex, 1)[0];
  saveBooks(books);
  res.json({
    data: deletedBook,
  });
});

app.post("/api/books", (req, res) => {
  const { title, author, publicationYear } = req.body;

  const newBook = {
    id: getNextId(),
    title,
    author,
    publicationYear: parseInt(publicationYear),
  };

  books.push(newBook);
  saveBooks(books);

  res.json({
    data: newBook,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:3000`);
});
