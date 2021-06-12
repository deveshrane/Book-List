// Book Constructor
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}
// UI Constructor
function UI() { }
UI.prototype.addBookToList = function (book) {
    const list = document.getElementById('book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);
}
UI.prototype.showAlert = function (msg, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(msg));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    setTimeout(function () {
        document.querySelector('.alert').remove();
    }, 3000);
}
UI.prototype.deleteBook = function (target) {
    if (target.className === 'delete') {
        target.parentElement.parentElement.remove();
        const ui = new UI();
        ui.showAlert('Book removed', 'success');
    }
}
UI.prototype.clearFields = function () {
    document.getElementById('title').value = ' ';
    document.getElementById('author').value = ' ';
    document.getElementById('isbn').value = ' ';
}
// Storage constructor
function Store() { }
Store.prototype.getBooks = function () {
    let books;
    if (localStorage.getItem('books') === null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
}
Store.prototype.displayBook = function () {
    const store = new Store();
    const books = store.getBooks();
    books.forEach(function (book) {
        const ui = new UI;
        ui.addBookToList(book);
    });
}
Store.prototype.addBook = function (book) {
    const store = new Store();
    const books = store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
}
Store.prototype.removeBook = function (isbn) {
    const store = new Store();
    const books = store.getBooks();
    books.forEach(function (book, idx) {
        if (book.isbn === isbn) {
            books.splice(idx, 1);
        }
    });
    localStorage.setItem('books', JSON.stringify(books));
}
// Event Listener
document.addEventListener('DOMContentLoaded', Store.displayBook);
document.getElementById('book-form').addEventListener('submit', function (e) {
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value

    const book = new Book(title, author, isbn);
    const ui = new UI();
    if (title === ' ' || author === ' ' || isbn === ' ') {
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        ui.addBookToList(book);
        const store = new Store();
        store.addBook(book);
        ui.showAlert('Book Added!', 'success');
        ui.clearFields();
    }
    e.preventDefault();
});
document.getElementById('book-list').addEventListener('click', function (e) {
    const ui = new UI();
    ui.deleteBook(e.target);
    const store = new Store();
    store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    e.preventDefault();
});