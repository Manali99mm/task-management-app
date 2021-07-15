const taskContainer = document.querySelector(".task__container");
const imageurl = document.getElementById("imageurl");
const taskTitle = document.getElementById("taskTitle");
const taskType = document.getElementById("taskType");
const taskDescription = document.getElementById("taskDescription");

let globalStore = [];

const generateNewCard = (taskData) => {
    const newCard = `
        <div class="col-md-6 col-lg-4" id=${taskData.id}>
            <div class="card">
                <div class="card-header d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-outline-success" id=${taskData.id} onClick="editTask.apply(this, arguments)">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger" id=${taskData.id} onClick="deleteTask.apply(this, arguments)">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <img src=${taskData.imageUrl} class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${taskData.taskTitle}</h5>
                    <p class="card-text">${taskData.taskDescription}</p>
                    <a href="#" class="btn btn-primary">${taskData.taskType}</a>
                </div>
                <div class="card-footer">
                    <button type="button" id=${taskData.id} class="btn btn-outline-primary float-end">Open Task</button>
                </div>
            </div>
        </div>
    `;
    return newCard;
}

const loadInitialCardData = () => {
    const getCardData = localStorage.getItem("tasky");

    const { cards } = JSON.parse(getCardData);

    cards.map((cardObject) => {
        taskContainer.insertAdjacentHTML("beforeend", generateNewCard(cardObject));

        globalStore.push(cardObject);
    })
}

const saveChanges = () => {
    const taskData = {
        id: `${Date.now()}`,
        imageUrl: imageurl.value,
        taskTitle: taskTitle.value,
        taskType: taskType.value,
        taskDescription: taskDescription.value
    };

    taskContainer.insertAdjacentHTML("beforeend", generateNewCard(taskData));

    globalStore.push(taskData);

    localStorage.setItem("tasky", JSON.stringify({ cards: globalStore }));
}

const deleteTask = (e) => {
    if (!e) e = window.event;

    const targetId = e.target.id;
    const tagname = e.target.tagName;

    globalStore = globalStore.filter((cardObject) => (cardObject.id) !== targetId);
    localStorage.setItem("tasky", JSON.stringify({ cards: globalStore }));

    if (tagname === "BUTTON") {
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        );
    }
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode
    );
}

const editTask = (e) => {
    if (!e) e = window.event;
    const targetId = e.target.id;
    const tagName = e.target.tagName;
    let parentNode;

    if (tagName === "BUTTON") {
        parentNode = e.target.parentNode.parentNode;
    } else {
        parentNode = e.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentNode.childNodes[5].childNodes[1];
    let taskType = parentNode.childNodes[5].childNodes[5];
    let taskDescription = parentNode.childNodes[5].childNodes[3];
    let submitButton = parentNode.childNodes[7].childNodes[1];

    taskTitle.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes";
}

const saveEdit = (e) => {
    if (!e) e = window.event;
    const targetId = e.target.id;
    const tagName = e.target.tagName;
    let parentNode;

    if (tagName === "BUTTON") {
        parentNode = e.target.parentNode.parentNode;
    } else {
        parentNode = e.target.parentNode.parentNode.parentNode;
    }

    let taskTitle = parentNode.childNodes[5].childNodes[1];
    let taskType = parentNode.childNodes[5].childNodes[5];
    let taskDescription = parentNode.childNodes[5].childNodes[3];
    let submitButton = parentNode.childNodes[7].childNodes[1];

    const updateData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML,
    };

    globalStore = globalStore.map((task) => {
        if (task.id === targetId) {
            return {
                id: task.id,
                imageUrl: task.imageUrl,
                taskTitle: updateData.taskTitle,
                taskType: updateData.taskType,
                taskDescription: updateData.taskDescription
            }
        }
        return task;
    });
    console.log(globalStore);

    localStorage.setItem("tasky", JSON.stringify({ cards: globalStore }));

    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task";
}