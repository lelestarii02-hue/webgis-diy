// let nama_wilayah = "Kota Yogyakarta";
// let jumlah_penduduk = 400000;

// console.log(nama_wilayah);


let bilangan_1 = "10";
let bilangan_2 = 5;

let hasil = bilangan_1 * bilangan_2;
// console.log(bilangan_1 + " * " + bilangan_2 + " = " + hasil);

let wilayah_DIY = [
    "Bantul",
    "Gunungkidul",
    "Kulon Progo",
    "Sleman",
    "Kota Yogyakarta"
];

// console.log(wilayah_DIY[3]);

let kota_saya = {
    nama: "Yogyakarta",
    Jumlah_penduduk: 400000,
    provinsi: "Daerah Istimewa Yogyakarta",
    luas_wilayah: 320000,
}
// console.log(kota_saya); 
// console.log(kota_saya.nama + " Kota Istimewa");
// console.log(kota_saya["luas_wilayah"]);


// Function
function myFunction() {
    // console.log("Ini adalah function");
    // console.log("Ini adalah function uji coba");
    // console.log("oke...");
    // alert("Hallo..Look at me!!!");  
};

myFunction();

function callMyName(name, usia) {
    // console.log("Hallo " + name);
    // console.log("Usia saya " + usia+" Tahun");
}

// callMyName("Tari", 21);
callMyName("Putri", 8);

let myTombol = document.getElementById("btn-peta");
myTombol.addEventListener("click", function () {
    // let status = document.getElementById("status");
    // status.textContent = "Peta telah ditampilkan";
    // status.style.color = "green";
    // status.style.backgroundColor = "lightgreen";
});

let map = L.map("map").setView([-7.797068, 110.370529], 10);
let geojsonData = null;
let wilayahLayer = null;
let selectedLayer = null;

let openTopoMap = L.tileLayer(
    "https://tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution:
        'Map data &copy; OpenStreetMap contributors, SRTM | Map style &copy; OpenTopoMap'
}
).addTo(map);
let openStreetMap = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        'Map data &copy; OpenStreetMap contributors, SRTM | Map style &copy; OpenStretMap'
}
).addTo(map);
let wilayahSelect = document.getElementById("wilayah-select")

fetch("data/diy-demografi.geojson")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        geojsonData = data;
        wilayahLayer = L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: feature.properties.stroke,
                    fillColor: feature.properties.fill,
                    weight: 2,
                    fillOpacity: 1,
                    opacity: 1,
                };
            },
            onEachFeature: function (feature, layer) {
                let informasi = `

    <div class="popup-content">

        <div
            class="popup-header"
            style="border-left-color: ${feature.properties.fill};"
        >
            <h3>${feature.properties.nama}</h3>
            <span>Informasi Wilayah</span>
        </div>

        <div class="popup-item">
            <span class="popup-label">Jumlah Penduduk</span>
            <strong>${feature.properties.jumlah_penduduk} jiwa</strong>
        </div>

        <div class="popup-item">
            <span class="popup-label">Luas Wilayah</span>
            <strong>${feature.properties.luas_wilayah_km2} km²</strong>
        </div>

        <div class="popup-item">
            <span class="popup-label">Kepadatan Penduduk</span>
            <strong>${feature.properties.kepadatan} jiwa/km²</strong>
        </div>

    </div>
`;
                layer.bindPopup(informasi);
            }
        }).addTo(map);

        geojsonData.features.forEach(function (feature) {
            let option = document.createElement("option");
            option.value = feature.properties.nama;
            option.textContent = feature.properties.nama;
            wilayahSelect.appendChild(option);
        });

        wilayahSelect.addEventListener("change", function () {
            let selectedName = wilayahSelect.value;

            let selectedFeature = geojsonData.features.find(function (feature) {
                return feature.properties.nama === selectedName;
            });

            if (selectedLayer) {
                map.removeLayer(selectedLayer);
            }

            selectedLayer = L.geoJSON(selectedFeature, {
                style: function (feature) {
                    return {
                        color: feature.properties.stroke,
                        fillColor: feature.properties.fill,
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    };
                }, onEachFeature: function (feature, layer) {
                    let informasi = `

    <div class="popup-content">

        <div
            class="popup-header"
            style="border-left-color: ${feature.properties.fill};"
        >
            <h3>${feature.properties.nama}</h3>
            <span>Informasi Wilayah</span>
        </div>

        <div class="popup-item">
            <span class="popup-label">Jumlah Penduduk</span>
            <strong>${feature.properties.jumlah_penduduk} jiwa</strong>
        </div>

        <div class="popup-item">
            <span class="popup-label">Luas Wilayah</span>
            <strong>${feature.properties.luas_wilayah_km2} km²</strong>
        </div>

        <div class="popup-item">
            <span class="popup-label">Kepadatan Penduduk</span>
            <strong>${feature.properties.kepadatan} jiwa/km²</strong>
        </div>
    </div>`;
                    layer.bindPopup(informasi);
                }
            }).addTo(map);
            
            map.fitBounds(selectedLayer.getBounds());

            console.log(selectedFeature);
        });

        let baseMaps = {
            "openTopoMap": openTopoMap,
            "open Street Map": openStreetMap
        };

        let overlays = {
            "Wilayah Kabupaten/Kota": wilayahLayer,
        };

        L.control.layers(
            baseMaps, overlays
        ).addTo(map);
    });

