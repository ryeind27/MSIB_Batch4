//Mendeklarasikan variabel yang akan digunakan untuk menyimpan data buku yang akan ditambahkan ke rak buku serta menyimpan data buku yang sudah ditambahkan ke rak buku ke dalam local storage menggunakan STORAGE_KEY.
const add_books = "add-book";
const save_book = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
const books = [];

const checkbox = document.getElementById("inputBookIsComplete");
const textSubmit = document.getElementById("textSubmit");

// Event Listener untuk mengubah kondisi checkbox selesai dibaca atau belum selesai dibaca buku yang akan ditambahkan ke rak
checkbox.addEventListener("change", () => {
  textSubmit.innerText = "";

  if (checkbox.checked) {
    textSubmit.innerText = "sudah selesai dibaca";
  } else {
    //tidak perlu ditulis karena defaultnya belum selesai dibaca
  }
});

//kondisi untuk browser jika tidak mendukung local storage
const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser anda tidak mendukung local Storage");
    return false;
  } else {
    return true;
  }
};

//Fungsi untuk menyimpan data ke local storage
document.addEventListener(save_book, () => {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

//Fungsi untuk memuat data dari local storage
document.addEventListener(add_books, () => {
  const uncompletedBook = document.getElementById("incompleteBookshelfList");
  uncompletedBook.innerHTML = "";

  const completedBook = document.getElementById("completeBookshelfList");
  completedBook.innerHTML = "";

  for (let item of books) {
    const element = makeBook(item);
    if (!item.isCompleted) {
      uncompletedBook.append(element);
    } else {
      completedBook.append(element);
    }
  }
});

//Fungsi untuk menambahkan data buku ke rak buku dan menyimpan data ke local storage serta menampilkan data buku ke rak buku
const addBook = () => {
  const judulBuku = document.getElementById("inputBookTitle").value;
  const penulisBuku = document.getElementById("inputBookAuthor").value;
  const tahunTerbit = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;

  document.dispatchEvent(new Event(add_books));

  const generatedId = generateId();
  const bookObject = generateBookObject(
    generatedId,
    judulBuku,
    penulisBuku,
    tahunTerbit,
    isCompleted
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(add_books));
  saveData();
};

const generateId = () => {
  return +new Date();
};

//Fungsi untuk menggenerate data buku yang akan ditambahkan ke rak buku
const generateBookObject = (id, judul, penulis, tahun, isCompleted) => {
  return {
    id,
    judul,
    penulis,
    tahun,
    isCompleted,
  };
};

//Fungsi untuk mencetak data buku yang akan ditambahkan ke rak buku ke dalam bentuk HTML Element (article) yang akan ditampilkan di rak buku (DOM) dan menambahkan tombol untuk menghapus buku dan menandai buku sudah dibaca atau belum dibaca.
const makeBook = (bookObject) => {
  const judulBuku = document.createElement("h3");
  judulBuku.innerText = bookObject.judul;

  const penulisBuku = document.createElement("p");
  penulisBuku.innerText = bookObject.penulis;

  const tahunTerbit = document.createElement("p");
  tahunTerbit.innerText = bookObject.tahun;

  const action = document.createElement("div");
  action.classList.add("action");

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(judulBuku, penulisBuku, tahunTerbit, action);
  article.setAttribute("id", `${bookObject.id}`);

  const btnDelete = document.createElement("button");
  btnDelete.classList.add("red");
  btnDelete.innerText = "Hapus";
  btnDelete.addEventListener("click", () => {
    removeBook(bookObject.id);
  });

  if (bookObject.isCompleted) {
    const btnUnread = document.createElement("button");
    btnUnread.classList.add("green");
    btnUnread.innerText = "Pindahkan ke Belum Selesai Dibaca";

    btnUnread.addEventListener("click", () => {
      unreadBook(bookObject.id);
    });

    action.append(btnUnread, btnDelete);
  } else {
    const btnRead = document.createElement("button");
    btnRead.classList.add("green");
    btnRead.innerText = "Pindahkan ke Selesai Dibaca";

    btnRead.addEventListener("click", () => {
      readBook(bookObject.id);
    });

    action.append(btnRead, btnDelete);
  }

  return article;
};

const removeBook = (bookId) => {
  if (findBookIndex(bookId) === -1) return;

  books.splice(findBookIndex(bookId), 1);
  document.dispatchEvent(new Event(add_books));
  saveData();
};

//Fungsi menandai buku sudah dibaca atau belum dibaca
const readBook = (bookId) => {
  if (findBook(bookId) === null) return;

  findBook(bookId).isCompleted = true;
  document.dispatchEvent(new Event(add_books));
  saveData();
};

const unreadBook = (bookId) => {
  if (findBook(bookId) === null) return;

  findBook(bookId).isCompleted = false;
  document.dispatchEvent(new Event(add_books));
  saveData();
};

//Fungsi untuk mengeksekusi pemindahan buku (sudah dibaca atau belum dibaca)
const findBook = (bookId) => {
  for (let item of books) {
    if (item.id === bookId) {
      return item;
    }
  }
  return null;
};

//Fungsi untuk mencari index dari sebuah buku untuk dihapus
const findBookIndex = (bookId) => {
  for (let i in books) {
    if (books[i].id === bookId) {
      return i;
    }
  }
  return -1;
};

//Fungsi untuk menyimpan data ke local storage
const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(save_book));
  }
};

//Fungsi untuk memuat data dari local storage
const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (let book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(add_books));
};
