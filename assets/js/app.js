
// app.js
// Library Management System using OOP (ES2020+ features)

// ------------------
// Book class (Encapsulation & Abstraction)
// ------------------
class Book {
  // private fields
  #id;
  #title;
  #author;
  #category;
  #isAvailable;

  constructor({ title, author, category, isAvailable = true }) {
    this.#id = Book.generateId();
    this.#title = title;
    this.#author = author;
    this.#category = category;
    this.#isAvailable = !!isAvailable;
  }

  // static id generator
  static generateId() {
    return 'b_' + Math.random().toString(36).slice(2, 9);
  }

  // getters - controlled access (abstraction)
  getId() { 
      return this.#id;
    }
  getTitle() {
    return this.#title;
  }
  getAuthor() {
    return this.#author;
  }
  getCategory() {
    return this.#category;
  }
  isAvailable() {
    return this.#isAvailable;
  }

  // setters - controlled modification
  setTitle(val) {
    if(typeof val === 'string') this.#title = val;
  }
  setAuthor(val) {
    if(typeof val === 'string') this.#author = val;
  }
  setCategory(val) {
    if(typeof val === 'string') this.#category = val;
  }

  // toggle availability
  toggleAvailability() {
    this.#isAvailable = !this.#isAvailable;
  }

  // display info (polymorphism: can be overridden)
  displayInfo() {
    return `${this.getTitle()} — ${this.getAuthor()} (${this.getCategory()})`;
  }
}

// ------------------
// ReferenceBook extends Book (Inheritance + Polymorphism)
// ------------------
class ReferenceBook extends Book {
  #locationCode;

  constructor({ title, author, category, isAvailable = true, locationCode = '' }){
    super({ title, author, category, isAvailable });
    this.#locationCode = locationCode;
  }

  getLocationCode() {
    return this.#locationCode;
  }
  setLocationCode(val) {
    if(typeof val === 'string') this.#locationCode = val; 
  }

  // polymorphism - override
  displayInfo() {
    return `${this.getTitle()} — ${this.getAuthor()} (${this.getCategory()}) [Location: ${this.getLocationCode()}]`;
  }
}

// ------------------
// Library class - manages collection of books
// ------------------
class Library {
  #books;

  constructor(initial = []) {
    this.#books = [];
    initial.forEach(b => this.addBook(b));
  }

  addBook(book) {
    // accept raw object or Book instance
    if (book instanceof Book || book instanceof ReferenceBook) {
      this.#books.push(book);
    } else if (typeof book === 'object') {
      const instance = book.isReference
        ? new ReferenceBook(book)
        : new Book(book);
      this.#books.push(instance);
    }
  }

  removeBookById(id) {
    const idx = this.#books.findIndex(b => b.getId() === id);
    if (idx >= 0) this.#books.splice(idx, 1);
  }

  searchBooks(query) {
    const q = String(query).trim().toLowerCase();
    if(!q) {
      return [...this.#books];
    } 
    return this.#books.filter(b =>
      b.getTitle().toLowerCase().includes(q) ||
      b.getAuthor().toLowerCase().includes(q)
    );
  }

  filterByCategory(category){
    if(!category || category === 'all') {
      [...this.#books];
    }
    return this.#books.filter(b => b.getCategory() === category);
  }

  toggleAvailability(id) {
    const book = this.#books.find(b => b.getId() === id);
    if(book) book.toggleAvailability();
  }

  getAllBooks() {
    return [...this.#books]; 
  }

  getCategories() {
    const set = new Set(this.#books.map(b => b.getCategory()));
    return [...set].sort();
  }
}

// ------------------
// UI logic
// ------------------
const library = new Library([
  { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', category: 'Programming', isAvailable: true },
  { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', category: 'Programming', isAvailable: false },
  { title: 'Clean Code', author: 'Robert C. Martin', category: 'Software', isAvailable: true },
  { title: 'Encyclopedia of Plants', author: 'A. Botanist', category: 'Reference', isAvailable: true, isReference: true, locationCode: 'Ref-PL-03' },
]);

const booksContainer = document.getElementById('booksContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const addBookForm = document.getElementById('addBookForm');
const showAllBtn = document.getElementById('showAllBtn');

function renderCategories(){
  // clear then populate
  categoryFilter.innerHTML = '<option value="all">All categories</option>';
  library.getCategories().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

function renderBooks(books) {
  booksContainer.innerHTML = '';
  if(!books.length) {
    booksContainer.innerHTML = '<p>No books to show.</p>';
    return;
  }

  books.forEach(b => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.id = b.getId();

    const title = document.createElement('h3');
    title.textContent = b.getTitle();

    const author = document.createElement('div');
    author.className = 'meta';
    author.textContent = 'By ' + b.getAuthor();

    const category = document.createElement('div');
    category.className = 'meta category';
    category.textContent = b.getCategory();

    const availability = document.createElement('div');
    availability.className = 'meta';
    availability.innerHTML = 'Status: ' + (b.isAvailable() ? '<span class="available">Available</span>' : '<span class="unavailable">Unavailable</span>');

    const info = document.createElement('div');
    info.className = 'meta';
    info.textContent = b.displayInfo(); // polymorphic call

    const actions = document.createElement('div');
    actions.className = 'actions';

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'button btn-toggle';
    toggleBtn.textContent = b.isAvailable() ? 'Mark Unavailable' : 'Mark Available';
    toggleBtn.addEventListener('click', () => {
      library.toggleAvailability(b.getId());
      refreshUI();
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'button btn-remove';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      if(confirm(`Remove "${b.getTitle()}" by ${b.getAuthor()}?`)){
        library.removeBookById(b.getId());
        refreshUI();
      }
    });

    actions.appendChild(toggleBtn);
    actions.appendChild(removeBtn);

    card.appendChild(title);
    card.appendChild(info);
    card.appendChild(author);
    card.appendChild(category);
    card.appendChild(availability);
    card.appendChild(actions);

    booksContainer.appendChild(card);
  });
}

function refreshUI() {
  // apply current filters
  const q = searchInput.value.trim();
  const cat = categoryFilter.value;

  let results = library.searchBooks(q);
  results = results.filter(b => (cat === 'all' ? true : b.getCategory() === cat));
  renderBooks(results);
  renderCategories();
}

// event listeners
searchInput.addEventListener('input', () => refreshUI());
categoryFilter.addEventListener('change', () => refreshUI());
showAllBtn.addEventListener('click', () => {
  searchInput.value = '';
  categoryFilter.value = 'all';
  refreshUI();
});

addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const category = document.getElementById('category').value.trim() || 'General';
  const isReference = document.getElementById('isReference').checked;
  const locationCode = document.getElementById('locationCode').value.trim();

  const data = { title, author, category, isAvailable: true };
  if(isReference) {
    data.isReference = true;
    data.locationCode = locationCode || 'Ref-01';
  }

  library.addBook(data);

  // clear form
  addBookForm.reset();
  refreshUI();
});

// initial render
refreshUI();