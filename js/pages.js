import { createDiv, createLabel, createButton, createInput, createSelect, appendChildren, openDialog, closeDialog, debounce } from './helpers.js';
import { user, filteredBooks, updateFilteredBooks, genres, readingStatuses, addBook, deleteBook, addToWishlist, saveNewLocation, updateUserData } from './storage.js';
import { searchBook } from './api.js';
import { createBookCard, createLocationSelect, createBook } from './components.js';

let sortSelect;
let viewSelect;
let genreSelect;
let librarySearchBar;
let booksHolder;
let searchResultsContainer;
let locationSelect;
let readSelect;

export function generateLibraryPage(){
    const pageHolder = document.getElementById('page-holder');
    pageHolder.innerHTML = '';
    
    const libraryPage = createDiv('', 'library-page');

    const titleSection = createDiv('My Books', 'title-section');
    libraryPage.appendChild(titleSection);

    const filterBar = createDiv('', 'filter-bar');
    libraryPage.appendChild(filterBar);

    const sortContainer = createDiv('', 'sort-container');
    filterBar.appendChild(sortContainer);

    const sortOptions = [
        'A-Z', 'Z-A', 'Publish Date (old - new)', 'Publish Date (new - old)',
        'Date Added (old - new)', 'Date Added (new - old)', 'Rating (High - Low)',
        'Rating (Low - High)'
    ];
    sortSelect = createSelect(sortOptions, 'sort-select');
    sortContainer.appendChild(sortSelect);

    const viewContainer = createDiv('', 'view-container');
    filterBar.appendChild(viewContainer);

    viewSelect = createSelect(['Grid View', 'List View'], 'view-select');
    viewContainer.appendChild(viewSelect);

    const genreContainer = createDiv('', 'genre-container');
    filterBar.appendChild(genreContainer);

    genreSelect = createSelect([], 'genre-select');
    genreContainer.appendChild(genreSelect);

    const readSelectChildren = ['Read/Reading/Unread'];
    readingStatuses.forEach(status => readSelectChildren.push(status));

    readSelect = createSelect(readSelectChildren, 'read-select');
    filterBar.appendChild(readSelect);

    const locationContainer = createDiv('', 'location-container');
    locationSelect = createLocationSelect(filterBooks);
    locationSelect.classList.add('location-select');
    locationContainer.appendChild(locationSelect);
    filterBar.appendChild(locationContainer);

    const defaultLocation = createDiv('All Locations', 'location-div');
    defaultLocation.classList.add('selected-location');
    defaultLocation.value = 'All Locations';
    locationSelect.appendChild(defaultLocation);
    defaultLocation.addEventListener('click', () => {
        document.querySelectorAll('.location-div').forEach(e => e.classList.remove('selected-location'));
        defaultLocation.classList.add('selected-location');
        filterBooks();
    });

    const addNewLocationBtn = createButton('Add New Location');
    filterBar.appendChild(addNewLocationBtn);

    librarySearchBar = createInput('text');
    librarySearchBar.placeholder = 'Search Book...';
    filterBar.appendChild(librarySearchBar);

    const debouncedFilter = debounce(filterBooks, 60);
    librarySearchBar.addEventListener("input", debouncedFilter);
    
    booksHolder = createDiv('', 'books-holder');
    libraryPage.appendChild(booksHolder);

    pageHolder.appendChild(libraryPage);

    sortSelect.addEventListener('change', () => sortBooks(sortSelect.value));
    viewSelect.addEventListener('change', displayMyBooks);
    genreSelect.addEventListener('change', filterBooks);
    readSelect.addEventListener('change', filterBooks);

    // Location dialog
    const newLocationDialog = document.createElement('dialog');
    libraryPage.appendChild(newLocationDialog);

    const locationInput = createInput('text', '');
    newLocationDialog.appendChild(locationInput);

    const closeDialogBtn = createButton('X', 'close-dialog-btn');
    newLocationDialog.appendChild(closeDialogBtn);
    closeDialogBtn.addEventListener('click', () => closeDialog(newLocationDialog));

    const saveNewLocationBtn = createButton('Save');
    newLocationDialog.appendChild(saveNewLocationBtn);
    saveNewLocationBtn.addEventListener('click', () => {
        if(saveNewLocation(locationInput.value)){
            closeDialog(newLocationDialog);
            generateLibraryPage();
        }
    });

    addNewLocationBtn.addEventListener('click', () => openDialog(newLocationDialog));

    const addNewBookBtn = createButton('+', 'add-new-book-btn');
    addNewBookBtn.addEventListener('click', loadSearchPage);
    libraryPage.appendChild(addNewBookBtn);

    const openWishlistBtn = createDiv('', 'open-wish-list-button');
    const heartImage = document.createElement('div');
    heartImage.classList.add('heart-img');
    heartImage.style.backgroundImage = `url('./heart.svg')`;
    openWishlistBtn.appendChild(heartImage);
    openWishlistBtn.addEventListener('click', generateWishListPage);
    libraryPage.appendChild(openWishlistBtn);

    fillGenreOptions();
    sortSelect.value = 'A-Z';
    sortBooks('A-Z');
}

export function loadSearchPage(){
    const pageHolder = document.getElementById('page-holder');
    pageHolder.innerHTML = '';
    
    const searchPage = createDiv();

    const searchBar = createInput('text');
    const searchButton = createButton('search');
    const addManuallyBtn = createButton('+');
    const exitToHomeBtn = createButton('X', 'exit-to-home-btn');
    
    exitToHomeBtn.addEventListener('click', generateLibraryPage);

    const children = [searchBar, searchButton, addManuallyBtn, exitToHomeBtn];
    appendChildren(children, searchPage);

    pageHolder.appendChild(searchPage);

    searchButton.addEventListener('click', async () => {
        const data = await searchBook(searchBar.value);
        displaySearchResults(data);
    });

    searchBar.addEventListener('keydown', async (event) => {
        if(event.key === 'Enter'){
            const data = await searchBook(searchBar.value);
            displaySearchResults(data);
        }
    });

    addManuallyBtn.addEventListener('click', manuallyAddBook);
    searchBar.focus();
}

export function generateWishListPage(){
    const pageHolder = document.getElementById('page-holder');
    pageHolder.innerHTML = '';

    const wishListPage = createDiv('', 'wish-list-page');
    const title = createLabel('Wishlist', 'h1');
    const bookHolder = createDiv('', 'wish-list-book-holder');
    const closeWishListBtn = createButton('X', 'close-wishlist-btn');

    const children = [title, bookHolder, closeWishListBtn];
    appendChildren(children, wishListPage);

    pageHolder.appendChild(wishListPage);

    closeWishListBtn.addEventListener('click', generateLibraryPage);

    user.wishlist.forEach(b => {
        const book = createBook(b);
        bookHolder.appendChild(book);

        const addToLibraryBtn = createButton('+');
        book.appendChild(addToLibraryBtn);

        addToLibraryBtn.addEventListener('click', () => {
            user.books.push(b);
            user.wishlist.splice(user.wishlist.findIndex(e => e.id === b.id), 1);
            updateUserData();
            generateWishListPage();
        });

        const removeBtn = createButton('X');
        removeBtn.addEventListener('click', () => {
            user.wishlist.splice(user.wishlist.findIndex(e => e.id === b.id), 1);
            updateUserData();
            generateWishListPage();
        });

        book.appendChild(removeBtn);
    });

    const addNewBookBtn = createButton('+', 'add-new-book-btn');
    addNewBookBtn.addEventListener('click', loadSearchPage);
    wishListPage.appendChild(addNewBookBtn);
}

// Helper functions for pages
function displaySearchResults(data){
    const pageHolder = document.getElementById('page-holder');
    pageHolder.innerHTML = '';
    
    if (!searchResultsContainer) {
        searchResultsContainer = createDiv('', 'search-results-container');
    }
    
    searchResultsContainer.innerHTML = '';
    pageHolder.appendChild(searchResultsContainer);

    const exitToHomeBtn = createButton('X', 'exit-to-home-btn');
    exitToHomeBtn.addEventListener('click', generateLibraryPage);
    searchResultsContainer.appendChild(exitToHomeBtn);

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

        const result = createDiv('', 'search-result');

        result.addEventListener('click', function(){
            loadBookPage(bookTitle, authors, description, language, categories, image, identifiers, id, averageRating, publishedDate);
        });

        const resultImage = createDiv('', 'search-result-img');
        resultImage.style.backgroundImage = `url(${image})`;
        
        const title = createLabel(bookTitle, 'h2');

        const authorsHolder = createDiv();
        authors.forEach(person => {
           const contributer = createDiv(person, 'search-result-author');
           authorsHolder.appendChild(contributer);
        });

        const descriptionHolder = document.createElement('p');
        descriptionHolder.innerText = description;

        const languageHolder = createDiv(language, 'search-result-language-holder');
        const categoriesHolder = createDiv('', 'categories-holder');

        categories.forEach(category => {
            const c = createDiv(category, 'category');
            categoriesHolder.appendChild(c);
        });

        const identifiersHolder = createDiv();
        identifiers.forEach(i => {
            const type = createDiv(i.type);
            const id = createDiv(i.identifier);
            const div = createDiv();
            div.appendChild(type);
            div.appendChild(id);
            identifiersHolder.appendChild(div);
        });

        const children = [
            resultImage,
            title,
            authorsHolder,
            descriptionHolder,
            languageHolder,
            categoriesHolder,
            identifiersHolder
        ];

        appendChildren(children, result);
        searchResultsContainer.appendChild(result);
    });
}

function loadBookPage(title, authors, description, language, categories, image, identifiers, id, averageRating, publishedDate){
    // Your existing loadBookPage code...
    // I'll skip this for brevity, but just copy it over
}

function manuallyAddBook(){
    // Your existing manuallyAddBook code...
}

function displayMyBooks(){
    booksHolder.innerHTML = '';
    displayView(viewSelect.value);
}

function displayView(select){
    if(select === 'Grid View') displayGridView();
    else if(select === 'List View') displayListView();
}

function displayGridView(){
    booksHolder.innerHTML = '';
    const gridViewContainer = createDiv('', 'grid-view-container');
    
    filteredBooks.forEach(book => {
        const bookCard = createBookCard(book, 'grid-view', deleteBook, openEditDialog);
        gridViewContainer.appendChild(bookCard);
    });
    
    booksHolder.appendChild(gridViewContainer);
}

function displayListView(){
    booksHolder.innerHTML = '';
    const listViewContainer = createDiv('', 'list-view-container');
    
    filteredBooks.forEach(book => {
        const bookCard = createBookCard(book, 'list-view', deleteBook, openEditDialog);
        listViewContainer.appendChild(bookCard);
    });
    
    booksHolder.appendChild(listViewContainer);
}

function openEditDialog(book){
    // Your existing openEditDialog code...
}

function sortBy(field, ascending = true) {
    user.books = [...user.books].sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        
        if (field === 'dateAdded' || field === 'publishedDate') {
            aVal = new Date(aVal).getTime();
            bVal = new Date(bVal).getTime();
        }
        
        if (field === 'title') {
            return ascending 
                ? aVal.localeCompare(bVal, undefined, {sensitivity: 'base'})
                : bVal.localeCompare(aVal, undefined, {sensitivity: 'base'});
        }
        
        return ascending ? aVal - bVal : bVal - aVal;
    });
}

function sortBooks(select) {
    const sortMap = {
        'A-Z': () => sortBy('title', true),
        'Z-A': () => sortBy('title', false),
        'Publish Date (old - new)': () => sortBy('publishedDate', true),
        'Publish Date (new - old)': () => sortBy('publishedDate', false),
        'Date Added (old - new)': () => sortBy('dateAdded', true),
        'Date Added (new - old)': () => sortBy('dateAdded', false),
        'Rating (High - Low)': () => sortBy('rating', false),
        'Rating (Low - High)': () => sortBy('rating', true)
    };
    
    sortMap[select]?.();
    filterBooks();
}

function filterBooks(){
    let filtered = [...user.books];

    const selectedGenre = genreSelect.value;
    if(selectedGenre !== 'All Genres'){
        filtered = filtered.filter(b => b.categories.includes(selectedGenre));
    }
    
    const selectedLocation = document.querySelector('.selected-location').innerText;
    if(selectedLocation !== 'All Locations'){
        filtered = filtered.filter(b => b.location === selectedLocation);
    }

    const readingStatus = readSelect.value;
    if(readingStatus !== 'Read/Reading/Unread'){
        filtered = filtered.filter(b => b.readStatus === readingStatus);
    }

    const search = librarySearchBar.value.trim().toLowerCase();
    if (search !== "") {
        filtered = filtered.filter(b =>
            b.title.toLowerCase().includes(search)
        );
    }

    updateFilteredBooks(filtered);
    displayMyBooks();
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