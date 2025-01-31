const form = document.querySelector('form'),
        nextBtn = form.querySelector('next-btn'),
        backBtn = form.querySelector('back-btn'),
        allInputs = form.querySelectorAll('.first input');

nextBtn.addEventListener('click', ()=> {
    allInputs.forEach(input => {
        if (input.value != "") {
            form.classList.add('setActive');
        } else {
            form.classList.remove('setActive');
        }
    })
});

nextBtn.addEventListener('click', ()=> {
    form.classList.remove('setActive');
});


// document.querySelector("form").addEventListener("submit", function (event) {
//     event.preventDefault();
    
//     let formData = new FormData(this);
    
//     fetch("save.php", {
//         method: "POST",
//         body: formData
//     })
//     .then(response => response.text())
//     .then(data => alert(data))
//     .catch(error => console.error("Error:", error));
// });
