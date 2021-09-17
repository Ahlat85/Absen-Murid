const cetak = document.getElementById("cetak");
cetak.addEventListener("click", () => {
  const halaman = document.getElementById("halaman"). innerHTML;
  const options = {
    filename: `murid_${halaman}_`
  }
  html2pdf().set(options).from(document.getElementsByClassName("slide")[0]).save();
  alert("Berhasil");
})