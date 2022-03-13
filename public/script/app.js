const fileDroppable = document.querySelector("#file-droppable")
const inputFileUpload = document.querySelector("#input-file-upload")
const form = document.querySelector("#form")

let dragEnterCounter = 0

window.addEventListener("dragover", (e) => {
  e.preventDefault()
})

window.addEventListener("dragenter", (e) => {
  if (dragEnterCounter === 0) {
    document.body.classList.add("drop-focus")
  }
  dragEnterCounter++
})

window.addEventListener("dragleave", (e) => {
  dragEnterCounter--

  if (dragEnterCounter === 0) {
    document.body.classList.remove("drop-focus")
  }
})

window.addEventListener("drop", (e) => {
  e.preventDefault()

  console.log(e.target)
  document.body.classList.remove("drop-focus")
  dragEnterCounter = 0
})

window.addEventListener("dragend", (e) => {
  console.log("dragend")
})

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const el = document.querySelector(".error")
    if (el) el.remove()
  }, 5000)
})

function droppableClickHandler() {
  inputFileUpload.click()
}

function uploadFileOnDrop(event) {
  console.log("submits")
  event.preventDefault()
  const file = event.dataTransfer.files[0]

  const formData = new FormData()

  formData.append("image", file)

  submitForm(formData)
}

function onFileUpload() {
  console.log(inputFileUpload.value)
  submitForm()
}

async function submitForm(formData) {
  if (!formData) {
    form.submit()
    return showLoading()
  }

  showLoading()

  const res = await fetch("/upload", {
    method: "POST",
    "Content-Type": "multipart/form-data",
    body: formData,
  })

  if (res.redirected) {
    window.location.href = res.url
  }
}

function showLoading() {
  form.remove()

  document.body.innerHTML = `
    <div class="card">
      <p class="throbber-label">Uploading...</p>
      <div class="throbber">
        <div class="throbber-thumb"></div>
      </div>
    </div>
  `
}
