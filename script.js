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
let readSelect;
let genres = ['Philosophy', 'Fiction', 'History', 'Geography', 'Horror', 'Novel', 'Non-fiction', 'Classic'];

const readingSatuses = ['Read', 'Reading', 'Unread'];

const user = JSON.parse(localStorage.getItem('user')) || {books: [], genres: [], locations: ['Bookshelf', 'Kindle'], wishlist: []} 

let filteredBooks = [...user.books];
/////////////// Element Creation Functions: ////////////////////
function createLabel(text, tag = 'h3'){
    const label = document.createElement(tag);
    label.innerText = text;
    return label;
}

function createInput(type = 'text', value = ''){
    const input = document.createElement('input');
    input.type = type;
    input.value = value

    return input;
}

function createButton(text, className){
    const btn = document.createElement('button');
    btn.innerText = text;
    if(className) btn.classList.add(className);

    return btn;
}

function createDiv(text, className){
    const div = document.createElement('div');
    if(text) div.innerText = text;
    if(className) div.classList.add(className);

    return div;
}

function appendChildren(childArray, parent){
    childArray.forEach(child => {
        parent.appendChild(child);
    })
}

function createSelect(options = [], className = '') {
    const select = document.createElement('select');
    if(className) select.classList.add(className);
    
    options.forEach(opt => {
        const option = document.createElement('option');
        option.innerText = opt;
        option.value = opt;
        select.appendChild(option);
    });
    
    return select;
}

function createLocationSelect(){
    const locationsHolder = document.createElement('div');

    user.locations.forEach(l => {
        const locationDiv = createDiv(l, 'location-div');
        locationDiv.value = l;
        locationsHolder.appendChild(locationDiv);

        locationDiv.addEventListener('click', () => {
            document.querySelectorAll('.location-div').forEach(e => e.classList.remove('selected-location'));
            locationDiv.classList.add('selected-location');
            if(genreSelect && readSelect) {
                filterBooks();
            }
        })
    })

    return locationsHolder;
}

function createBook(b){
    const book = createDiv('', 'book');
    
    const title = createLabel(b.title, 'h3');
    title.classList.add('book-title');
    
    const img = document.createElement('img');
    img.src = b.cover;
    img.alt = b.title;
    
    book.appendChild(title);
    book.appendChild(img);
    
    return book;
}

///////////// Searching and displaying books /////////////////////
async function searchBook(searchBar){
    try {
        const bookTitle = searchBar.value;
        const searchURL = `https://www.googleapis.com/books/v1/volumes?q=${bookTitle}&key=${API_KEY}`

        const response = await fetch(searchURL);
        const data = await response.json();
        displaySearchResults(data)
    } catch (error){
        console.error('Search error:', error);
        alert('Failed to search books. Please try again.');
    };
}

function displaySearchResults(data){
    pageHolder.innerHTML = '';
    if (!searchResultsContainer) {
        searchResultsContainer = createDiv('', 'search-results-container');
        pageHolder.innerHTML = '';
        pageHolder.appendChild(searchResultsContainer);
    }
    
    searchResultsContainer.innerHTML = '';
    pageHolder.appendChild(searchResultsContainer);

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
            loadBookPage(bookTitle, authors, description, language, categories, image, identifiers, id, averageRating, publishedDate)
        })

        const resultImage = createDiv('', 'search-result-img');
        resultImage.style.backgroundImage = `url(${image})`;
        
        const title = createLabel(bookTitle, 'h2');

        const authorsHolder = createDiv();
        authors.forEach(person => {
           const contributer = createDiv(person, 'search-result-author');

           authorsHolder.appendChild(contributer);
        })

        const descriptionHolder = document.createElement('p');
        descriptionHolder.innerText = description;

        const languageHolder = createDiv(language, 'search-result-language-holder');

        const categoriesHolder = createDiv('', 'categories-holder');

        categories.forEach(category => {
            const c = createDiv(category, 'category');
            categoriesHolder.appendChild(c);
        })

        const identifiersHolder = createDiv();

        identifiers.forEach(i => {
            const type = createDiv(i.type);

            const id = createDiv(i.identifier);

            const div = createDiv();
            div.appendChild(type);
            div.appendChild(id);

            identifiersHolder.appendChild(div);
        })

        const children = [
            resultImage,
            title,
            authorsHolder,
            descriptionHolder,
            languageHolder,
            categoriesHolder,
            identifiersHolder
        ]

        appendChildren(children, result);

        searchResultsContainer.appendChild(result);
    });
}

function loadBookPage(title, authors, description, language, categories, image, identifiers, id, averageRating, publishedDate){
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
    })

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

        const id = createDiv(i.identifier);

        const div = createDiv();
        div.appendChild(type);
        div.appendChild(id);

        identifiersHolder.appendChild(div);
    })

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
    })
    })

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

    const readLabel = createLabel('Read Status', 'h3')

    const readStatusSelect = createSelect(readingSatuses, 'read-status-select');

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
    })

    const numberOfCopies = createInput('number', 1);
    numberOfCopies.min = 1;
    numberOfCopies.max = 100;

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
    ]
    
    appendChildren(children, addBookDialog);

    saveBookBtn.addEventListener('click', () => {
        const ratingValue = noRating ? null : rating.value;

        addBook({
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
        })

        closeDialog(addBookDialog);
        generateLibraryPage()
    })

    closeAddBookDialogBtn.addEventListener('click', () => {
        closeDialog(addBookDialog);
    })
    
    addBookBtn.addEventListener('click', () => {
        openDialog(addBookDialog);
    });

    const quitBtn = createButton('X', 'book-page-quit-btn');
    leftSideHolder.appendChild(quitBtn);

    quitBtn.addEventListener('click', () => {
        generateLibraryPage();
    })
    
    bookPageContainer.appendChild(leftSideHolder);
    bookPageContainer.appendChild(rightSideHolder);
    pageHolder.appendChild(bookPageContainer);
}

function loadSearchPage(){
    pageHolder.innerHTML = '';
    const searchPage = createDiv();

    const searchBar = createInput('text');
    
    const searchButton = createButton('search');

    const addManuallyBtn = createButton('+');

    const children = [searchBar, searchButton, addManuallyBtn]
    appendChildren(children, searchPage)

    pageHolder.appendChild(searchPage);

    searchButton.addEventListener('click', () => {
        searchBook(searchBar);
    })

    searchBar.addEventListener('keydown', (event) => {
        if(event.key === 'Enter'){
            searchBook(searchBar);
        }
    })

    addManuallyBtn.addEventListener('click', () => {
        manuallyAddBook()
    })
}

//////////////////// Adding books ////////////////////////
function addBook(bookObj){
    if(!bookObj.title || !bookObj.title.trim()) {
        alert('Book must have a title');
        return;
    }
    if(user.books.findIndex(book => book.id === bookObj.id) !== -1){
        alert('Book already in library!');
    } else {
        user.books.push(bookObj);
        updateUserData();
        updateUserGenres();
        generateLibraryPage();
    }
}

function createGenreCard(genre){
    const genreCard = document.createElement('div');
    genreCard.classList.add('genreCard');

    genreCard.addEventListener('click', () => {
        genreCard.classList.toggle('selected-genre');
    })

    genreCard.innerText = genre;

    return genreCard;
}

function manuallyAddBook(){
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
        const genreCard = createGenreCard(genre)
        genreHolder.appendChild(genreCard);
    })

    const descriptionTitle = createLabel('Description:', 'h3');

    const description = document.createElement('textarea');

    const ratingTitle = createLabel('Rating:', 'h3');;

    const rating = createInput('number', '');
    rating.min = 1;
    rating.max = 10;

    const readStatusTitle = createLabel('Read Status:', 'h3');

    const readStatus = createSelect(readingSatuses);

    readStatus.value = 'Read';

    readStatus.addEventListener('change', () => {
        if(readStatus.value !== 'Read'){
            readStatus.display = 'none';
        } else {
            readStatus.display = 'block';
        }
    })

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
    ]

    appendChildren(children, manualAddBookPage);

    pageHolder.appendChild(manualAddBookPage);

    let selectedGenres = [];

    saveBookBtn.addEventListener('click', () => {
        selectedGenres = [];
        document.querySelectorAll('.selected-genre').forEach(g => {
            selectedGenres.push(g.innerText);
        })

        addBook({
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
        })
    })
}

function generateBookId(){
    let id = Math.random().toString(36).substring(2, 8);
    if(user.books.findIndex(e => e.id === id) !== -1){
        id += `${(Math.random() * 100) * (Math.random() * 100)}`
    }

    return id;
}

////////////////// Create Home Page /////////////////////////////////
function generateLibraryPage(){
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
    ]
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

    const readSelectChildren = ['Read/Reading/Unread']

    readingSatuses.forEach(status => {
        readSelectChildren.push(status)
    })

    readSelect = createSelect(readSelectChildren, 'read-select');

    filterBar.appendChild(readSelect);

    const removeLocationDialog = document.createElement('dialog');
    generateRemoveLocations(removeLocationDialog);

    libraryPage.appendChild(removeLocationDialog);

    const locationContainer = createDiv('', 'location-container');
    locationSelect = createLocationSelect()
    locationSelect.classList.add('location-select');
    locationContainer.appendChild(locationSelect)
    filterBar.appendChild(locationContainer);

    const defaultLocation = createDiv('All Locations', 'location-div');
    defaultLocation.classList.add('selected-location');
    defaultLocation.value = 'All Locations';
    locationSelect.appendChild(defaultLocation);
    defaultLocation.addEventListener('click', () => {
            document.querySelectorAll('.location-div').forEach(e => e.classList.remove('selected-location'));
            defaultLocation.classList.add('selected-location');
            filterBooks();
    })

    const addNewLocationBtn = createButton('Add New Location');
    filterBar.appendChild(addNewLocationBtn);

    const removeLocationBtn = createButton('Remove Location');
    filterBar.appendChild(removeLocationBtn);
    removeLocationBtn.addEventListener('click', () => {
        openDialog(removeLocationDialog)
    })
    
    booksHolder = createDiv('', 'books-holder');
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

    readSelect.addEventListener('change', () => {
        filterBooks();
    })

    locationSelect.addEventListener('click', () => {
    });

    const newLocationDialog = document.createElement('dialog');
    libraryPage.appendChild(newLocationDialog);

    const locationInput = createInput('text', '');
    newLocationDialog.appendChild(locationInput);

    const closeDialogBtn = createButton('X', 'close-dialog-btn');
    newLocationDialog.appendChild(closeDialogBtn);
    closeDialogBtn.addEventListener('click', () => {
        closeDialog(newLocationDialog);
    })

    const saveNewLocationBtn = createButton('Save');
    newLocationDialog.appendChild(saveNewLocationBtn);
    saveNewLocationBtn.addEventListener('click', () => {
        saveNewLocation(locationInput.value);
        closeDialog(newLocationDialog);
    })

    addNewLocationBtn.addEventListener('click', () => {openDialog(newLocationDialog)})

    const addNewBookBtn = createButton('+', 'add-new-book-btn');
    addNewBookBtn.addEventListener('click', () => {loadSearchPage()})

    libraryPage.appendChild(addNewBookBtn);

    const openWishlistBtn = createDiv('', 'open-wish-list-button');

    const heartImage = document.createElement('div');
    heartImage.classList.add('heart-img');
    heartImage.style.backgroundImage = `url('./heart.svg')`;
    openWishlistBtn.appendChild(heartImage);

    openWishlistBtn.addEventListener('click', generateWishListPage)

    libraryPage.appendChild(openWishlistBtn);

    fillGenreOptions();
    sortSelect.value = 'A-Z';
    sortBooks('A-Z');
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
        })
    })

    const closeBtn = createButton('Close Dialog')
    closeBtn.addEventListener('click', () => {
        closeDialog(removeLocationDialog);
        generateLibraryPage()
    })

    removeLocationDialog.appendChild(closeBtn);
}

/////////////////// Wishlist functionality ////////////////////////////////
function addToWishlist(book){
    if(user.books.findIndex(e => e.id === book.id) !== -1){
        alert('You already own this book!');
    }else if(user.wishlist.findIndex(e => e.id === book.id) === -1){
        user.wishlist.push(book)
        alert('Book added to wishlist!');
    } else {
        alert('Book already in wishlist!');
    }

    updateUserData()
}

function generateWishListPage(){
    pageHolder.innerHTML = '';

    const wishListPage = createDiv('', 'wish-list-page');

    const title = createLabel('Wishlist', 'h1');

    const bookHolder = createDiv('', 'wish-list-book-holder');

    const closeWishListBtn = createButton('X', 'close-wishlist-btn');

    const children = [title, bookHolder, closeWishListBtn];
    appendChildren(children, wishListPage);

    pageHolder.appendChild(wishListPage);

    closeWishListBtn.addEventListener('click', generateLibraryPage);

    //Wishlist book creation
    user.wishlist.forEach(b => {
        const book = createBook(b);
        bookHolder.appendChild(book);

        const addToLibraryBtn = createButton('+')

        book.appendChild(addToLibraryBtn);

        addToLibraryBtn.addEventListener('click', () => {
            user.books.push(b);
            user.wishlist.splice(user.wishlist.findIndex(e => e.id === b.id), 1);
            updateUserData()
            generateWishListPage()
        })

        const removeBtn = createButton('X');

        removeBtn.addEventListener('click', () => {
            user.wishlist.splice(user.wishlist.findIndex(e => e.id === b.id), 1);
            updateUserData()
            generateWishListPage()
        })

        book.appendChild(removeBtn);
    })

    const addNewBookBtn = createButton('+', 'add-new-book-btn');
    addNewBookBtn.addEventListener('click', () => {loadSearchPage()})

    wishListPage.appendChild(addNewBookBtn);
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

function displayView(select){
    if(select === 'Grid View') displayGridView();
    else if(select === 'List View') displayListView();
}

function getRatingColour(rating){
    if(rating <= 4) {return ['red', 'white']}
    else if(rating <= 6) {return ['orange', 'white']}
    else if(rating <= 10) {return ['green', 'white']}
    else if(rating === 10) {return ['darkgreen', 'white']}
}

function openEditDialog(book, container){
    const editBookDialog = document.createElement('dialog');

    const dialogDiv = createDiv('', 'dialog-div');
    editBookDialog.appendChild(dialogDiv);

    const title = createLabel('Title:', 'h3');
    const editBookTitle = createInput('text', book.title)
    const editBookPhoto = document.createElement('div');
    editBookPhoto.style.backgroundImage = `url(${book.cover})`;

    const link = createLabel('Book URL:', 'h3');
    const editBookLink = createInput('text', book.cover);

    const locationsDiv = createDiv();
    createSelectableLocations(locationsDiv, book);

    const readingStatusTitle = createLabel('Read Status:', 'h3');

    const undreadOrReadSelect = createSelect(readingSatuses);

    undreadOrReadSelect.value = book.readStatus;

    const bookRatingTitle = createLabel('Rating:', 'h3');

    const editBookRating = createInput('number', book.rating);
    editBookRating.max = 10;
    editBookRating.min = 1;

    const saveBtn = createButton('save');

    const dialogDivChildren = [title, editBookTitle, editBookPhoto, link, editBookLink, locationsDiv, readingStatusTitle, undreadOrReadSelect, bookRatingTitle, editBookRating, saveBtn]
    appendChildren(dialogDivChildren, dialogDiv)
    
    let noRating = true;

    if(book.readStatus !== 'Unread'){
        editBookRating.style.display = 'inline';
        bookRatingTitle.style.display = 'inline-block';
        noRating = false;
    } else {
        editBookRating.style.display = 'none';
        bookRatingTitle.style.display = 'none';
    }

    undreadOrReadSelect.addEventListener('change', () => {
        if(undreadOrReadSelect.value === 'Unread'){
            editBookRating.style.display = 'none';
            bookRatingTitle.style.display = 'none';
            noRating = true;
        } else {
            editBookRating.style.display = 'inline';
            bookRatingTitle.style.display = 'inline-block';
            noRating = false;
        }
    })

    saveBtn.addEventListener('click', () => {
        const bookIndex = user.books.findIndex(i => i.id === book.id);

        const ratingValue = noRating ? null : editBookRating.value;

        user.books[bookIndex].rating = ratingValue;
        user.books[bookIndex].readStatus = undreadOrReadSelect.value;
        user.books[bookIndex].cover = editBookLink.value;
        user.books[bookIndex].title = editBookTitle.value;
        user.books[bookIndex].location = document.querySelector('.selected-change-location').innerText
        
        updateUserData()
        closeDialog(editBookDialog);
        displayMyBooks()
    })

    const closeDialogBtn = createButton('X');
    dialogDiv.appendChild(closeDialogBtn);

    closeDialogBtn.addEventListener('click', () => {
        closeDialog(editBookDialog);
    })

    container.appendChild(editBookDialog);
    openDialog(editBookDialog)
}

function createBookCard(book, viewType) {
    const bookCard = createDiv('', `${viewType}-book`);
    
    const cover = createDiv('', `${viewType}-cover`);
    cover.style.backgroundImage = `url(${book.cover})`;
    
    const title = createLabel(book.title, 'h3');
    if(viewType === 'grid-view') {
        title.classList.add('grid-view-title');
    }
    
    const removeBtn = createButton('X');
    if(viewType === 'grid-view') {
        removeBtn.classList.add('grid-view-remove-btn');
    }
    removeBtn.addEventListener('click', () => deleteBook(book.id));
    
    if(book.rating) {
        const ratingClass = viewType === 'grid-view' ? 'book-rating' : 'list-book-rating';
        const ratingDiv = createDiv(book.rating, ratingClass);
        const [bgColor, textColor] = getRatingColour(book.rating);
        ratingDiv.style.backgroundColor = bgColor;
        ratingDiv.style.color = textColor;
        bookCard.appendChild(ratingDiv);
    }
    
    const readStatus = createDiv(book.readStatus || 'Unread');
    
    const bookCardChildren = [cover,title,readStatus,removeBtn]
    appendChildren(bookCardChildren, bookCard)

    if(viewType === 'grid-view' && book.authors && book.authors.length > 0) {
        const authorsHolder = document.createElement('h4');
        book.authors.forEach(author => {
            authorsHolder.innerText += `${author} `;
        });
        bookCard.insertBefore(authorsHolder, readStatus);
        
        const editBtn = createButton('Edit');
        editBtn.addEventListener('click', () => openEditDialog(book, booksHolder));
        bookCard.appendChild(editBtn);
    }
    
    return bookCard;
}

function displayGridView(){
    booksHolder.innerHTML = '';
    const gridViewContainer = createDiv('', 'grid-view-container');
    
    filteredBooks.forEach(book => {
        const bookCard = createBookCard(book, 'grid-view');
        gridViewContainer.appendChild(bookCard);
    });
    
    booksHolder.appendChild(gridViewContainer);
}

function displayListView(){
    booksHolder.innerHTML = '';
    const listViewContainer = createDiv('', 'list-view-container');
    
    filteredBooks.forEach(book => {
        const bookCard = createBookCard(book, 'list-view');
        listViewContainer.appendChild(bookCard);
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

function filterBooks(){
    filteredBooks = [...user.books];

    const selectedGenre = genreSelect.value;
    if(selectedGenre !== 'All Genres'){
        filteredBooks = filteredBooks.filter(b => b.categories.includes(selectedGenre));
    }
    
    const selectedLocation = document.querySelector('.selected-location').innerText;
    if(selectedLocation !== 'All Locations'){
        filteredBooks = filteredBooks.filter(b => b.location === selectedLocation);
    }

    const readingStatus = readSelect.value;
    if(readingStatus !== 'Read/Reading/Unread'){
        filteredBooks = filteredBooks.filter(b => b.readStatus === readingStatus);
    }


    displayMyBooks()
}

function openDialog(dialog){
    dialog.showModal();
}

function saveNewLocation(location) {
    if (!location || !location.trim()) {
        alert('Please enter a location name');
        return;
    }
    if (user.locations.includes(location)) {
        alert('Location already exists');
        return;
    }
    user.locations.push(location.trim());
    updateUserData();
    generateLibraryPage();
}

function closeDialog(dialog){
    dialog.close();
}

function removeLocation(location, dialog){
    user.locations = user.locations.filter(l => l !== location);
    user.books = user.books.filter(b => b.location != location);
    updateUserData()
    closeDialog(dialog)
    generateLibraryPage()
}

function createSelectableLocations(locationsDiv, book){
    const bookIndex = user.books.findIndex(b => b.id === book.id);

    user.locations.forEach(l => {
        const locationDiv = document.createElement('div');
        locationDiv.classList.add('change-location');
        if(l === user.books[bookIndex].location){
            locationDiv.classList.add('selected-change-location');
        }
        locationDiv.innerText = l;

        locationDiv.addEventListener('click', () => {
            document.querySelectorAll('.change-location').forEach(element => {
                element.classList.remove('selected-change-location');
            });
            locationDiv.classList.add('selected-change-location');
        })

        locationsDiv.appendChild(locationDiv);
    })
}

generateLibraryPage();