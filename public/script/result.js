const inputResultUrl = document.querySelector("#result-url")

function handleCopy(event) {
  inputResultUrl.select()
  inputResultUrl.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(inputResultUrl.value)

  event.target.textContent = "Copied"
  event.target.disabled = true

  setTimeout(() => {
    event.target.textContent = "Copy Link"
    event.target.disabled = false
  }, 2000)
}
