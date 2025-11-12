const API_KEY = 'AIzaSyABeY9VBDmPih7W8nOf5zndu9I5MtF0wfQ';

const container = document.getElementById('container');
const myBooks = document.getElementById('my-books');
const myBooksHolder = document.getElementById('my-books-holder');
const sortSelect = document.getElementById('sort-select');
const searchBtn = document.getElementById('search-btn');
const searchBar = document.getElementById('search-bar');

searchBtn.addEventListener('click', () => {
    searchBook()
})

const user = {
    books: []
}

const bookHolder = document.createElement('div');

async function searchBook(){
    const bookTitle = searchBar.value;
    const searchURL = `https://www.googleapis.com/books/v1/volumes?q=${bookTitle}&key=${API_KEY}`


    const response = await fetch(searchURL);

    const data = await response.json();
    console.log(data);
    displaySearchResults(data)
}

function displayView(){

}

function displaySearchResults(data){
    container.innerHTML = '';

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

        container.appendChild(result);
    });
}

function loadBookPage(title, authors, description, language, categories, image, identifiers, id, averageRating, publishedDate){
    container.innerHTML = '';
    const authorsArray = authors;
    const bookCoverURL = image;

    const leftSideHolder = document.createElement('div');

    const bookCover = document.createElement('div');
    bookCover.classList.add('book-page-cover');
    bookCover.style.backgroundImage = `url(${bookCoverURL})`;

    leftSideHolder.appendChild(bookCover);

    const rightSideHolder = document.createElement('div')

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

    console.log(categories);

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
            language: bookLanguage,
            identifiers: identifiers,
            id: id,
            rating: averageRating,
            publishedDate: publishedDate,
            dateAdded: new Date().toISOString()
        })
    })

    const quitBtn = document.createElement('button');
    quitBtn.innerText = 'X';
    leftSideHolder.appendChild(quitBtn);

    quitBtn.addEventListener('click', () => {
        displayMyBooks()
        container.innerHTML = '';
    })
    
    container.appendChild(leftSideHolder);
    container.appendChild(rightSideHolder);
}

function addBook(bookObj){
    if(user.books.findIndex(book => book.id === bookObj.id) !== -1){

    } else {
        user.books.push(bookObj);
    }
}

sortSelect.addEventListener('change', () => {
    sortBooks(sortSelect.value)
})

function displayMyBooks(){
    myBooksHolder.innerHTML = '';

    user.books.forEach(b => {
        const book = document.createElement('div');
        book.classList.add('book');

        const cover =  document.createElement('div');
        cover.style.backgroundImage = `url(${b.cover})`;
        
        const title = document.createElement('h3');
        title.innerText = b.title;

        const removeBookBtn = document.createElement('button');
        removeBookBtn.innerText = 'x';

        removeBookBtn.addEventListener('click', () => {
            deleteBook(b.id);
            displayMyBooks()
        })

        book.appendChild(cover);
        book.appendChild(title);
        book.appendChild(removeBookBtn);

        myBooksHolder.appendChild(book)
        console.log(b.publishedDate)
    })

    console.log(user.books)
}

function deleteBook(bookID){
    const bookIndex = user.books.findIndex(e => e.id === bookID);
    console.log(bookIndex)
    console.log(user.books)

    user.books.splice(bookIndex, 1);
}

function oldToOldDateAddedSort(){
    user.books = [...user.books].sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
}

function newToOldDateAddedSort(){
    user.books = [...user.books].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
}

function aToZSort(){
    user.books = [...user.books].sort((a, b) => a.title.localeCompare(b.title, undefined, {sensitivity: 'base'}));
    console.log(user.books)
}

function newToOldPubDateSort(){
    user.books = [...user.books].sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}

function oldToNewPubDateSort(){
    user.books = [...user.books].sort((a, b) => new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime());
}

function sortBooks(select){
    if(select === 'A-Z') aToZSort();
    else if(select === 'Publish Date (old - new)') oldToNewPubDateSort();
    else if(select === 'Publish Date (new - old)') newToOldPubDateSort();
    else if(select === 'Date Added (old - new)') newToOldDateAddedSort();
    else if(select === 'Date Added (new - old)') newToOldPubDateSort();

    displayMyBooks()
}

function displayBookImageView(){

}

function displayBookInfoView(){

}