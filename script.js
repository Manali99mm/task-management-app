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
                    <button type="button" class="btn btn-outline-success">
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
                    <button type="button" class="btn btn-outline-primary float-end">Open Task</button>
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