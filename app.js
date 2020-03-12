class ViewElement {
    constructor(root) {
        this.root = document.createElement('div');
        this.root.classList.add("papper", "task");

        this.taskToggle = document.createElement("input");
        this.taskToggle.type = "checkbox"
        this.taskToggle.classList.add("task_toggle");
        this.root.appendChild(this.taskToggle);

        this.taskBody = document.createElement('div');
        this.taskBody.classList.add("task__body");
        this.root.appendChild(this.taskBody);

        this.taskText = document.createElement('p');
        this.taskText.classList.add("task__text");
        this.taskBody.appendChild(this.taskText);

        this.taskTextInput = document.createElement('input');
        this.taskTextInput.classList.add("task__text__input");
        this.taskBody.appendChild(this.taskTextInput);

        this.taskDelete = document.createElement('img');
        this.taskDelete.classList.add('task__delete');
        this.root.appendChild(this.taskDelete);
        root.appendChild(this.root);
    }
    show() {
        this.root.classList.remove("hidden");
    }
    hide() {
        this.root.classList.add("hidden");
    }
    setText(newText) {
        this.taskText.innerText = newText;
        this.taskTextInput.value = newText;
    }
    open() {
        this.root.classList.remove("completed");
        this.taskToggle.checked = false;
    }
    close() {
        this.root.classList.add("completed");
        this.taskToggle.checked = true;
    }
    edit() {
        this.taskBody.classList.add("edited");
        this.taskTextInput.focus();
    }
    save() {
        this.taskBody.classList.remove("edited");
    }
    delete() {
        this.root.remove();
    }
}

class TodoItem {
    constructor(id, text, isOpened) {
        this._id = id;
        this._text = text;
        this._isOpened = isOpened;
    }
    bind(element) {
        this.element = element;
        this.text = this._text;

        element.taskBody.ondblclick = e => {
            this.isEdited = true;
        }
        element.taskTextInput.onblur = e => {
            this.isEdited = false;
        }
        element.taskToggle.onchange = e => {
            this.isOpened = !e.target.checked;
        }
    }
    set text(value) {
        this._text = value;
        this.element.setText(value);
    }
    set isOpened(value) {
        this._isOpened = value;
        if (value) this.element.open(); else this.element.close();
    }
    get isOpened() {
        return this._isOpened;
    }
    set isVisible(value) {
        if (value) this.element.show(); else this.element.hide();
    }
    set isEdited(value) {
        if (value) this.element.edit(); else {
            this.text = this.element.taskTextInput.value;
            this.element.save();
        }
    }
    delete() {
        this.element.delete();
    }
}

const newTaskInput = document.querySelector("#newTaskInput");

const itemsList = [];

newTaskInput.onkeydown = e => {
    if (e.key == "Enter" && e.target.value !== "") {
        const newViewElement = new ViewElement(document.querySelector("#list"));
        const newTodoItem = new TodoItem(0, e.target.value, true);
        newTodoItem.bind(newViewElement);
        itemsList.push(newTodoItem);
        e.target.value = "";
        showItemCount(itemsList.length);
    }
}

document.querySelector("#allBtn").onclick = e => {
    itemsList.forEach(x => {
        x.isVisible = true;
    });
    showItemCount(itemsList.length);
};

document.querySelector("#activeBtn").onclick = e => {
    let itemsCount = 0;
    itemsList.forEach(x => {
        x.isVisible = x.isOpened;
        if (x.isOpened) itemsCount++;
    });
    showItemCount(itemsCount);
}

document.querySelector("#completedBtn").onclick = e => {
    let itemsCount = 0;
    itemsList.forEach(x => {
        x.isVisible = !x.isOpened;
        if (!x.isOpened) itemsCount++;
    });
    showItemCount(itemsCount);
}

function showItemCount(count) {
    document.querySelector("#itemCount").innerText = `${count} item left`;
}

document.querySelector("#clearBtn").onclick = e => {
    for(let i =0;i<itemsList.length;){
        if(!itemsList[i].isOpened){
            itemsList[i].delete();
            itemsList.splice(i,1);
        }else{
            i++;
        }
    }
};