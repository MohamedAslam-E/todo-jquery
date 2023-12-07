$(function () {
  fetchData();
  $("#inputField").focus();

  $("#taskForm").on("submit", function (e) {
    e.preventDefault();
    const task = $("#inputField").val().trim();
    if (task !== "") {
      createTodo(task);
    } else {
      alert("Task cannot be empty");
    }
  });

  $(".todo-list").on("click", ".updateTask", function () {
    const $taskItem = $(this).closest("li");
    const taskId = $taskItem.data("id");
    const currentTask = $taskItem.find(".task-text").text().trim();
    const updatedTask = prompt("Update task:", currentTask);
    if (updatedTask !== "") {
      updateTask(taskId, updatedTask);
    }
  });

  $(".todo-list").on("click", ".task-text", function (e) {
    e.stopPropagation();
    const $taskItem = $(this).closest("li");
    const taskId = $taskItem.data("id");
    const completed = !$taskItem.data("completed");
    updateCompletionStatus(taskId, completed);
  });

  $(".todo-list").on("click", ".deleteTask", function () {
    const $taskItem = $(this).closest("li");
    const taskId = $taskItem.data("id");
    $taskItem.fadeOut("500", function () {
      deleteTask(taskId);
    });
  });
});

async function fetchData() {
  try {
    const todo = await $.getJSON("http://localhost:2001/api/items");
    showTodos(todo.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function showTodos(todo) {
  $(".todo-list").empty();
  for (let item of todo) {
    showTodo(item);
  }
}

function showTodo(todo) {
  let elem = $(
    `<li class="${
      todo.completed ? "text-black text-decoration-line-through" : ""
    } h4">
      <span class="task-text">${todo.task}</span>
      <span role="button" class="updateTask mx-2"><i class="fa-solid fa-square-pen updateTask"></i></span>
      <span role="button" class="deleteTask"><i class="fa fa-trash text-danger deleteTask"></i></span>
    </li>`
  );
  elem.data("id", todo._id);
  elem.data("completed", todo.completed);

  $(".todo-list").prepend(elem);
}

function updateTask(taskId, updatedTask) {
  $.ajax({
    url: `http://localhost:2001/api/items/${taskId}`,
    type: "PUT",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({ task: updatedTask }),
    success: fetchData,
    error: function () {
      alert("Error updating task");
    },
  });
}

function updateCompletionStatus(taskId, completed) {
  $.ajax({
    url: `http://localhost:2001/api/items/${taskId}`,
    type: "PUT",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({ completed }),
    success: fetchData,
    error: function () {
      alert("Error updating completion status");
    },
  });
}

function deleteTask(taskId) {
  $.ajax({
    url: `http://localhost:2001/api/items/${taskId}`,
    type: "DELETE",
    success: function () {
      fetchData();
      location.reload();
    },
    error: function () {
      alert("Error deleting task");
    },
  });
}

async function createTodo(userInput) {
  try {
    await $.ajax({
      url: "http://localhost:2001/api/items",
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({ task: userInput }),
      success: function () {
        fetchData();
        $("#inputField").val("");
        location.reload();
      },
      error: function (error) {
        console.error("Error creating task:", error);
      },
    });
  } catch (error) {
    console.error("Error creating task:", error);
  }
}
