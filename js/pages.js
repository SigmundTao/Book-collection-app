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
    const filterBar = createDiv('', 'filter-bar');

    const sortContainer = createDiv('', 'sort-container');
    const sortOptions = [
        'A-Z', 'Z-A', 'Publish Date (old - new)', 'Publish Date (new - old)',
        'Date Added (old - new)', 'Date Added (new - old)', 'Rating (High - Low)',
        'Rating (Low - High)'
    ];
    sortSelect = createSelect(sortOptions, 'sort-select');
    sortContainer.appendChild(sortSelect);

    const viewContainer = createDiv('', 'view-container');
    viewSelect = createSelect(['Grid View', 'List View'], 'view-select');
    viewContainer.appendChild(viewSelect);

    const genreContainer = createDiv('', 'genre-container');
    genreSelect = createSelect([], 'genre-select');
    genreContainer.appendChild(genreSelect);

    const readSelectChildren = ['Read/Reading/Unread'];
    readingStatuses.forEach(status => readSelectChildren.push(status));
    readSelect = createSelect(readSelectChildren, 'read-select');

    const locationContainer = createDiv('', 'location-container');
    locationSelect = createLocationSelect(filterBooks);
    locationSelect.classList.add('location-select');
    locationContainer.appendChild(locationSelect);

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

    librarySearchBar = createInput('text');
    librarySearchBar.placeholder = 'Search Book...';

    const filterBarItems = [sortContainer, viewContainer, genreContainer, readSelect, locationContainer, addNewLocationBtn, librarySearchBar];
    appendChildren(filterBarItems, filterBar);

    const debouncedFilter = debounce(filterBooks, 60);
    librarySearchBar.addEventListener("input", debouncedFilter);
    
    booksHolder = createDiv('', 'books-holder');

    sortSelect.addEventListener('change', () => sortBooks(sortSelect.value));
    viewSelect.addEventListener('change', displayMyBooks);
    genreSelect.addEventListener('change', filterBooks);
    readSelect.addEventListener('change', filterBooks);

    // Location dialog
    const newLocationDialog = document.createElement('dialog');
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

    const openWishlistBtn = createDiv('', 'open-wish-list-button');
    const heartImage = document.createElement('div');
    heartImage.classList.add('heart-img');
    heartImage.style.backgroundImage = `url('./heart.svg')`;
    openWishlistBtn.appendChild(heartImage);
    openWishlistBtn.addEventListener('click', generateWishListPage);

    const libraryPageChildren = [titleSection, filterBar, booksHolder, newLocationDialog, addNewBookBtn, openWishlistBtn];
    appendChildren(libraryPageChildren, libraryPage);

    pageHolder.appendChild(libraryPage);

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

    user.wishlist.forEach(item => {
        const book = createBook(item);
        bookHolder.appendChild(book);

        const addToLibraryBtn = createButton('+');
        book.appendChild(addToLibraryBtn);

        addToLibraryBtn.addEventListener('click', () => {
            user.books.push(item);
            user.wishlist.splice(user.wishlist.findIndex(e => e.id === item.id), 1);
            updateUserData();
            generateWishListPage();
        });

        const removeBtn = createButton('X');
        removeBtn.addEventListener('click', () => {
            user.wishlist.splice(user.wishlist.findIndex(element => element.id === item.id), 1);
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
            const categoryElement = createDiv(category, 'category');
            categoriesHolder.appendChild(categoryElement);
        });

        const identifiersHolder = createDiv();
        identifiers.forEach(identifier => {
            const type = createDiv(identifier.type);
            const id = createDiv(identifier.identifier);
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
    const pageHolder = document.getElementById('page-holder');
    pageHolder.innerHTML = '';
    
    const bookPageContainer = createDiv('', 'book-page-container');
    
    const authorsArray = authors;
    const bookCoverURL = image;

    const leftSideHolder = createDiv('', 'book-page-left');

    const bookCover = createDiv('', 'book-page-cover');
    bookCover.style.backgroundImage = `url(${bookCoverURL})`;

    leftSideHolder.appendChild(bookCover);

    const rightSideHolder = createDiv('', 'book-page-right');

    const bookTitle = createDiv(title, 'book-page-title');
    rightSideHolder.appendChild(bookTitle);

    const authorsHolder = createDiv();
    rightSideHolder.appendChild(authorsHolder);
    authorsArray.forEach(author => {
        const authorCard = createDiv(author, 'author-card');
        authorsHolder.appendChild(authorCard);
    });

    const categoriesHolder = createDiv();
    rightSideHolder.appendChild(categoriesHolder);
    categories.forEach(category => {
        const genreCard = createDiv(category, 'book-page-category');
        categoriesHolder.appendChild(genreCard);
    });

    const bookDescription = document.createElement('p');
    bookDescription.innerText = description;
    bookDescription.classList.add('book-page-description');
    rightSideHolder.appendChild(bookDescription);

    const languageHolder = createDiv('', 'book-page-language-holder');
    rightSideHolder.appendChild(languageHolder);

    const langTitle = createDiv('Lang:', 'book-page-lang-title');
    languageHolder.appendChild(langTitle);

    const bookLanguage = createDiv(language);
    languageHolder.appendChild(bookLanguage);

    const identifiersArray = identifiers;
    const identifiersHolder = createDiv();
    rightSideHolder.appendChild(identifiersHolder);

    identifiersArray.forEach(i => {
        const type = createDiv(i.type);
        const idDiv = createDiv(i.identifier);
        const div = createDiv();
        div.appendChild(type);
        div.appendChild(idDiv);
        identifiersHolder.appendChild(div);
    });

    const addToWishListBtn = createButton('W');
    leftSideHolder.appendChild(addToWishListBtn);

    addToWishListBtn.addEventListener('click', () => {
        addToWishlist({
            title: title,
            cover: image,
            categories: categories,
            description: description,
            language: language,
            identifiers: identifiers,
            id: id,
            publishedDate: publishedDate,
            authors: authors,
        });
    });

    const addBookBtn = createButton('+', 'Add-book-btn');
    leftSideHolder.appendChild(addBookBtn);

    //add book dialog
    const addBookDialog = document.createElement('dialog');
    addBookDialog.id = 'add-book-dialog';
    bookPageContainer.appendChild(addBookDialog);

    const titleLabel = createLabel('Title:', 'h3');
    const dialogTitle = createInput('text', title);

    const dialogImage = createDiv('', 'add-book-dialog-image');

    const linkLabel = createLabel('Photo URL:', 'h3');
    const imageLink = createInput('text', image); 

    dialogImage.style.backgroundImage = `url(${imageLink.value})`;

    const ratingLabel = createLabel('BookRating', 'h3');
    const rating = createInput('number', '');
    rating.classList.add('add-book-rating', 'rating');
    rating.min = 0;
    rating.max = 10;
    rating.style.display = 'inline';

    const locationsLabel = createLabel('Location:');

    const locationsHolder = createSelect(user.locations);

    const readLabel = createLabel('Read Status', 'h3');

    const readStatusSelect = createSelect(readingStatuses, 'read-status-select');

    let noRating;

    readStatusSelect.addEventListener('change', () => {
        if(readStatusSelect.value === 'Unread'){
            ratingLabel.style.display = 'none';
            rating.style.display = 'none';
            noRating = true;
        } else {
            rating.style.display = 'block';
            ratingLabel.style.display = 'block';
            noRating = false;
        }
    });

    const saveBookBtn = createButton('Add Book');

    const closeAddBookDialogBtn = createButton('X', 'close-add-book-dialog-btn');

    const children = [
        titleLabel,
        dialogTitle,
        dialogImage,
        linkLabel,
        imageLink,
        ratingLabel,
        rating,
        locationsLabel,
        locationsHolder,
        readLabel,
        readStatusSelect,
        saveBookBtn,
        closeAddBookDialogBtn
    ];
    
    appendChildren(children, addBookDialog);

    saveBookBtn.addEventListener('click', () => {
        const ratingValue = noRating ? null : rating.value;

        if(addBook({
            title: dialogTitle.value,
            cover: imageLink.value,
            categories: categories,
            description: description,
            language: language,
            identifiers: identifiers,
            id: id,
            rating: ratingValue,
            readStatus: readStatusSelect.value,
            publishedDate: publishedDate,
            dateAdded: new Date().toISOString(),
            location: locationsHolder.value,
            authors: authors
        })){
            closeDialog(addBookDialog);
            generateLibraryPage();
        }
    });

    closeAddBookDialogBtn.addEventListener('click', () => {
        closeDialog(addBookDialog);
    });
    
    addBookBtn.addEventListener('click', () => {
        openDialog(addBookDialog);
    });

    const quitBtn = createButton('X', 'book-page-quit-btn');
    leftSideHolder.appendChild(quitBtn);

    quitBtn.addEventListener('click', () => {
        generateLibraryPage();
    });
    
    bookPageContainer.appendChild(leftSideHolder);
    bookPageContainer.appendChild(rightSideHolder);
    pageHolder.appendChild(bookPageContainer);
}

function manuallyAddBook(){
    const pageHolder = document.getElementById('page-holder');
    pageHolder.innerHTML = '';
    const manualAddBookPage = document.createElement('div');

    const title = createLabel('Title:', 'h3');
    const titleInput = createInput('text', '');

    const authorTitle = createLabel('Author:', 'h3');
    const authorInput = createInput('text', '');

    const coverDisplay = document.createElement('div');
    
    const imageLinkTitle = createLabel('Image Link:', 'h3');
    const imageLinkInput = createInput('text', '');

    const genreTitle = createLabel('Categories', 'h3');

    const genreHolder = createDiv();
    
    genres.forEach(genre => {
        const genreCard = createGenreCard(genre);
        genreHolder.appendChild(genreCard);
    });

    const descriptionTitle = createLabel('Description:', 'h3');

    const description = document.createElement('textarea');

    const ratingTitle = createLabel('Rating:', 'h3');

    const rating = createInput('number', '');
    rating.min = 1;
    rating.max = 10;

    const readStatusTitle = createLabel('Read Status:', 'h3');

    const readStatus = createSelect(readingStatuses);

    readStatus.value = 'Read';

    readStatus.addEventListener('change', () => {
        if(readStatus.value !== 'Read'){
            rating.style.display = 'none';
            ratingTitle.style.display = 'none';
        } else {
            rating.style.display = 'block';
            ratingTitle.style.display = 'block';
        }
    });

    const locationTitle = createLabel('Book Location:', 'h3');
    const locationsSelect = createLocationSelect();
    locationsSelect.classList.add('manual-location-select');

    const id = generateBookId();

    const langInputTitle = createLabel('Language:', 'h3');
    const languageInput = createInput('text', '');

    const saveBookBtn = createButton('save');

    const children = [
        title,
        titleInput,
        authorTitle,
        authorInput,
        coverDisplay,
        imageLinkTitle,
        imageLinkInput,
        genreTitle,
        genreHolder,
        descriptionTitle,
        description,
        readStatusTitle,
        readStatus,
        ratingTitle,
        rating,
        locationTitle,
        locationsSelect,
        langInputTitle,
        languageInput,
        saveBookBtn
    ];

    appendChildren(children, manualAddBookPage);

    pageHolder.appendChild(manualAddBookPage);

    let selectedGenres = [];

    saveBookBtn.addEventListener('click', () => {
        selectedGenres = [];
        document.querySelectorAll('.selected-genre').forEach(g => {
            selectedGenres.push(g.innerText);
        });

        if(addBook({
            title: titleInput.value,
            cover: imageLinkInput.value,
            categories: selectedGenres,
            description: description.value,
            language: languageInput.value,
            id: id,
            rating: rating.value,
            readStatus: readStatus.value,
            dateAdded: new Date().toISOString(),
            location: document.querySelector('.selected-location').innerText,
            authors: [authorInput.value],
        })){
            generateLibraryPage();
        }
    });
}

function openEditDialog(book){
    const pageHolder = document.getElementById('page-holder');
    const editBookDialog = document.createElement('dialog');

    const dialogDiv = createDiv('', 'dialog-div');
    editBookDialog.appendChild(dialogDiv);

    const title = createLabel('Title:', 'h3');
    const editBookTitle = createInput('text', book.title);
    const editBookPhoto = document.createElement('div');
    editBookPhoto.style.backgroundImage = `url(${book.cover})`;

    const link = createLabel('Book URL:', 'h3');
    const editBookLink = createInput('text', book.cover);

    const locationsDiv = createDiv();
    createSelectableLocations(locationsDiv, book);

    const readingStatusTitle = createLabel('Read Status:', 'h3');

    const unreadOrReadSelect = createSelect(readingStatuses);

    unreadOrReadSelect.value = book.readStatus;

    const bookRatingTitle = createLabel('Rating:', 'h3');

    const editBookRating = createInput('number', book.rating);
    editBookRating.max = 10;
    editBookRating.min = 1;

    const saveBtn = createButton('save');

    const dialogDivChildren = [title, editBookTitle, editBookPhoto, link, editBookLink, locationsDiv, readingStatusTitle, unreadOrReadSelect, bookRatingTitle, editBookRating, saveBtn];
    appendChildren(dialogDivChildren, dialogDiv);
    
    let noRating = true;

    if(book.readStatus !== 'Unread'){
        editBookRating.style.display = 'inline';
        bookRatingTitle.style.display = 'inline-block';
        noRating = false;
    } else {
        editBookRating.style.display = 'none';
        bookRatingTitle.style.display = 'none';
    }

    unreadOrReadSelect.addEventListener('change', () => {
        if(unreadOrReadSelect.value === 'Unread'){
            editBookRating.style.display = 'none';
            bookRatingTitle.style.display = 'none';
            noRating = true;
        } else {
            editBookRating.style.display = 'inline';
            bookRatingTitle.style.display = 'inline-block';
            noRating = false;
        }
    });

    saveBtn.addEventListener('click', () => {
        const bookIndex = user.books.findIndex(i => i.id === book.id);

        const ratingValue = noRating ? null : editBookRating.value;

        user.books[bookIndex].rating = ratingValue;
        user.books[bookIndex].readStatus = unreadOrReadSelect.value;
        user.books[bookIndex].cover = editBookLink.value;
        user.books[bookIndex].title = editBookTitle.value;
        user.books[bookIndex].location = document.querySelector('.selected-change-location').innerText;
        
        updateUserData();
        closeDialog(editBookDialog);
        displayMyBooks();
    });

    const closeDialogBtn = createButton('X');
    dialogDiv.appendChild(closeDialogBtn);

    closeDialogBtn.addEventListener('click', () => {
        closeDialog(editBookDialog);
    });

    pageHolder.appendChild(editBookDialog);
    openDialog(editBookDialog);
}

function generateRemoveLocations(removeLocationDialog){
    removeLocationDialog.innerHTML = '';

    const removeTitle = createLabel('Remove Location:', 'h2');

    removeLocationDialog.appendChild(removeTitle);

    user.locations.forEach(l => {
        const removeLocationCard = createDiv();
        
        const locationTitle = createLabel(l, 'h3');

        const removeBtn = createButton('X');

        removeLocationCard.appendChild(locationTitle);
        removeLocationCard.appendChild(removeBtn);

        removeLocationDialog.appendChild(removeLocationCard);

        removeBtn.addEventListener('click', () => {
            user.locations.splice(user.locations.findIndex(e => e === l), 1);
            updateUserData();
            generateRemoveLocations(removeLocationDialog);
        });
    });

    const closeBtn = createButton('Close Dialog');
    closeBtn.addEventListener('click', () => {
        closeDialog(removeLocationDialog);
        generateLibraryPage();
    });

    removeLocationDialog.appendChild(closeBtn);
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