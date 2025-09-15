Library Management System (Task 1 Adv)

This is a simple educational project that simulates an Electronic Library Management System using JavaScript (OOP) only, without any external libraries.

Features

Display a list of books as cards (title, author, category, availability).
A search bar to filter books by title or author.
A dropdown menu to filter books by category.
A button to toggle the availability status (Available / Not Available).
Ability to add or remove books.

Code Structure
Class Book

Properties:
#title
#author
#category
#isAvailable

Methods:
getTitle(), getAuthor(), getCategory(), isAvailable()
toggleAvailability()
displayInfo()
Class ReferenceBook (Inheritance)
Inherits from Book.
Adds the property #locationCode.
Overrides displayInfo() to show additional information (Polymorphism).

Class Library

Properties:
#books = []

Methods:
addBook(book) → Add a book.
removeBook(title) → Remove a book.
searchBooks(query) → Search by title or author.
filterByCategory(category) → Filter by category.
toggleAvailability(title) → Change availability status.
getBooks() → Return all books.

Technologies Used
HTML: Page structure.
CSS: Styling.
JavaScript (OOP): Logic implementation.