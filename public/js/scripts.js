// <div class="slide">
//                     <h1 class="text-center text-uppercase">
//                         <%- body.databse -%>
//                     </h1>
//                     <% if (body.tabel != null) { %>
//                     <% for (let i = body.start; i < body.end; i++) { %>
//                     <div class="data">
//                         <% if (body.tabel != null) { %>
//                         <% for (const key in body.tabel[i]) { %>
//                         <% if (key == "img") { %>
//                         <img src="<%- body.tabel[i]['img'] -%>" class="photo">
//                         <% } %>
//                         <% } %>
//                         <% } %>
//                         <div class="detail">
//                             <% if (body.tabel != null) { %>
//                             <ul>
//                                 <% for (const key in body.tabel[i]) { %>
//                                 <% if (key != "img") { %>
//                                 <li>
//                                     <h6 class="data-key d-inline text-uppercase">
//                                         <%- key -%>: </h6>
//                                     <p class="data-value d-inline">
//                                         <%- body.tabel[i][key] -%>
//                                     </p>
//                                 </li>
//                                 <% } %>
//                                 <% } %>
//                             </ul>
//                             <% } %>
//                         </div>
//                     </div>
//                     <% } %>
//                     <% } %>
//                     <div class="number-page text-end">
//                         <% if (body.page != null) { %>
//                         <h4>
//                             <%- body.page -%>
//                         </h4>
//                         <% } else {%>
//                         <h4>1</h4>
//                         <% } %>
//                     </div>
//                 </div>

$(document).ready(function() {
	const urls = window.location.pathname.split("/");
	console.log(urls)
	const database = urls[2];
	const page = urls[3] == undefined ? 0 : urls[3];
	const end = (4 * page - 4) + 4;
	getSlides(database, page, end);
	
	function toDOM(html) {
		return new DOMParser().parseFromString(html, "text/html").body.childNodes[0];
	}

	function getSlides(database, page, end) {
		page = page == 0 ? 1 : page;
		start = 4 * page - 4;
		console.log(start)
		console.log(end)
		fetch(`/home/${database}/${start}/${end}`, {
			method: 'POST',
		})
			.then(e => e.json())
			.then(e => {
				const perPage = Math.ceil(e.length / 4);

				const slide = toDOM(`<div class="slide"></div>`);
				$(slide).append(`<h1 class="text-center text-uppercase">${database.trim()}</h1>`);

				for (let i = 0; i < 4; i++) {
					if (e[i] == null)
						break;
					const data = toDOM(`<iv class="data"></iv>`);
					const detail = toDOM(`<iv class="detail"></iv>`);
					const ul = toDOM("<ul></ul>");
					for (const key in e[i]) {
						if (key == "img")
							$(data).append(`<img src="${e[i][key].trim()}" class="photo">`)
						else {
							$(ul).append(`
								<li>
									<h6 class="data-key d-inline text-uppercase">${key.trim()}: </h6>
                                    <p class="data-value d-inline">${e[i][key]}</p>
								</li>
								`);
						}
					}
					$(data).append(ul);
					$(slide).append(data);
				}
				$("#data").append(slide);
			});

		// const databases = readDatabases();
		// if (databases == null ||  !database in databases || start < 0 || end >= databases[database].length)
		// 	return null;
		// database = databases[database];
		// let result = ``;
		// for (let i = start; i < end; i++) {
		// 	if ("img" in database[i])
		// }
	}
});