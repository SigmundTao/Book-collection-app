// Functions to create html elements
export function createLabel(text, tag = 'h3'){
    const label = document.createElement(tag);
    label.innerText = text;
    return label;
}

export function createInput(type = 'text', value = ''){
    const input = document.createElement('input');
    input.type = type;
    input.value = value;
    return input;
}

export function createButton(text, className){
    const btn = document.createElement('button');
    btn.innerText = text;
    if(className) btn.classList.add(className);
    return btn;
}

export function createDiv(text, className){
    const div = document.createElement('div');
    if(text) div.innerText = text;
    if(className) div.classList.add(className);
    return div;
}

export function createSelect(options = [], className = '') {
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

export function appendChildren(childArray, parent){
    childArray.forEach(child => {
        parent.appendChild(child);
    });
}

export function openDialog(dialog){
    dialog.showModal();
}

export function closeDialog(dialog){
    dialog.close();
}

export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

export function colorRating(rating){
    if(rating <= 4) return ['red', 'white'];
    if(rating <= 6) return ['orange', 'white'];
    if(rating <= 10) return ['green', 'white'];
    return ['darkgreen', 'white'];
}

export function generateBookId(){
    let id = Math.random().toString(36).substring(2, 8);
    return id;
}