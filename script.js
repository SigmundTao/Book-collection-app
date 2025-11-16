const API_KEY = 'AIzaSyABeY9VBDmPih7W8nOf5zndu9I5MtF0wfQ';
const searchBtn = document.getElementById('search-btn');
const searchBar = document.getElementById('search-bar');
const pageHeader = document.getElementById('page-header');
const pageHolder = document.getElementById('page-holder');

let sortSelect;
let viewSelect;
let genreSelect;
let booksHolder;
let searchResultsContainer;
let locationSelect;

searchBtn.addEventListener('click', () => {
    searchBook()
})

const user = JSON.parse(localStorage.getItem('user')) || {books: [], genres: [], displayingBooks: [], locations: ['Physical Copy', 'Kindle']} 

let filteredBooks = [...user.books];

async function searchBook(){
    const bookTitle = searchBar.value;
    const searchURL = `https://www.googleapis.com/books/v1/volumes?q=${bookTitle}&key=${API_KEY}`

    const response = await fetch(searchURL);
    const data = await response.json();
    displaySearchResults(data)
}

function displaySearchResults(data){
    console.log(data)
    if (!searchResultsContainer) {
        searchResultsContainer = document.createElement('div');
        searchResultsContainer.classList.add('search-results-container');
        pageHolder.innerHTML = '';
        pageHolder.appendChild(searchResultsContainer);
    }
    
    searchResultsContainer.innerHTML = '';

    data.items.forEach(book => {
        const bookTitle = book.volumeInfo.title || 'No title';
        const authors = book.volumeInfo.authors || ['Unknown author'];
        const description = book.volumeInfo.description || 'No description';
        const identifiers = book.volumeInfo.industryIdentifiers || [];
        const language = book.volumeInfo.language || 'N/A';
        const categories = book.volumeInfo.categories || [];
        const image = book.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg';
        const averageRating = book.volumeInfo.averageRating;
        const id = book.id;
        const publishedDate = book.volumeInfo.publishedDate;

        const result = document.createElement('div');
        result.classList.add('search-result');

        result.addEventListener('click', function(){
            loadBookPage(bookTitle, authors, description, language, categories, image, identifiers, id, averageRating, publishedDate)
        })

        const resultImage = document.createElement('div');
        resultImage.style.backgroundImage = `url(${image})`;
        resultImage.classList.add('search-result-img');
        
        const title = document.createElement('h2');
        title.innerText = bookTitle;

        const authorsHolder = document.createElement('div');
        authors.forEach(person => {
           const contributer = document.createElement('div');
           contributer.classList.add('search-result-author');
           contributer.innerText = person;

           authorsHolder.appendChild(contributer);
        })

        const descriptionHolder = document.createElement('p');
        descriptionHolder.innerText = description;

        const languageHolder = document.createElement('div');
        languageHolder.classList.add('search-result-language-holder');
        languageHolder.innerText = language;

        const categoriesHolder = document.createElement('div');
        categoriesHolder.classList.add('categories-holder');

        categories.forEach(catergory => {
            const c = document.createElement('div');
            c.classList.add('catergory');
            c.innerText = catergory;
            categoriesHolder.appendChild(c);
        })

        const identifiersHolder = document.createElement('div');

        identifiers.forEach(i => {
            const type = document.createElement('div');
            type.innerText = i.type;

            const id = document.createElement('div');
            id.innerText = i.identifier;

            const div = document.createElement('div');
            div.appendChild(type);
            div.appendChild(id);

            identifiersHolder.appendChild(div);
        })

        result.appendChild(resultImage);
        result.appendChild(title);
        result.appendChild(authorsHolder);
        result.appendChild(descriptionHolder);
        result.appendChild(languageHolder);
        result.appendChild(categoriesHolder);
        result.appendChild(identifiersHolder);

        searchResultsContainer.appendChild(result);
    });
}

function loadBookPage(title, authors, description, language, categories, image, identifiers, id, averageRating, publishedDate){
    pageHolder.innerHTML = '';
    
    const bookPageContainer = document.createElement('div');
    bookPageContainer.classList.add('book-page-container');
    
    const authorsArray = authors;
    const bookCoverURL = image;

    const leftSideHolder = document.createElement('div');
    leftSideHolder.classList.add('book-page-left');

    const bookCover = document.createElement('div');
    bookCover.classList.add('book-page-cover');
    bookCover.style.backgroundImage = `url(${bookCoverURL})`;

    leftSideHolder.appendChild(bookCover);

    const rightSideHolder = document.createElement('div');
    rightSideHolder.classList.add('book-page-right');

    const bookTitle = document.createElement('div');
    bookTitle.classList.add('book-page-title');
    bookTitle.innerText = title;
    rightSideHolder.appendChild(bookTitle);

    const authorsHolder = document.createElement('div');
    rightSideHolder.appendChild(authorsHolder);
    authorsArray.forEach(author => {
        const authorCard = document.createElement('div');
        authorCard.classList.add('author-card');
        authorCard.innerText = author;
        authorsHolder.appendChild(authorCard);
    });

    const categoriesHolder = document.createElement('div');
    rightSideHolder.appendChild(categoriesHolder);
    categories.forEach(category => {
        const genreCard = document.createElement('div');
        genreCard.classList.add('book-page-category');
        genreCard.innerText = category;
        categoriesHolder.appendChild(genreCard);
    })

    const bookDescription = document.createElement('p');
    bookDescription.innerText = description;
    bookDescription.classList.add('book-page-description');
    rightSideHolder.appendChild(bookDescription);

    const languageHolder = document.createElement('div');
    languageHolder.classList.add('book-page-language-holder');
    rightSideHolder.appendChild(languageHolder);

    const langTitle = document.createElement('div');
    langTitle.innerText = 'Lang:';
    langTitle.classList.add('book-page-lang-title');
    languageHolder.appendChild(langTitle);

    const bookLanguage = document.createElement('div');
    bookLanguage.innerText = language;
    languageHolder.appendChild(bookLanguage);

    const identifiersArray = identifiers;
    const identifiersHolder = document.createElement('div');
    rightSideHolder.appendChild(identifiersHolder);

    identifiersArray.forEach(i => {
        const type = document.createElement('div');
        type.innerText = i.type;

        const id = document.createElement('div');
        id.innerText = i.identifier;

        const div = document.createElement('div');
        div.appendChild(type);
        div.appendChild(id);

        identifiersHolder.appendChild(div);
    })

    const addBookBtn = document.createElement('button');
    addBookBtn.classList.add('add-book-btn');
    addBookBtn.innerText = '+';
    leftSideHolder.appendChild(addBookBtn);

    addBookBtn.addEventListener('click', () => {
        addBook({
            title: title,
            cover: image,
            categories: categories,
            description: description,
            language: language,
            identifiers: identifiers,
            id: id,
            rating: averageRating,
            publishedDate: publishedDate,
            dateAdded: new Date().toISOString(),
            location: 'Physical Copy',
        })
    })

    const quitBtn = document.createElement('button');
    quitBtn.innerText = 'X';
    quitBtn.classList.add('book-page-quit-btn');
    leftSideHolder.appendChild(quitBtn);

    quitBtn.addEventListener('click', () => {
        generateLibraryPage();
    })
    
    bookPageContainer.appendChild(leftSideHolder);
    bookPageContainer.appendChild(rightSideHolder);
    pageHolder.appendChild(bookPageContainer);
}

function addBook(bookObj){
    if(user.books.findIndex(book => book.id === bookObj.id) !== -1){
        alert('Book already in library!');
    } else {
        user.books.push(bookObj);
        updateUserData();
        updateUserGenres();
        generateLibraryPage();
    }
}

function generateLibraryPage(){
    pageHolder.innerHTML = '';
    
    const libraryPage = document.createElement('div');
    libraryPage.classList.add('library-page');

    const titleSection = document.createElement('div');
    titleSection.innerText = 'My Books';
    titleSection.classList.add('title-section');
    libraryPage.appendChild(titleSection);

    const filterBar = document.createElement('div');
    filterBar.classList.add('filter-bar');
    libraryPage.appendChild(filterBar);

    const sortContainer = document.createElement('div');
    sortContainer.classList.add('sort-container');
    filterBar.appendChild(sortContainer);

    sortSelect = document.createElement('select');
    sortSelect.classList.add('sort-select');
    sortSelect.innerHTML = `
        <option>A-Z</option>
        <option>Z-A</option>
        <option>Publish Date (old - new)</option>
        <option>Publish Date (new - old)</option>
        <option>Date Added (old - new)</option>
        <option>Date Added (new - old)</option>
    `;
    sortContainer.appendChild(sortSelect);

    const viewContainer = document.createElement('div');
    viewContainer.classList.add('view-container');
    filterBar.appendChild(viewContainer);

    viewSelect = document.createElement('select');
    viewSelect.classList.add('view-select');
    viewSelect.innerHTML = `
        <option>Grid View</option>
        <option>List View</option>
    `;
    viewContainer.appendChild(viewSelect);

    const genreContainer = document.createElement('div');
    genreContainer.classList.add('genre-container');
    filterBar.appendChild(genreContainer);

    genreSelect = document.createElement('select');
    genreSelect.classList.add('genre-select');
    genreContainer.appendChild(genreSelect);

    const locationContainer = document.createElement('div');
    filterBar.appendChild(locationContainer);
    locationSelect = document.createElement('select');
    locationSelect.classList.add('location-select');
    locationContainer.appendChild(locationSelect)

    const defaultLocation = document.createElement('option');
    defaultLocation.value = 'All Locations';
    defaultLocation.innerText = 'All Locations';
    locationSelect.appendChild(defaultLocation);

    user.locations.forEach(l => {
        const location = document.createElement('option');
        location.value = l;
        location.innerText = l;

        locationSelect.appendChild(location)
    })

    const addNewLocationBtn = document.createElement('button');
    addNewLocationBtn.innerText = 'add new location'
    filterBar.appendChild(addNewLocationBtn);
    
    booksHolder = document.createElement('div');
    booksHolder.classList.add('books-holder');
    libraryPage.appendChild(booksHolder);

    pageHolder.appendChild(libraryPage);

    sortSelect.addEventListener('change', () => {
        sortBooks(sortSelect.value);
    });

    viewSelect.addEventListener('change', () => {
        displayMyBooks();
    });

    genreSelect.addEventListener('change', () => {
        filterBooks();
    });

    locationSelect.addEventListener('change', () => {
        filterBooks();
    });

    const newLocationDialog = document.createElement('dialog');
    libraryPage.appendChild(newLocationDialog);

    const locationInput = document.createElement('input');
    locationInput.type = Text;
    newLocationDialog.appendChild(locationInput);

    const closeDialogBtn = document.createElement('button');
    closeDialogBtn.classList.add('close-dialog-btn');
    closeDialogBtn.innerText = 'x';
    newLocationDialog.appendChild(closeDialogBtn);
    closeDialogBtn.addEventListener('click', () => {
        closeDialog(newLocationDialog);
    })

    const saveNewLocationBtn = document.createElement('button');
    newLocationDialog.appendChild(saveNewLocationBtn);
    saveNewLocationBtn.innerText = 'Save';
    saveNewLocationBtn.addEventListener('click', () => {
        saveNewLocation(locationInput.value);
        closeDialog(newLocationDialog);
    })

    addNewLocationBtn.addEventListener('click', () => {addNewLocation(newLocationDialog)})

    fillGenreOptions();
    sortSelect.value = 'A-Z';
    sortBooks('A-Z');
}

function displayMyBooks(){
    booksHolder.innerHTML = '';
    displayView(viewSelect.value);
}

function deleteBook(bookID){
    const bookIndex = user.books.findIndex(e => e.id === bookID);
    user.books.splice(bookIndex, 1);
    updateUserData();
    updateUserGenres();
    sortBooks(sortSelect.value);
}

function oldToNewDateAddedSort(){
    user.books = [...user.books].sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
}

function newToOldDateAddedSort(){
    user.books = [...user.books].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
}

function aToZSort(){
    user.books = [...user.books].sort((a, b) => a.title.localeCompare(b.title, undefined, {sensitivity: 'base'}));
}

function zToASort(){
    user.books = [...user.books].sort((a, b) => b.title.localeCompare(a.title, undefined, {sensitivity: 'base'}));
}

function newToOldPubDateSort(){
    user.books = [...user.books].sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}

function oldToNewPubDateSort(){
    user.books = [...user.books].sort((a, b) => new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime());
}

function sortBooks(select){
    if(select === 'A-Z') aToZSort();
    else if(select === 'Z-A') zToASort();
    else if(select === 'Publish Date (old - new)') oldToNewPubDateSort();
    else if(select === 'Publish Date (new - old)') newToOldPubDateSort();
    else if(select === 'Date Added (old - new)') oldToNewDateAddedSort();
    else if(select === 'Date Added (new - old)') newToOldDateAddedSort();

    filterBooks();
}

function displayView(select){
    if(select === 'Grid View') displayGridView();
    else if(select === 'List View') displayListView();
}

function displayGridView(){
    booksHolder.innerHTML = '';

    const gridViewContainer = document.createElement('div');
    gridViewContainer.classList.add('grid-view-container');

    filteredBooks.forEach(b => {
        const book = document.createElement('div');
        book.classList.add('grid-view-book');

        const cover = document.createElement('div');
        cover.style.backgroundImage = `url(${b.cover})`;
        cover.classList.add('grid-view-cover');
        
        const title = document.createElement('h3');
        title.innerText = b.title;
        title.classList.add('grid-view-title');

        const removeBookBtn = document.createElement('button');
        removeBookBtn.innerText = 'x';
        removeBookBtn.classList.add('grid-view-remove-btn');

        removeBookBtn.addEventListener('click', () => {
            deleteBook(b.id);
        });

        book.appendChild(cover);
        book.appendChild(title);
        book.appendChild(removeBookBtn);

        gridViewContainer.appendChild(book);
    });
    
    booksHolder.appendChild(gridViewContainer);
}

function displayListView(){
    booksHolder.innerHTML = '';

    const listViewContainer = document.createElement('div');
    listViewContainer.classList.add('list-view-container');

    filteredBooks.forEach(b => {
        const book = document.createElement('div');
        book.classList.add('list-view-book');

        const cover = document.createElement('div');
        cover.style.backgroundImage = `url(${b.cover})`;
        cover.classList.add('list-view-cover');
        
        const title = document.createElement('h3');
        title.innerText = b.title;

        const removeBookBtn = document.createElement('button');
        removeBookBtn.innerText = 'x';

        removeBookBtn.addEventListener('click', () => {
            deleteBook(b.id);
        });

        book.appendChild(cover);
        book.appendChild(title);
        book.appendChild(removeBookBtn);

        listViewContainer.appendChild(book);
    });

    booksHolder.appendChild(listViewContainer);
}

function updateUserData(){
    localStorage.setItem('user', JSON.stringify(user));
}

function updateUserGenres(){
    user.genres = [];

    user.books.forEach(book => {
        book.categories.forEach(category => {
            if(!user.genres.includes(category)){
                user.genres.push(category);
            }
        });
    });

    updateUserData();
    
    if (genreSelect) {
        fillGenreOptions();
    }
}

function fillGenreOptions(){
    genreSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = 'All Genres';
    defaultOption.innerText = 'All Genres';
    genreSelect.appendChild(defaultOption);

    user.genres.forEach(genre => {
        const genreOption = document.createElement('option');
        genreOption.value = genre;
        genreOption.innerText = genre;
        genreSelect.appendChild(genreOption);
    });
}

function resetFilters(){
    filteredBooks = [...user.books]
    displayMyBooks()
}

function filterBooks(){
    filteredBooks = [...user.books];

    const selectedGenre = genreSelect.value;
    if(selectedGenre !== 'All Genres'){
        filteredBooks = filteredBooks.filter(b => b.categories.includes(selectedGenre));
    }
    
    const selectedLocation = locationSelect.value;
    if(selectedLocation !== 'All Locations'){
        filteredBooks = filteredBooks.filter(b => b.location === selectedLocation);
    } 

    displayMyBooks()
}

function addNewLocation(dialog){
    dialog.showModal();
}

function saveNewLocation(location){
    user.locations.push(location);
    updateUserData();
    generateLibraryPage();
}

function closeDialog(dialog){
    dialog.close();
}

generateLibraryPage();