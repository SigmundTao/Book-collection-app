import { createDiv, createLabel, createButton, getRatingColour } from './helpers.js';
import { user } from './storage.js';

export function createBook(book){
    const bookDiv = createDiv('', 'book');
    
    const title = createLabel(book.title, 'h3');
    title.classList.add('book-title');
    
    const img = document.createElement('img');
    img.src = book.cover;
    img.alt = book.title;
    
    bookDiv.appendChild(title);
    bookDiv.appendChild(img);
    
    return bookDiv;
}

export function createBookCard(book, viewType, onDelete, onEdit) {
    const bookCard = createDiv('', `${viewType}-book`);

    bookCard.addEventListener('click', () => {
        if(onEdit) onEdit(book);
    });
    
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
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if(onDelete) onDelete(book.id);
    });
    
    if(book.rating) {
        const ratingClass = viewType === 'grid-view' ? 'book-rating' : 'list-book-rating';
        const ratingDiv = createDiv(book.rating, ratingClass);
        const [bgColor, textColor] = getRatingColour(book.rating);
        ratingDiv.style.backgroundColor = bgColor;
        ratingDiv.style.color = textColor;
        bookCard.appendChild(ratingDiv);
    }
    
    const readStatus = createDiv(book.readStatus || 'Unread');
    
    bookCard.appendChild(cover);
    bookCard.appendChild(title);
    bookCard.appendChild(readStatus);
    bookCard.appendChild(removeBtn);

    if(viewType === 'grid-view' && book.authors && book.authors.length > 0) {
        const authorsHolder = document.createElement('h4');
        book.authors.forEach(author => {
            authorsHolder.innerText += `${author} `;
        });
        bookCard.insertBefore(authorsHolder, readStatus);
        
        const editBtn = createButton('Edit', 'edit-btn');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(onEdit) onEdit(book);
        });
        bookCard.appendChild(editBtn);
    }
    
    return bookCard;
}

export function createLocationSelect(onChange){
    const locationsHolder = document.createElement('div');

    user.locations.forEach(l => {
        const locationDiv = createDiv(l, 'location-div');
        locationDiv.value = l;
        locationsHolder.appendChild(locationDiv);

        locationDiv.addEventListener('click', () => {
            document.querySelectorAll('.location-div').forEach(e => e.classList.remove('selected-location'));
            locationDiv.classList.add('selected-location');
            if(onChange) onChange();
        });
    });

    return locationsHolder;
}

export function createSelectableLocations(locationsDiv, book){
    const bookIndex = user.books.findIndex(b => b.id === book.id);

    user.locations.forEach(l => {
        const locationDiv = createDiv('', 'change-location');
        if(l === user.books[bookIndex].location){
            locationDiv.classList.add('selected-change-location');
        }
        locationDiv.innerText = l;

        locationDiv.addEventListener('click', () => {
            document.querySelectorAll('.change-location').forEach(element => {
                element.classList.remove('selected-change-location');
            });
            locationDiv.classList.add('selected-change-location');
        });

        locationsDiv.appendChild(locationDiv);
    });
}

export function createGenreCard(genre){
    const genreCard = document.createElement('div');
    genreCard.classList.add('genreCard');

    genreCard.addEventListener('click', () => {
        genreCard.classList.toggle('selected-genre');
    });

    genreCard.innerText = genre;
    return genreCard;
}