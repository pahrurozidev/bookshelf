// variabel / db
const books = [];
const users = [];

// event
const RENDER_EVENT = "render-books";
const USER_EVENT = "user_event";

// local storage
const STORAGE_KEY = "BOOKS_APP";
const STORAGE_USER = "USER";

// form search
const imgSearch = document.querySelector('.img-search');
const formInputSeach = document.querySelector('.form-search input');
imgSearch.addEventListener('click', () => {
    formInputSeach.classList.toggle('img-search-toggle');
    imgSearch.classList.toggle('img-search-toleft');
})

// close
const close = document.querySelector('.close');
close.addEventListener('click', () => {
    const formEdit = document.querySelector('.form-edit');
    const formInput = document.querySelector('.form-input');
    const listItem = document.querySelector('.list-item');
    formEdit.style.visibility = 'hidden';
    formInput.style.position = 'relative';
    formInput.style.zIndex = '1';
    listItem.style.position = 'relative';
    listItem.style.zIndex = '1';
})

const closeFormUsername = document.querySelector('.btn-close');
closeFormUsername.addEventListener('click', () => {
    const formInput = document.querySelector('.form-input');
    const listItem = document.querySelector('.list-item');
    formInput.style.position = 'relative';
    formInput.style.zIndex = '1';
    listItem.style.position = 'relative';
    listItem.style.zIndex = '1';

     const usernameSection = document.querySelector('#username');
    usernameSection.style.visibility = 'hidden';
})

document.addEventListener("DOMContentLoaded", () => {
    const submitForm = document.getElementsByTagName('form')[0];
    const submitFormSeach = document.getElementsByTagName('form')[2];
    const submitformUsername = document.getElementsByTagName('form')[3];
    
    if (typeof (Storage)) {
        loadDataUser();
    }

    if (typeof (Storage)) {
        loadDataFromStorage();
    }

    submitformUsername.addEventListener('submit', (e) => {
        e.preventDefault();
        addUser();
        if (users.length == 1) {
            alert('Username berhasil ditambahkan!')
        } else if (users.length == 2) {
            alert('Username berhasil diubah!')
        }
        location.reload();
    })
    
    submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addBook();
    })

    submitFormSeach.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputSearch = document.querySelector('input[name=input-search]').value;

        if (inputSearch == '') {
            location.reload(); return;
        }

        loadDataFromStorage();
    })
})

function addUser() {
    const username = document.querySelector('.username').value;
    const id = generateId();

    const userObject = {
        id: id,
        username: username
    }

    users.push(userObject);
    document.dispatchEvent(new Event(USER_EVENT));
    saveUser();
}

function saveUser() {
    if (typeof (Storage)) {
        const parse = JSON.stringify(users);
        localStorage.setItem(STORAGE_USER, parse);
    } else {
        alert("Browser kamu tidak mendukung local storage");
    }
}

document.addEventListener(USER_EVENT, () => {
    const userLabel = document.querySelector('.user-label');
    for (userItem of users) {
        userLabel.innerText = userItem.username;
    }
    const formInput = document.querySelector('.form-input');
    const listItem = document.querySelector('.list-item');

    const usernameSection = document.querySelector('#username');
    usernameSection.style.visibility = 'hidden';

    formInput.style.position = 'relative';
    formInput.style.zIndex = '1';

    listItem.style.position = 'relative';
    listItem.style.zIndex = '1';
})

function editUser(userId) {
    const usernameSection = document.querySelector('#username');
    usernameSection.style.visibility = 'visible';

    const formInput = document.querySelector('.form-input');
    const listItem = document.querySelector('.list-item');

    formInput.style.position = 'relative';
    formInput.style.zIndex = '-1';

    listItem.style.position = 'relative';
    listItem.style.zIndex = '-1';

    const inputUsername = document.querySelector('.username');

    const user = findUser(userId);
    inputUsername.value = user.username
        const submitformUsername = document.getElementsByTagName('form')[3];
        submitformUsername.addEventListener('submit', (e) => {
            e.preventDefault();
            userUpdate(userId);
    })
}   

function findUser(userId) {
    for (userItem of users) {
        if (userItem.id == userId) {
            return userItem;
        }
    }
    return;
}

function userUpdate(userId) {
    const userTarget = findUserIndex(userId)
    if (userTarget === -1) {
        return;
    } else {
        users.splice(userTarget, 1);
    }
    saveUser();
}

function findUserIndex(userId) {
    for (index in users) {
        if (users[index].id === userId) {
            return index;
        }
    }
    return -1;
}

function loadDataUser() {
    const serializedData = localStorage.getItem(STORAGE_USER);
    const data = JSON.parse(serializedData);

    if (data != null) {
        for (userItem of data) {
            users.push(userItem);
        }
        document.dispatchEvent(new Event(USER_EVENT));
        const profile = document.querySelector('.profile');
        profile.addEventListener('click', () => {
            editUser(data[0].id);
        })
    } else {
        return;
    }
}

function generateId() {
    return +new Date();
}

function addBook() {
    const id = generateId();
    let title = document.querySelector('input[name=judul]').value;
    const author = document.querySelector('input[name=penulis]').value;
    const year = document.querySelector('select[name=tahun]').value;

        const bookObject = {
            id: id,
            title: title,
            author: author,
            year: year,
            isCompleted: false
    };   

    const cbSelesai = document.querySelector('#selesai');
    if (cbSelesai.checked == true) {
        bookObject.isCompleted = true;
    }
    
    books.push(bookObject)

    const submitForm = document.getElementsByTagName('form')[0];
    submitForm.reset();
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData("insert-success");

}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.querySelector('.uncompleted');
    uncompletedBookList.innerHTML = "";

    const completedBookList = document.querySelector('.completed');
    completedBookList.innerHTML = "";

    for (bookItems of books) {
        const bookElement = makeBook(bookItems);
        if (bookItems.isCompleted == false) {
            uncompletedBookList.append(bookElement);
        } else {
            completedBookList.append(bookElement);
        }
    }
})

function loadDataFromStorage() {
    const uncompletedBookList = document.querySelector('.uncompleted');
    uncompletedBookList.innerHTML = "";

    const completedBookList = document.querySelector('.completed');
    completedBookList.innerHTML = "";

    const inputSearch = document.querySelector('input[name=input-search]').value;

    const serializedData = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(serializedData);

    if (inputSearch != "") {
        for (let bookItems of data) {
            if (bookItems.title == inputSearch) {
                const bookElement = makeBook(bookItems);
                if (bookItems.isCompleted == false) {
                    uncompletedBookList.append(bookElement);
                } else {
                    completedBookList.append(bookElement);
                }
            }
        }
        return;
    }

    if (data !== null) {
        for (bookItems of data) {
            books.push(bookItems);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
    const textTitle = document.createElement('h4');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `${bookObject.author} (${bookObject.year})`;

    const textContainer = document.createElement('div');
    textContainer.classList.add('.text');
    textContainer.append(textTitle, textAuthor);

    const container = document.createElement('div');
    container.classList.add('item');
    container.append(textContainer);

    if (bookObject.isCompleted == false) {
        // check
        const checkButton = document.createElement('img');
        checkButton.setAttribute('src', 'assets/check.svg');
        checkButton.addEventListener('click', () => {
            addTaskToCompleted(bookObject.id);
        })

        // edit
        const editButton = document.createElement('img');
        editButton.setAttribute('src', 'assets/edit.svg');
        editButton.addEventListener('click', () => {
            editBook(bookObject.id);
        })

        // remove
        const trashButton = document.createElement('img');
        trashButton.setAttribute('src', 'assets/trash-2.svg');
        trashButton.addEventListener('click', () => {
            const req = confirm('yakin ingin hapus?');
            if (req == false) {
                return;
            }
            removeTaskFromCompleted(bookObject.id);
        })

        const btn = document.createElement('div');
        btn.classList.add('button');

        btn.append(checkButton, editButton, trashButton);

        container.append(btn);
    } else {
        // undo
        const undoButton = document.createElement('img');
        undoButton.setAttribute('src', 'assets/refresh-cw.svg');
        undoButton.addEventListener('click', () => {
            undoTaskFromCompleted(bookObject.id);
        })

        // remove
        const trashButton = document.createElement('img');
        trashButton.setAttribute('src', 'assets/trash-2.svg');
        trashButton.addEventListener('click', () => {
            const req = confirm('yakin ingin hapus?');
            if (req == false) {
                return;
            }
            removeTaskFromCompleted(bookObject.id);
        })

        const btn = document.createElement('div');
        btn.classList.add('button');

        btn.append(undoButton, trashButton);

        container.append(btn);
    }

    return container;
}

function findBook(bookId) {
    for (bookItems of books) {
        if (bookItems.id === bookId) {
            return bookItems;
        }
    }

    return null;
}

function editBook(bookId) {
    const formEdit = document.querySelector('.form-edit');
    formEdit.style.visibility = 'visible';

    const formInput = document.querySelector('.form-input');
    const listItem = document.querySelector('.list-item');
    formInput.style.position = 'relative';
    formInput.style.zIndex = '-1';

    listItem.style.position = 'relative';
    listItem.style.zIndex = '-1';

    formEdit.style.position = 'absolute';
    formEdit.style.zIndex = '1';

    const bookTarget = findBook(bookId);
    
    const title = document.querySelector('.judul');
    title.value = bookTarget.title;
    
    const author = document.querySelector('.penulis');
    author.value = bookTarget.author;

    const year = document.querySelector('.tahun');
    year.value = bookTarget.year;

    const submitFormEdit = document.getElementsByTagName('form')[1];
    
    submitFormEdit.addEventListener('submit', (e) => {
        e.preventDefault();
        
    const titleEdit = document.querySelector('.judul').value;
    const authorEdit = document.querySelector('.penulis').value;
    const yearEdit = document.querySelector('#tahunEdit').value;
    const id = generateId();
        
    const bookObject = {
        id: id,
        title: titleEdit,
        author: authorEdit,
        year: yearEdit,
        isCompleted: bookTarget.isCompleted
        };
        
    const cbSelesai = document.querySelector('#selesaiEdit');
    if (cbSelesai.checked == true) {
        bookObject.isCompleted = true;
    }
    
    
    books.push(bookObject)

    // submitFormEdit.reset();

    document.dispatchEvent(new Event(RENDER_EVENT));
    
    removeTaskFromCompleted(bookTarget.id);
        
    formEdit.style.visibility = 'hidden';
    const formInput = document.querySelector('.form-input');
    const listItem = document.querySelector('.list-item');
    formInput.style.position = 'relative';
    formInput.style.zIndex = '1';
    listItem.style.position = 'relative';
    listItem.style.zIndex = '1';
        
        saveData('update-success');
        
    setTimeout(() => {
        location.reload(); return;
    }, 2000);
})
}

function addTaskToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) {
        return;
    }

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    
    saveData();
}

function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) {
        return;
    }

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
}

function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) {
        return;
    } else {
        books.splice(bookTarget, 1);
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData('delete-success');
}


function findBookIndex(bookId) {
    for (index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}


function saveData(message) {
    if (typeof(Storage)) {
        const parse = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parse)
    } else {
        alert("Browser kamu tidak mendukung local storage");
    }
    flashMessage(message);
}

function flashMessage(message) {
    if (message == 'insert-success') {
        const message = document.querySelector('#message');
        const flashMessage = document.querySelector('.flash-message');
        flashMessage.innerHTML = "";

        const textp = document.createElement('p');
        textp.innerText = 'Data buku berhasil ditambahkan';
        const img = document.createElement('img');
        img.setAttribute('src', 'assets/x.svg');
        flashMessage.append(textp, img);
    
        message.style.top = "4em";
        message.style.webkitTransform = "translateX(-50%)";
        message.style.transform = "translateX(-50%)";
        message.style.left = "50%";
   
        img.addEventListener('click', () => {
            message.style.transform = "translateY(-5em)";
            message.style.left = "5.5%";
            message.style.opacity = "0";
        })
        message.style.opacity = "1";
    } else if (message == 'update-success') {
        const message = document.querySelector('#message');
        const flashMessage = document.querySelector('.flash-message');
        message.style.top = "4em";
        message.style.webkitTransform = "translateX(-50%)";
        message.style.transform = "translateX(-50%)";
        message.style.left = "50%";

        flashMessage.innerHTML = "";

        const textp = document.createElement('p');
        textp.innerText = 'Data buku berhasil diubah';
        const img = document.createElement('img');
        img.setAttribute('src', 'assets/x.svg');
        flashMessage.append(textp, img);
    

        img.addEventListener('click', () => {
            message.style.transform = "translateY(-5em)";
            message.style.left = "5.5%";
            message.style.opacity = "0";
        })
        message.style.opacity = "1";
    } else if (message == 'delete-success') {
        const message = document.querySelector('#message');
        const flashMessage = document.querySelector('.flash-message');
        message.style.top = "4em";
        message.style.webkitTransform = "translateX(-50%)";
        message.style.transform = "translateX(-50%)";
        message.style.left = "50%";

        flashMessage.innerHTML = "";

        const textp = document.createElement('p');
        textp.innerText = 'Data buku berhasil hapus';
        const img = document.createElement('img');
        img.setAttribute('src', 'assets/x.svg');
        flashMessage.append(textp, img);
    

        img.addEventListener('click', () => {
            message.style.transform = "translateY(-5em)";
            message.style.left = "5.5%";
            message.style.opacity = "0";
        })
        message.style.opacity = "1";
    }
}
