export function renderSectionHeader(title, buttonHtml = "") {
  const container = document.getElementById("container");

  const header = document.createElement("div");
  header.classList.add("section-header");

  header.innerHTML = `
    <h2>${title}</h2>
    ${buttonHtml}
  `;

  container.appendChild(header);
}
