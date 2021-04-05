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
                $(slide).append(`<h1 class="text-center">${database.trim().replaceAll("%20", "\xa0")}</h1>`);

                for (let i = 0; i < 4; i++) {
                    if (e[i] == null)
                        continue;
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
                    $(data).click(function() {
                        let btn = this;
                        Swal.fire({
                            title: "Edit Data",
                            text: "Tekan 'Edit' jika ingin merubah data.",
                            icon: "question",
                            confirmButtonText: "Edit",
                            showDenyButton: true
                        }).then(result => {
                            if (result.isConfirmed) {
                                $("#delete-data").click(() => {
                                    Swal.fire({
                                        title: "Hapus Data",
                                        text: "Apakah Yakin Ingin Menghapusnya?",
                                        icon: "warning",
                                        confirmButtonText: "OK",
                            			showDenyButton: true
                                    }).then(result => {
                                        if (result.isConfirmed) {
                                            fetch(`/home/${database}/delete/${e[i].id}`, {
                                                method: 'POST'
                                            });
                                            location.reload(true);
                                        }
                                    })
                                });
                                $("#editBtn").click();
                                $("#id1").attr("value", e[i].id);
                                $("#nama1").attr("value", e[i].nama);
                                $("#kelahiran1").attr("value", e[i].kelahiran);
                                $("#alamat1").attr("value", e[i].alamat);
                                $("#ayah1").attr("value", e[i].ayah);
                                $("#ibu1").attr("value", e[i].ibu);
                                if (btn.getElementsByClassName("photo").length > 0)
                                    $("#img-preview").attr("src", btn.getElementsByClassName("photo")[0].currentSrc);
                            }
                        })
                    });
                    $(slide).append(data);
                    $(slide).append(`<div class="page text-end"><h4>${page}</h4></div>`);
                }
                $("#data").append(slide);
            });
    }
});
