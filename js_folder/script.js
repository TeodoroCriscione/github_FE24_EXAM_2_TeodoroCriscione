// Fetching data from local JSON file
document.addEventListener("DOMContentLoaded", () => {
    // Fetch data.json and store it in localStorage if not already stored
    if (!localStorage.getItem("priorityData")) {
        console.log("data from JSON file");
        fetch("./data_folder/data.json")
            .then(response => response.json())
            .then(jsonData => {
                // Store data in Local Storage (only string is valid)
                localStorage.setItem("priorityData", JSON.stringify(jsonData));
                renderData(jsonData);
            })
            // Error Handling
            .catch(error => console.error("Error fetching data:", error));
    } else {
        // Retrieve data from Local Storage (from string to object)
        const storedData = JSON.parse(localStorage.getItem("priorityData"));
        console.log("data from Local Storage");
        renderData(storedData);
    }
});

// Clear ALL data from local storage button
document.getElementById("clear-storage-btn").addEventListener("click", () => {
    // Clear local storage
    localStorage.removeItem("priorityData");
    // Fetch new data from data.json and update UI
    fetch("./data_folder/data.json")
        .then(response => response.json())
        .then(jsonData => {
            localStorage.setItem("priorityData", JSON.stringify(jsonData));
            renderData(jsonData);
        })
        .catch(error => console.error("Error fetching data:", error));
});

// ------------------------------
// Function to render data and attach event listeners to priority-buttons
function renderData(data) {
    const container = document.getElementById("result"); 
    container.innerHTML = ""; 
    data.forEach((element, index) => {
        // deleted and completed events should not be shown
        if (element.shownFeature === true ){
            container.innerHTML += `
                <div class="card mx-3 my-3" style="width: 18rem;" data-id="${element.id}">
                    <div class="header-card">
                        <a href="#" class="btn btn-primary">Task</a>
                        <span> 
                            <i class="fa-regular fa-bookmark bookmark-icon" style="cursor: pointer;"></i>
                            <i class="fa fa-ellipsis-v" style="color:black; cursor:pointer" data-bs-toggle="dropdown"></i>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="#">Set Notification</a></li>
                                <li><a class="dropdown-item" href="#">Change Description</a></li>
                            </ul>
                        </span>
                    </div>
                    <img src="${element.coverImage}" class="card-img-top" alt="image">
                    <div class="card-body">
                        <h5 class="card-title">${element.activityName}</h5>
                        <p class="card-text"><b>Address:</b> ${element.activityDescription}</p>
                        <hr>
                        <p class="priority-level">
                            <i class='fas fa-exclamation-triangle'></i> 
                            <b>Priority Level:</b>
                            <a class="btn priority-button" data-index="${index}" id="priority-${index}">${element.priorityLevel}</a>
                        </p>
                        <p><i class="fa fa-calendar"></i> ${element.activityDeadline}</p>
                        <hr>
                        <span>
                            <a href="#" class="btn btn-danger delete-button">Delete</a>
                            <a href="#" class="btn btn-success done-button">Done</a>
                        </span>
                    </div>
                </div>
            `;
    }});

    // Reattach Event Listeners After Re-rendering

    // Priority Button Event Listeners
    document.querySelectorAll(".priority-button").forEach(button => {
        const index = button.getAttribute("data-index"); // index of the card
        const priorityLevel = data[index].priorityLevel; // priority level of the card
        updateButtonAppearance(button, priorityLevel); // updated color of button
        button.addEventListener("click", () => {
            // update priority level and color
            if (data[index].priorityLevel < 5) {
                data[index].priorityLevel++;
                button.innerText = data[index].priorityLevel;
                updateButtonAppearance(button, data[index].priorityLevel);
                // update local storage
                localStorage.setItem("priorityData", JSON.stringify(data));
            }
        });
    });

    // Delete Button Event Listeners
    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", function () {
            Swal.fire({
                title: "Do you want to delete this task?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((confirmationAnswer) => {
                if (confirmationAnswer.isConfirmed) {
                    Swal.fire({ title: "Deleted!", text: "Your task has been removed from view.", icon: "success" });
                    // .closest: find the nearest ancestor element that has the class "card" starting from the element that triggered the event (this)
                    let card = this.closest(".card");
                    let taskId = card.getAttribute("data-id");
                    // Get stored data
                    let storedData = JSON.parse(localStorage.getItem("priorityData")) || [];
                    let updatedData = storedData.map(item => {
                        if (item.id === taskId) {
                            // Mark as hidden
                            item.shownFeature = false; 
                        }
                        return item;
                    });
                    // Save updated data back to localStorage
                    localStorage.setItem("priorityData", JSON.stringify(updatedData));
                    // Hide card visually with a fade-out effect
                    card.style.transition = "opacity 0.5s ease";
                    card.style.opacity = "0";
                    setTimeout(() => card.remove(), 500);
                }
            });
        });
    });
    
    // Done Button Event Listeners
    document.querySelectorAll(".done-button").forEach(button => {
        button.addEventListener("click", function () {
            Swal.fire({
                title: "Congratulations! Is it time to remove this?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, remove it!"
            }).then((confirmationAnswer) => {
                if (confirmationAnswer.isConfirmed) {
                    Swal.fire({ title: "Deleted!", text: "Your task has been removed from view.", icon: "success" });
                    let card = this.closest(".card");
                    let taskId = card.getAttribute("data-id");
                    // Get stored data
                    let storedData = JSON.parse(localStorage.getItem("priorityData")) || [];
                    let updatedData = storedData.map(item => {
                        if (item.id === taskId) {
                            item.shownFeature = false; // Mark as hidden
                        }
                        return item;
                    });
                    // Save updated data back to localStorage
                    localStorage.setItem("priorityData", JSON.stringify(updatedData));
                    // Hide card visually with a fade-out effect
                    card.style.transition = "opacity 0.5s ease";
                    card.style.opacity = "0";
                    setTimeout(() => card.remove(), 500);
                }
            });
        });
    });
    // Bookmark Button Event Listeners
    document.querySelectorAll(".bookmark-icon").forEach(icon => {
        icon.addEventListener("click", function () {
            this.classList.toggle("fa-regular");
            this.classList.toggle("fa-solid");
        });
    });
};

// Function to update button color based on priority level
function updateButtonAppearance(button, priorityLevel) {
    button.classList.remove("btn-success", "btn-warning", "btn-danger");
    if (priorityLevel <= 1) {
        button.classList.add("btn-success"); // Green for low priority
    } else if (priorityLevel > 1 && priorityLevel <= 3) {
        button.classList.add("btn-warning"); // Yellow for medium priority
    } else {
        button.classList.add("btn-danger"); // Red for high priority
    }
}

// ------------------------------
//  Sort-by-priority Button
document.getElementById("sort-btn").addEventListener("click", () => {
    let storedData = JSON.parse(localStorage.getItem("priorityData")) || [];
    // Filter out elements where shownFeature is false
    let filteredData = storedData.filter(item => item.shownFeature === true);
    // Sort the data by priority level (highest priority first)
    filteredData.sort((a, b) => b.priorityLevel - a.priorityLevel);
    // Save the sorted order in localStorage
    localStorage.setItem("priorityData", JSON.stringify(filteredData));
    // Re-render the UI with the new order
    renderData(filteredData);
});

// --------------------------------
// Reset ONLY PRIORITY LEVEL button
document.getElementById("reset-priority-btn").addEventListener("click", () => {
    // Retrieve data from localStorage
    let storedData = JSON.parse(localStorage.getItem("priorityData")) || [];
    // Select all visible cards (not deleted or marked as done)
    let visibleCards = document.querySelectorAll(".card");
    // Get the IDs of visible cards
    let visibleIds = Array.from(visibleCards).map(card => card.getAttribute("data-id"));
    // Reset priority levels only for visible tasks
    storedData.forEach(item => {
        if (visibleIds.includes(item.id)) {
            item.priorityLevel = 0;
        }
    });
    // Save updated data back to localStorage
    localStorage.setItem("priorityData", JSON.stringify(storedData));
    // Re-render only the visible cards
    renderData(storedData);
});