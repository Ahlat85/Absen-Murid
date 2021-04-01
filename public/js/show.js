$(document).ready(function() {
	const urls = window.location.pathname.split("/");
	const database = urls[3];
	const page = urls[4] == undefined ? 1 : urls[4];
	const end = (4 * page - 4) + 4;
	getSlides(database, page, end);
	
	function toDOM(html) {
		return new DOMParser().parseFromString(html, "text/html").body.childNodes[0];
	}

	$("#print-btn").click(() => {
		html2pdf().from(document.getElementsByClassName("slide")[0]).save();
	})

	function getSlides(database, page, end) {
		let start = 4 * page - 4;
		fetch(`/home/show/${database}/${start}/${end}`, {
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
					if (key == "img") {
						$(data).append(`<img src="/db/img/${database}/${e[i][key].trim()}" class="photo">`)
					} else if (key == "id") {
						$(ul).append(`
							<li class="d-none">
								<h6 class="data-key d-inline text-uppercase">${key.trim()}: </h6>
                                <p class="data-value d-inline">${e[i][key]}</p>
							</li>
							`);
					} else {
						$(ul).append(`
							<li>
								<h6 class="data-key d-inline text-uppercase">${key.trim()}: </h6>
                                <p class="data-value d-inline">${e[i][key]}</p>
							</li>
							`);
					}
				}
				$(data).append(ul);
				$(data).dblclick(function() {
					$("#delete-data").click(() => {
						fetch(`/home/${database}/delete/${e[i].id}`, {
							method: 'POST',
						});
						window.location.href = window.location.href;
					});
					$("#editBtn").click();
					$("#id1").attr("value", e[i].id);
					console.log(this.getElementsByClassName("photo"))
					if (this.getElementsByClassName("photo").length > 0)
						$("#img-preview").attr("src", this.getElementsByClassName("photo")[0].currentSrc);
					$("#nama1").attr("value", e[i].nama);
					$("#kelahiran1").attr("value", e[i].kelahiran);
					$("#alamat1").attr("value", e[i].alamat);
					$("#ayah1").attr("value", e[i].ayah);
					$("#ibu1").attr("value", e[i].ibu);
				});
				$(slide).append(data);
				$(slide).append(`<div class="page text-end"><h4>${page}</h4></div>`);
			}
			$("#data").append(slide);
		});
	}
});