const fileDroppable = document.querySelector("#file-droppable")
const inputFileUpload = document.querySelector("#input-file-upload")
const form = document.querySelector("#form")

window.addEventListener("dragover", (e) => {
  e.preventDefault()
})

window.addEventListener("drop", (e) => {
  e.preventDefault()
})

fileDroppable.addEventListener("drop", (e) => {
  e.preventDefault()
  const file = e.dataTransfer.files[0]

  const formData = new FormData()

  formData.append("image", file)

  submitForm(formData)
})

inputFileUpload.addEventListener("input", () => {
  console.log(inputFileUpload.value)
  submitForm()
})

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
