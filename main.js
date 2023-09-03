const dropMenu = document.getElementById("dropdown-menu");
const container = document.getElementById("container");
const listContent = document.getElementById("list-content");
const cardContent = document.getElementById("card-content");


// Dropdown Main Menu build

async function getData(link) {
    const response = await fetch(link);
    // console.log(response)
    const list = await response.json();
    // console.log(list)
    return list;
}

async function menuBuild(link) {
    let urls = await getData(link);
    for (i of Object.entries(urls)) {
        // console.log(i[0])
        let li = document.createElement("li")
        li.id = i[0];
        li.innerHTML = `<a class='dropdown-item' href='${i[1]}'>${i[0]}</a>`;
        dropMenu.appendChild(li);
    }
}

menuBuild('https://swapi.dev/api/');

// Main Menu EventListener
dropMenu.addEventListener('click', (el) => {
    el.preventDefault();
    if (document.getElementById('objectList')) {
        document.getElementById('objectList').remove();
    }
    listBuild(el.target.href);
})

//List EventListener
listContent.addEventListener('click', (el) => {
    if (el.target.id === "next" && !el.target.className.includes("secondary") || el.target.id === "previous" && !el.target.className.includes("secondary")) {
        console.log(el.target.className.includes("secondary"))
        let link = el.target.value
        document.getElementById("objectList").remove();
        listBuild(link);
    }
    if (el.target.className.includes("warning")) {
        choiceObj = storageFind(el.target);
        cardContent.appendChild(contentBuild(choiceObj));
    }
})


//Find an element in local storage
function storageFind(el) {
    storedList = JSON.parse(localStorage.getItem('objectList'));
    for (i of storedList) {
        if (el.innerHTML === i.title || el.innerHTML === i.name) {
            return i;
        }
    }
}



// Сard content fill from object.
function contentBuild(el) {
    if (document.getElementById("choice")) {
        document.getElementById("choice").remove();
    }
    let div = document.createElement("div");
    div.className = "list-group";
    let ul = document.createElement("ul");
    ul.id = "choice"
    ul.className = "list-group list-group-flush"
    for (let prop in el) {
        let li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = prop + ": " + el[prop];
        ul.appendChild(li);
    }
    div.appendChild(ul)
    return div;
}

// Object list build function
async function listBuild(link) {
    if (document.getElementById("choice")) {
        document.getElementById("choice").remove();
    }
    let data = await getData(link);
    // console.log(data);
    localStorage.setItem('objectList', JSON.stringify(data.results))
    // console.log(data.results);
    let groupUl = document.createElement("ul");
    groupUl.className = "list-group"
    groupUl.id = "objectList";
    // groupUl.style = "max-width: 300px"
    groupUl.innerHTML = `
    <li style="display: inline-flex" class="list-group-item">
    <button type="button" id="previous" style="width: 40%" class="btn btn-primary m-2" value=""}>Previous</button>
    <button type="button" id="next" style="width: 40%" class="btn btn-primary m-2" value="">Next</button></li>`
    for (i of data.results) {
        let li = document.createElement("li");
        li.className = "list-group-item list-group-item-warning";
        li.textContent = Object.values(i)[0];
        groupUl.appendChild(li)
    }
    listContent.appendChild(groupUl);
    if (data.next != null) {
        document.getElementById("next").value = data.next;
    } else {
        document.getElementById("next").className = "btn btn-outline-secondary m-2"
    }
    if (data.previous != null) {
        document.getElementById("previous").value = data.previous;
    } else {
        document.getElementById("previous").className = "btn btn-outline-secondary m-2"
    }
}