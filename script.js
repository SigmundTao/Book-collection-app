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
let genres = ['Philosophy', 'Fiction'];

const readingSatuses = ['Read', 'Reading', 'Unread'];

const user = JSON.parse(localStorage.getItem('user')) || {books: [], genres: [], locations: ['Bookshelf', 'Kindle'], wishlist: []} 

let filteredBooks = [...user.books];

async function searchBook(searchBar){
    const bookTitle = searchBar.value;
    const searchURL = `https://www.googleapis.com/books/v1/volumes?q=${bookTitle}&key=${API_KEY}`

    const response = await fetch(searchURL);
    const data = await response.json();
    displaySearchResults(data)
}

function displaySearchResults(data){
    pageHolder.innerHTML = '';
    if (!searchResultsContainer) {
        searchResultsContainer = document.createElement('div');
        searchResultsContainer.classList.add('search-results-container');
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

    const addToWishListBtn = document.createElement('button');
    addToWishListBtn.innerText = 'W';
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

    const addBookBtn = document.createElement('button');
    addBookBtn.classList.add('add-book-btn');
    addBookBtn.innerText = '+';
    leftSideHolder.appendChild(addBookBtn);

    //add book dialog
    const addBookDialog = document.createElement('dialog');
    addBookDialog.id = 'add-book-dialog';
    bookPageContainer.appendChild(addBookDialog);

    const titleLabel = document.createElement('h2');
    titleLabel.innerText = 'Title:'

    const dialogTitle = document.createElement('input');
    dialogTitle.classList.add('add-book-dialog-title');
    dialogTitle.value = title;

    const dialogImage = document.createElement('div');
    dialogImage.classList.add('add-book-dialog-image');

    const linkLabel = document.createElement('h3');
    linkLabel.innerText = 'Photo URL:';

    const imageLink = document.createElement('input');
    imageLink.type = 'text';
    imageLink.value = image;

    dialogImage.style.backgroundImage = `url(${imageLink.value})`;

    const ratingLabel = document.createElement('h2');
    ratingLabel.innerText = 'Book Rating:'

    const rating = document.createElement('input');
    rating.classList.add('rating')
    rating.type = 'number';
    rating.classList.add('add-book-rating');
    rating.min = 0;
    rating.max = 10;
    rating.style.display = 'inline';

    const locationsLabel = document.createElement('h2');
    locationsLabel.innerText = 'Location:';

    const locationsHolder = document.createElement('select');
    user.locations.forEach(l => {
        const locationOption = document.createElement('option');
        locationOption.innerText = l;
        locationOption.value = l;

        locationsHolder.appendChild(locationOption);
    })

    const readLabel = document.createElement('h2');
    readLabel.innerText = 'Read Status';

    const readStatusSelect = document.createElement('select');
    readStatusSelect.classList.add('read-status-select');

    readingSatuses.forEach(opt => {
        const optionDiv = document.createElement('option');
        optionDiv.innerText = opt;
        optionDiv.value = opt;

        readStatusSelect.appendChild(optionDiv);
    })

    let noRating;

    readStatusSelect.addEventListener('change', () => {
        console.log('this is firing off')
        if(readStatusSelect.value === 'Unread'){
            ratingLabel.style.display = 'none';
            rating.style.display = 'none';
            noRating = true;
        } else {
            rating.style.display = 'block';
            ratingLabel.style.display = 'block';
            noRating = false;
        }

        console.log(noRating);
        console.log(rating.style.display);
        console.log(rating.value);
    })

    const numberOfCopies = document.createElement('input');
    numberOfCopies.type = 'number';
    numberOfCopies.value = 1;
    numberOfCopies.min = 1;
    numberOfCopies.max = 100;

    const saveBookBtn = document.createElement('button');
    saveBookBtn.innerText = 'Add Book';

    const closeAddBookDialogBtn = document.createElement('button');
    closeAddBookDialogBtn.classList.add('close-add-book-dialog-btn');
    closeAddBookDialogBtn.innerText = 'X';

    addBookDialog.appendChild(titleLabel);
    addBookDialog.appendChild(dialogTitle);
    addBookDialog.appendChild(dialogImage);
    addBookDialog.appendChild(linkLabel);
    addBookDialog.appendChild(imageLink);
    addBookDialog.appendChild(ratingLabel);
    addBookDialog.appendChild(rating);
    addBookDialog.appendChild(locationsLabel);
    addBookDialog.appendChild(locationsHolder);
    addBookDialog.appendChild(readLabel);
    addBookDialog.appendChild(readStatusSelect);
    addBookDialog.appendChild(saveBookBtn);
    addBookDialog.appendChild(closeAddBookDialogBtn);

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

    const title = document.createElement('h3');
    title.innerText = 'Title:';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';

    const authorTitle = document.createElement('h3');
    authorTitle.innerText = 'Author:'

    const authorInput = document.createElement('input');
    authorInput.type = 'text';

    const coverDisplay = document.createElement('div');
    
    const imageLinkTitle = document.createElement('h3');
    imageLinkTitle.innerText = 'Image Link:';

    const imageLinkInput = document.createElement('input');
    imageLinkInput.type = 'text';

    const genreTitle = document.createElement('h3');
    genreTitle.innerText = 'Catergories';

    const genreHolder = document.createElement('div');
    
    genres.forEach(genre => {
        const genreCard = createGenreCard(genre)
        genreHolder.appendChild(genreCard);
    })

    const descriptionTitle = document.createElement('h3');
    descriptionTitle.innerText = 'Description:';

    const description = document.createElement('textarea');

    const ratingTitle = document.createElement('h3');
    ratingTitle.innerText = 'Rating:'

    const rating = document.createElement('input');
    rating.value = null;
    rating.type = 'number';
    rating.min = 1;
    rating.max = 10;

    const readStatusTitle = document.createElement('h3');
    readStatusTitle.innerText = 'Read Status:';

    const readStatus = document.createElement('select');
    readingSatuses.forEach(status => {
        const statusOption = document.createElement('option');
        statusOption.innerText = status;
        statusOption.value = status;

        readStatus.appendChild(statusOption);
    })

    readStatus.value = 'Read';

    readStatus.addEventListener('change', () => {
        if(readStatus.value !== 'Read'){
            readStatus.display = 'none';
        } else {
            readStatus.display = 'block';
        }
    })

    const locationTitle = document.createElement('h3');
    locationTitle.innerText = 'Book Location:';

    const locationsSelect = createLocationSelect();
    locationsSelect.classList.add('manual-location-select');

    const id = generateBookId();

    const langInputTitle = document.createElement('h3');
    langInputTitle.innerText = 'Language:';

    const languageInput = document.createElement('input');
    languageInput.type = 'text';

    const saveBookBtn = document.createElement('button');
    saveBookBtn.innerText = 'Save';

    manualAddBookPage.appendChild(title);
    manualAddBookPage.appendChild(titleInput);
    manualAddBookPage.appendChild(authorTitle);
    manualAddBookPage.appendChild(authorInput);
    manualAddBookPage.appendChild(coverDisplay);
    manualAddBookPage.appendChild(imageLinkTitle);
    manualAddBookPage.appendChild(imageLinkInput);
    manualAddBookPage.appendChild(genreTitle);
    manualAddBookPage.appendChild(genreHolder);
    manualAddBookPage.appendChild(descriptionTitle);
    manualAddBookPage.appendChild(description);
    manualAddBookPage.appendChild(readStatusTitle);
    manualAddBookPage.appendChild(readStatus);
    manualAddBookPage.appendChild(ratingTitle);
    manualAddBookPage.appendChild(rating);
    manualAddBookPage.appendChild(locationTitle);
    manualAddBookPage.appendChild(locationsSelect);
    manualAddBookPage.appendChild(langInputTitle);
    manualAddBookPage.appendChild(languageInput);
    manualAddBookPage.appendChild(saveBookBtn);

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

function createLocationSelect(){
    const locationsHolder = document.createElement('div');

    user.locations.forEach(l => {
        const locationDiv = document.createElement('div');
        locationDiv.classList.add('location-div');
        locationDiv.innerText = l;
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
        <option>Rating (High - Low)</option>
        <option>Rating (Low - High)</option>
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

    readSelect = document.createElement('select');
    const allStatuses = document.createElement('option');
    allStatuses.innerText = 'Read/Reading/Unread';
    allStatuses.value = 'Read/Reading/Unread';
    readSelect.appendChild(allStatuses);

    readingSatuses.forEach(status => {
        const statusOption = document.createElement('option');
        statusOption.innerText = status;
        statusOption.value = status;

        readSelect.appendChild(statusOption);
    })
    filterBar.appendChild(readSelect);

    const removeLocationDialog = document.createElement('dialog');
    generateRemoveLocations(removeLocationDialog);

    libraryPage.appendChild(removeLocationDialog);

    const locationContainer = document.createElement('div');
    locationContainer.classList.add('location-container');
    filterBar.appendChild(locationContainer);
    locationSelect = createLocationSelect()
    locationSelect.classList.add('location-select');
    locationContainer.appendChild(locationSelect)

    const defaultLocation = document.createElement('div');
    defaultLocation.classList.add('location-div');
    defaultLocation.classList.add('selected-location');
    defaultLocation.value = 'All Locations';
    defaultLocation.innerText = 'All Locations';
    locationSelect.appendChild(defaultLocation);
    defaultLocation.addEventListener('click', () => {
            document.querySelectorAll('.location-div').forEach(e => e.classList.remove('selected-location'));
            defaultLocation.classList.add('selected-location');
            filterBooks();
    })

    const addNewLocationBtn = document.createElement('button');
    addNewLocationBtn.innerText = 'add new location'
    filterBar.appendChild(addNewLocationBtn);

    const removeLocationBtn = document.createElement('button');
    removeLocationBtn.innerText = 'remove location'
    filterBar.appendChild(removeLocationBtn);
    removeLocationBtn.addEventListener('click', () => {
        openDialog(removeLocationDialog)
    })

    
    
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

    readSelect.addEventListener('change', () => {
        filterBooks();
    })

    locationSelect.addEventListener('click', () => {
    });

    const newLocationDialog = document.createElement('dialog');
    libraryPage.appendChild(newLocationDialog);

    const locationInput = document.createElement('input');
    locationInput.type = 'text';
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

    addNewLocationBtn.addEventListener('click', () => {openDialog(newLocationDialog)})

    const addNewBookBtn = document.createElement('button');
    addNewBookBtn.classList.add('add-new-book-btn');
    addNewBookBtn.innerText = '+';
    addNewBookBtn.addEventListener('click', () => {loadSearchPage()})

    libraryPage.appendChild(addNewBookBtn);

    const openWishlistBtn = document.createElement('div');
    openWishlistBtn.classList.add('open-wish-list-button');

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

    const removeTitle = document.createElement('h2');
    removeTitle.innerText = 'Remove Locations:';

    removeLocationDialog.appendChild(removeTitle);

    user.locations.forEach(l => {
        const removeLocationCard = document.createElement('div');
        
        const locationTitle = document.createElement('h3');
        locationTitle.innerText = l;

        const removeBtn = document.createElement('button');
        removeBtn.innerText = 'X';

        removeLocationCard.appendChild(locationTitle);
        removeLocationCard.appendChild(removeBtn);

        removeLocationDialog.appendChild(removeLocationCard);

        removeBtn.addEventListener('click', () => {
            user.locations.splice(user.locations.findIndex(e => e === l), 1);
            updateUserData();
            generateRemoveLocations(removeLocationDialog);
        })
    })

    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'close dialog';
    closeBtn.addEventListener('click', () => {
        closeDialog(removeLocationDialog);
        generateLibraryPage()
    })

    removeLocationDialog.appendChild(closeBtn);
}

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

    const wishListPage = document.createElement('div');
    wishListPage.id = 'wish-list-page';

    const title = document.createElement('h1');
    title.innerText = 'Wishlist';

    const bookHolder = document.createElement('div');
    bookHolder.classList.add('wish-list-book-holder');

    const closeWishListBtn = document.createElement('button');
    closeWishListBtn.classList.add('close-wishlist-btn');
    closeWishListBtn.innerText = 'X';

    wishListPage.appendChild(title);
    wishListPage.appendChild(bookHolder);
    wishListPage.appendChild(closeWishListBtn);

    pageHolder.appendChild(wishListPage);

    closeWishListBtn.addEventListener('click', generateLibraryPage);

    //Wishlist book creation
    user.wishlist.forEach(b => {
        const book = createBook(b);
        bookHolder.appendChild(book);

        const addToLibraryBtn = document.createElement('button');
        addToLibraryBtn.innerText = '+';

        book.appendChild(addToLibraryBtn);

        addToLibraryBtn.addEventListener('click', () => {
            user.books.push(b);
            user.wishlist.splice(user.wishlist.findIndex(e => e.id === b.id), 1);
            updateUserData()
            generateWishListPage()
        })

        const removeBtn = document.createElement('button');
        removeBtn.innerText = 'X';

        removeBtn.addEventListener('click', () => {
            user.wishlist.splice(user.wishlist.findIndex(e => e.id === b.id), 1);
            updateUserData()
            generateWishListPage()
        })

        book.appendChild(removeBtn);
    })

    const addNewBookBtn = document.createElement('button');
    addNewBookBtn.classList.add('add-new-book-btn');
    addNewBookBtn.innerText = '+';
    addNewBookBtn.addEventListener('click', () => {loadSearchPage()})

    wishListPage.appendChild(addNewBookBtn);

    console.log(user.wishlist);
}

function createBook(b){
    const book = document.createElement('div');
    book.classList.add('book');
    
    const title = document.createElement('h3');
    title.classList.add('book-title');
    title.innerText = b.title;
    
    const img = document.createElement('img');
    img.src = b.cover;
    img.alt = b.title;
    
    book.appendChild(title);
    book.appendChild(img);
    
    return book;
}

function loadSearchPage(){
    pageHolder.innerHTML = '';
    const searchPage = document.createElement('div');

    const searchBar = document.createElement('input');
    
    const searchButton = document.createElement('button');
    searchButton.innerText = 'Search';

    const addManuallyBtn = document.createElement('button');
    addManuallyBtn.innerText = '+';

    searchPage.appendChild(searchBar);
    searchPage.appendChild(searchButton);
    searchPage.appendChild(addManuallyBtn);

    pageHolder.appendChild(searchPage);

    searchButton.addEventListener('click', () => {
        searchBook(searchBar);
    })

    searchBar.addEventListener('keydown', (event) => {
        console.log(event.key)
        if(event.key === 'Enter'){
            searchBook(searchBar);
        }
    })

    addManuallyBtn.addEventListener('click', () => {
        manuallyAddBook()
    })
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

//Book order sorting
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

function ratingSortHighToLow(){
    user.books = [...user.books].sort((a, b) => b.rating - a.rating);
}

function ratingSortLowToHigh(){
    user.books = [...user.books].sort((a, b) => a.rating - b.rating);
}

function sortBooks(select){
    if(select === 'A-Z') aToZSort();
    else if(select === 'Z-A') zToASort();
    else if(select === 'Publish Date (old - new)') oldToNewPubDateSort();
    else if(select === 'Publish Date (new - old)') newToOldPubDateSort();
    else if(select === 'Date Added (old - new)') oldToNewDateAddedSort();
    else if(select === 'Date Added (new - old)') newToOldDateAddedSort();
    else if(select === 'Rating (High - Low)') ratingSortHighToLow();
    else if(select === 'Rating (Low - High)') ratingSortLowToHigh();

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

    const dialogDiv = document.createElement('div');
    dialogDiv.classList.add('dialog-div');
    editBookDialog.appendChild(dialogDiv);

    const title = document.createElement('h3');
    title.innerText = 'Title:';

    const editBookTitle = document.createElement('input');
    editBookTitle.type = 'text';
    editBookTitle.value = book.title;

    const editBookPhoto = document.createElement('div');
    editBookPhoto.style.backgroundImage = `url(${book.cover})`;

    const link = document.createElement('h3');
    link.innerText = 'Photo URL:'

    const editBookLink = document.createElement('input');
    editBookLink.type = 'text';
    editBookLink.value = book.cover;

    const locationsDiv = document.createElement('div');
    createSelectableLocations(locationsDiv, book);

    const readingStatusTitle = document.createElement('h3');
    readingStatusTitle.innerText = 'Read Status:'

    const undreadOrReadSelect = document.createElement('select');

    readingSatuses.forEach(s => {
        const statusOption = document.createElement('option');
        statusOption.innerText = s;

        undreadOrReadSelect.appendChild(statusOption);
    })

    undreadOrReadSelect.value = book.readStatus;

    const bookRatingTitle = document.createElement('h3');
    bookRatingTitle.innerText = 'Rating:'

    const editBookRating = document.createElement('input');
    editBookRating.type = 'number';
    editBookRating.max = 10;
    editBookRating.min = 1;
    editBookRating.value = book.rating;

    const saveBtn = document.createElement('button');
    saveBtn.innerText = 'save';

    dialogDiv.appendChild(title);
    dialogDiv.appendChild(editBookTitle);
    dialogDiv.appendChild(editBookPhoto);
    dialogDiv.appendChild(link);
    dialogDiv.appendChild(editBookLink);
    dialogDiv.appendChild(locationsDiv);
    dialogDiv.appendChild(undreadOrReadSelect);
    dialogDiv.appendChild(bookRatingTitle);
    dialogDiv.appendChild(editBookRating);
    dialogDiv.appendChild(saveBtn);
    
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

    const closeDialogBtn = document.createElement('button');
    closeDialogBtn.innerText = 'X';
    dialogDiv.appendChild(closeDialogBtn);

    closeDialogBtn.addEventListener('click', () => {
        closeDialog(editBookDialog);
    })

    container.appendChild(editBookDialog);
    openDialog(editBookDialog)
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
        
        const authorsHolder = document.createElement('h4');
        if(b.authors && b.authors.length > 0){
            b.authors.forEach(author => {
            authorsHolder.innerText += `${author} `;
            })
        }
        

        const editBookBtn = document.createElement('button');
        editBookBtn.innerText = 'edit';

        editBookBtn.addEventListener('click', () => {openEditDialog(b, booksHolder)})

        const removeBookBtn = document.createElement('button');
        removeBookBtn.innerText = 'x';
        removeBookBtn.classList.add('grid-view-remove-btn');

        if(b.rating){
            const ratingDiv = document.createElement('div');
            ratingDiv.classList.add('book-rating');
            ratingDiv.innerText = b.rating;
            book.appendChild(ratingDiv);

            const ratingColors = getRatingColour(b.rating);

            ratingDiv.style.backgroundColor = ratingColors[0];
            ratingDiv.style.color = ratingColors[1];
        }
        
        const readStatus = document.createElement('div');
        if(!b.readStatus){
            b.readStatus = 'Unread'
        }
        readStatus.innerText = b.readStatus;

        removeBookBtn.addEventListener('click', () => {
            deleteBook(b.id);
        });

        book.appendChild(cover);
        book.appendChild(title);
        book.appendChild(authorsHolder);
        book.appendChild(readStatus);
        book.appendChild(removeBookBtn);
        book.appendChild(editBookBtn);

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

        if(b.rating){
            const ratingDiv = document.createElement('div');
            ratingDiv.classList.add('list-book-rating');
            ratingDiv.innerText = b.rating;

            const ratingColors = getRatingColour(b.rating);

            ratingDiv.style.backgroundColor = ratingColors[0];
            ratingDiv.style.color = ratingColors[1];

            book.appendChild(ratingDiv);
        }
        

        const readStatus = document.createElement('div');
        if(!b.readStatus){
            b.readStatus = 'Unread'
        }
        readStatus.innerText = b.readStatus;

        removeBookBtn.addEventListener('click', () => {
            deleteBook(b.id);
        });

        book.appendChild(cover);
        book.appendChild(title);
        book.appendChild(readStatus);
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

function saveNewLocation(location){
    user.locations.push(location);
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