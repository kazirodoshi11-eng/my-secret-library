// ======================================
// MY SECRET LIBRARY
// JavaScript Functionality
// ======================================

// 1. Get HTML elements
const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");

const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookCategory = document.getElementById("bookCategory");
const bookCover = document.getElementById("bookCover");
const bookStatus = document.getElementById("bookStatus");

const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

const totalBooks = document.getElementById("totalBooks");
const readingBooks = document.getElementById("readingBooks");
const finishedBooks = document.getElementById("finishedBooks");

// 2. Load books from LocalStorage
let books = [];

try {
  const savedBooks = localStorage.getItem("mySecretLibrary");
  books = savedBooks ? JSON.parse(savedBooks) : [];

  if (!Array.isArray(books)) {
    books = [];
  }
} catch (error) {
  books = [];
}

// 3. Save books to LocalStorage
function saveBooks() {
  localStorage.setItem("mySecretLibrary", JSON.stringify(books));
}

// 4. Add a new book
bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newBook = {
    id: Date.now().toString() + Math.random().toString(16).slice(2),
    title: bookTitle.value.trim(),
    author: bookAuthor.value.trim(),
    category: bookCategory.value.trim() || "Uncategorized",
    cover: bookCover.value.trim(),
    status: bookStatus.value,
  };

  if (!newBook.title || !newBook.author) {
    alert("Please enter the book title and author.");
    return;
  }

  books.push(newBook);

  saveBooks();
  displayBooks();

  bookForm.reset();
});

// 5. Display all books
function displayBooks() {
  bookList.replaceChildren();

  const searchText = searchInput.value.toLowerCase().trim();
  const selectedStatus = filterStatus.value;

  const filteredBooks = books.filter(function (book) {
    const matchesSearch =
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText);

    const matchesStatus =
      selectedStatus === "All" || book.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Show message when no books are found
  if (filteredBooks.length === 0) {
    const message = document.createElement("div");
    message.className = "empty-message";

    message.textContent =
      books.length === 0
        ? "Your bookshelf is waiting for its first story! 📚"
        : "No books found. Try another search! 🌷";

    bookList.appendChild(message);

    updateDashboard();
    return;
  }

  // Create a card for each book
  filteredBooks.forEach(function (book) {
    const card = document.createElement("div");
    card.className = "book-card";

    // Book cover
    if (book.cover) {
      const image = document.createElement("img");

      image.src = book.cover;
      image.alt = "Cover of " + book.title;

      image.addEventListener(
        "error",
        function () {
          const placeholder = document.createElement("div");
          placeholder.className = "cover-placeholder";
          placeholder.textContent = "📖";
          placeholder.setAttribute("aria-label", "Book cover unavailable");

          image.replaceWith(placeholder);
        },
        { once: true },
      );

      card.appendChild(image);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "cover-placeholder";
      placeholder.textContent = "📖";

      card.appendChild(placeholder);
    }

    // Book title
    const title = document.createElement("h3");
    title.textContent = book.title;
    card.appendChild(title);

    // Author
    const author = document.createElement("p");
    author.textContent = "By " + book.author;
    card.appendChild(author);

    // Category
    const category = document.createElement("p");
    category.textContent = "Category: " + book.category;
    card.appendChild(category);

    // Reading status
    const status = document.createElement("span");
    status.className = "book-status";
    status.textContent = book.status;
    card.appendChild(status);

    // Action buttons
    const actions = document.createElement("div");
    actions.className = "book-actions";

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      deleteBook(book.id);
    });

    actions.appendChild(deleteButton);
    card.appendChild(actions);

    bookList.appendChild(card);
  });

  updateDashboard();
}

// 6. Delete a book
function deleteBook(bookId) {
  const confirmed = confirm("Are you sure you want to delete this book?");

  if (!confirmed) {
    return;
  }

  books = books.filter(function (book) {
    return book.id !== bookId;
  });

  saveBooks();
  displayBooks();
}

// 7. Update dashboard statistics
function updateDashboard() {
  totalBooks.textContent = books.length;

  const currentlyReading = books.filter(function (book) {
    return book.status === "Reading";
  });

  const finished = books.filter(function (book) {
    return book.status === "Finished";
  });

  readingBooks.textContent = currentlyReading.length;
  finishedBooks.textContent = finished.length;
}

// 8. Search books
searchInput.addEventListener("input", displayBooks);

// 9. Filter books by status
filterStatus.addEventListener("change", displayBooks);

// 10. Display saved books when the website opens
displayBooks();
