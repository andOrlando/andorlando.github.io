export function get_raw(path) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.onerror=()=>reject()
    request.onload=()=>resolve(request.responseText)
    request.open("GET", path, true)
    request.send(null)
  })
}

export function get_metadata(path) {
  return new Promise((resolve, reject)=>get_raw(path).then(a=>resolve(JSON.parse(a)), reject))
}

export async function generate_blog(pathbase, name, data) {
  const { filename } = data
  const raw = await get_raw(pathbase+filename)
  
  const parent = document.createElement("div")
  parent.id = "blog"
  
  const title = document.createElement("h1")
  title.appendChild(document.createTextNode(name))
  title.classList.add("bigtitle")
  parent.appendChild(title)
  
  const metadata = document.createElement("div")
  metadata.id = "metadata"
  for (const [key, value] of Object.entries(data))
    metadata.insertAdjacentHTML("beforeend", `<strong>${key}:</strong> ${value}<br>`)
  
  parent.appendChild(metadata)
  
  //I guess I just beat it into submission with regex?
  let res = raw
    .replace(/### (.*)$/gm, "<h3>$1</h3>")
    .replace(/## (.*)$/gm, "<h2>$1</h2>")
    .replace(/# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\!\[(.*?)\]\((.*?)\)/gm, "<img alt=\"$1\" src=\"$2\"></img>")
    .replace(/(?<!\!)\[(.*?)\]\((.*?)\)/gm, "<a href=\"$2\">$1</a>")
    .replace(/---/gm, "<hr>")
    .replace(/```\n?([\s\S]*?)```/gm, "<pre><code>$1</code></pre>")
  
    .replace(/((?:^- .*$\n?)+)/gm, "<ul>\n$1\n</ul>")
    .replace(/(?<=<ul>[\s\S]*?)- (.*)$(?=[\s\S]*?<\/ul>)/gm, "<li>$1</li>")
    .replace(/((?:^> .*$\n?)+)/gm, "<blockquote>\n$1\n</blockquote>")
  
    .replace(/(<pre>[\s\S]*?<\/pre>)|(?<=.*^[^<\n].*?)\n(?=[^<\n].*$)/gm, "$1 ")
    .replace(/^([^\n<]+?)?$/gm, "<p>$1</p>")

    .replace(/\*\*(.*?)\*\*/gm, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gm, "<em>$1</em>")
    .replace(/_(.*?)_/gm, "<u>$1</u>")
    .replace(/`(.*?)`/gm, "<code>$1</code>")


  parent.insertAdjacentHTML("beforeend", res)
  return parent
}

export function generate_table_of_contents({ categories, blogs }, callback) {
  
  const parent = document.createElement("div")
  parent.id = "tableofcontents";

  //do all uncategorized elements
  for (const [name, data] of Object.entries(blogs)
      .filter(([_, a])=>!("category" in a))) {
    let element = document.createElement("a")
    element.appendChild(document.createTextNode(name))
    element.onclick=()=>callback(element, name, data)
    if (data.filename == "index.md") { element.classList.add("selected") }
    parent.appendChild(element)
  }
  
  //do all categories
  for (const category of categories) {
    let element = document.createElement("h1")
    element.appendChild(document.createTextNode(category))
    parent.appendChild(element)

    for (const [name, data] of Object.entries(blogs)
        .filter(([_, a])=>a["category"] == category)) {
      let element = document.createElement("a")
      element.appendChild(document.createTextNode(name))
      element.onclick=()=>callback(element, name, data)
      if (data.filename == "index.md") { element.classList.add("selected") }
      parent.appendChild(element)
    }
  }
  
  return parent
}

