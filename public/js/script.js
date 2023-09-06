// get the button that opens the modal
var btn = document.querySelectorAll("button.modal-button");

// all page modals
var modals = document.querySelectorAll('.modal');

// get the <span> element that closes the modal
var spans = document.getElementsByClassName("close");

// when the user clicks the button, open the modal
for (var i = 0; i < btn.length; i++) {
 btn[i].onclick = function(e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    modal.style.display = "block";
 }
}

// when the user clicks on <span> (x), close the modal
for (var i = 0; i < spans.length; i++) {
 spans[i].onclick = function() {
    for (var index in modals) {
      if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none";    
    }
 }
}

// when the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
     for (var index in modals) {
      if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none";    
     }
    }
}

// time input script

function activate() {
	document.head.insertAdjacentHTML("beforeend", '');

	document.querySelectorAll(".time-pickable").forEach(timePickable => {
		let activePicker = null;

		timePickable.addEventListener("focus", () => {
			if (activePicker) return;

			activePicker = show(timePickable);

			const onClickAway = ({ target }) => {
				if (
					target === activePicker
					|| target === timePickable
					|| activePicker.contains(target)
				) {
					return;
				}

				document.removeEventListener("mousedown", onClickAway);
				document.body.removeChild(activePicker);
				activePicker = null;
			};

			document.addEventListener("mousedown", onClickAway);
		});
	});
}

function show(timePickable) {
	const picker = buildPicker(timePickable);
	const { bottom: top, left } = timePickable.getBoundingClientRect();

	picker.style.top = `${top}px`;
	picker.style.left = `${left}px`;

	document.body.appendChild(picker);

	return picker;
}

function buildPicker(timePickable) {
	const picker = document.createElement("div");
	const hourOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(numberToOption);
	const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(numberToOption);

	picker.classList.add("time-picker");
	picker.innerHTML = `
		<select class="time-picker__select">
			${hourOptions.join("")}
		</select>
		:
		<select class="time-picker__select">
			${minuteOptions.join("")}
		</select>
		<select class="time-picker__select">
			<option value="am">am</option>
			<option value="pm">pm</option>
		</select>
	`;

	const selects = getSelectsFromPicker(picker);

	selects.hour.addEventListener("change", () => {
        const selectedTime = getTimeStringFromPicker(picker);
        timePickable.value = selectedTime;

        // Send the selected time to the server
        sendSelectedTimeToServer(selectedTime);
    });

	selects.hour.addEventListener("change", () => timePickable.value = getTimeStringFromPicker(picker));
	selects.minute.addEventListener("change", () => timePickable.value = getTimeStringFromPicker(picker));
	selects.meridiem.addEventListener("change", () => timePickable.value = getTimeStringFromPicker(picker));

	if (timePickable.value) {
		const { hour, minute, meridiem } = getTimePartsFromPickable(timePickable);

		selects.hour.value = hour;
		selects.minute.value = minute;
		selects.meridiem.value = meridiem;
	}

	return picker;
}

function getTimePartsFromPickable(timePickable) {
	const pattern = /^(\d+):(\d+) (am|pm)$/;
	const [hour, minute, meridiem] = Array.from(timePickable.value.match(pattern)).splice(1);

	return {
		hour,
		minute,
		meridiem
	};
}

function getSelectsFromPicker(timePicker) {
	const [hour, minute, meridiem] = timePicker.querySelectorAll(".time-picker__select");

	return {
		hour,
		minute,
		meridiem
	};
}

function getTimeStringFromPicker(timePicker) {
	const selects = getSelectsFromPicker(timePicker);

	return `${selects.hour.value}:${selects.minute.value} ${selects.meridiem.value}`;
}

function numberToOption(number) {
	const padded = number.toString().padStart(2, "0");

	return `<option value="${padded}">${padded}</option>`;
}

function sendSelectedTimeToServer(selectedTime) {
    console.log('Selected Time:', selectedTime);
	
	// Send an HTTP POST request to your server with the selectedTime
    fetch('/save-time', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedTime }),
    })
    .then(response => {
        // Handle the response from the server if needed
    })
    .catch(error => {
        console.error('Error sending selected time:', error);
    });
}


document.getElementById("calculate-button").addEventListener("click", calculateResults);

function calculateResults() {
    const selectedTime = document.querySelector(".time-pickable").value;

    // Make an AJAX request to your server to get the results
    fetch("/save-time", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedTime }),
    })
        .then((response) => response.json())
        .then((data) => {
            const resultsContainer = document.getElementById("results-container");
            const resultsList = document.getElementById("results-list");

            // Clear previous results
            resultsList.innerHTML = "";

            // Loop through the results and add them with the animation class
            data.results.forEach((result) => {
                const resultContainer = document.createElement("div");
                resultContainer.classList.add("result-item"); // Add animation class
                const resultItem = document.createElement("li");
                resultItem.textContent = result;
                resultContainer.appendChild(resultItem);
                resultsList.appendChild(resultContainer);
            });

            // Show the results container
            resultsContainer.style.display = "block";
        })
        .catch((error) => {
            console.error("Error calculating results:", error);
        });
}

activate();