export function get_raw(path) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.onerror=()=>reject()
    request.onload=()=>resolve(request.responseText)
    request.open("GET", path, true)
    request.send(null)
  })
}

