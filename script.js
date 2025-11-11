const API_KEY = 'AIzaSyABeY9VBDmPih7W8nOf5zndu9I5MtF0wfQ';

const container = document.getElementById('container');
const searchBtn = document.getElementById('search-btn');
const searchBar = document.getElementById('search-bar');

searchBtn.addEventListener('click', () => {
    searchBook()
})

const user = {
    books: []
}

const bookHolder = document.createElement('div');

function addBook(){

}

function deleteBook(){

}

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

        const result = document.createElement('div');
        result.classList.add('search-result');

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