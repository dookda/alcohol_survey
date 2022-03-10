function initializeLiff() {
    liff.init({
        liffId: "1656610153-LedkyobK"
    }).then((e) => {
        if (!liff.isLoggedIn()) {
            liff.login();
        } else {
            getUserid();
        }
    }).catch((err) => {
        console.log(err);
    });
}

async function getUserid() {
    const profile = await liff.getProfile();
    document.getElementById("usrid").value = await profile.userId;
    document.getElementById("profile1").src = await profile.pictureUrl;
    document.getElementById("displayName1").innerHTML = await profile.displayName;
    document.getElementById("profile2").src = await profile.pictureUrl;
    document.getElementById("displayName2").innerHTML = await profile.displayName;
}

// initializeLiff()

var url = 'https://rti2dss.com/p4000';
// var url = 'http://localhost:3000'

let map = L.map('map', {
    center: [16.820378, 100.265787],
    zoom: 13,
    scrollWheelZoom: false
});

var marker = "";
let geom = "";
let dataurl = "";

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const grod = L.tileLayer('https://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

const ghyb = L.tileLayer('https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

var prov = L.tileLayer.wms("https://rti2dss.com:8443/geoserver/th/wms?", {
    layers: 'th:province_4326',
    format: 'image/png',
    transparent: true
});

var baseMap = {
    "OSM": osm,
    "แผนที่ถนน": grod,
    "แผนที่ภาพถ่าย": ghyb.addTo(map)
}

var overlayMap = {
    "ขอบจังหวัด": prov
}

L.control.layers(baseMap, overlayMap).addTo(map);
let lc = L.control.locate().addTo(map);
lc.start();

document.getElementById("alcohol_item").style.visibility = "hidden";
let handleAlcohol = () => {
    let alcoholRadio = document.querySelector('input[name="alcohol"]:checked').value
    if (alcoholRadio == "false") {
        document.getElementById("alcohol_item").style.visibility = "visible";
    } else {
        document.getElementById("alcohol_item").style.visibility = "hidden";
    }
}

document.getElementById("cigarette_item").style.visibility = "hidden";
let handleCigarette = () => {
    let alcoholRadio = document.querySelector('input[name="cigarette"]:checked').value
    if (alcoholRadio == "false") {
        document.getElementById("cigarette_item").style.visibility = "visible";
    } else {
        document.getElementById("cigarette_item").style.visibility = "hidden";
    }
}

let removeLayer = () => {
    map.eachLayer(i => {
        i.options.name == "bnd" ? map.removeLayer(i) : null;
    })
}

map.on('click', (e) => {
    if (geom) {
        map.removeLayer(geom);
    }
    lc.stop();
    geom = L.marker(e.latlng, {
        draggable: false,
        name: 'p'
    }).addTo(map);
    // $("#lat").val(e.latlng.lat);
    // $("#lon").val(e.latlng.lng);
    document.getElementById('lat').value = e.latlng.lat
    document.getElementById('lng').value = e.latlng.lng
});

let handleFiles = () => {
    var filesToUploads = document.getElementById('imgfile').files;
    var file = filesToUploads[0];
    var reader = new FileReader();

    reader.onloadend = (e) => {
        let imageOriginal = reader.result;
        resizeImage(file);
        document.getElementById('preview').src = imageOriginal;
    }
    reader.readAsDataURL(file);
};

let input = document.getElementById('imgfile');
input.addEventListener('change', handleFiles);

let resizeImage = (file) => {
    var maxW = 600;
    var maxH = 600;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var img = document.createElement('img');
    var result = '';
    img.onload = function () {
        var iw = img.width;
        var ih = img.height;
        var scale = Math.min((maxW / iw), (maxH / ih));
        var iwScaled = iw * scale;
        var ihScaled = ih * scale;
        canvas.width = iwScaled;
        canvas.height = ihScaled;
        context.drawImage(img, 0, 0, iwScaled, ihScaled);
        result += canvas.toDataURL('image/jpeg', 0.5);
        dataurl = result;
        // document.getElementById('rez').src = that.imageResize;
    }
    img.src = URL.createObjectURL(file);
}

let saveData = () => {
    $("#status").empty().text("File is uploading...");

    if (!dataurl) {
        dataurl = '-';
    }

    const obj = {
        data: {
            usrid: document.getElementById('usrid').value,
            retail_name: document.getElementById('retail_name').value,
            owner_name: document.getElementById('owner_name').value,
            retail_type: document.getElementById('retail_type').value,
            product_type: document.getElementById('product_type').value,
            certification: document.getElementById('certification').value,
            addresses: document.getElementById('addresses').value,
            tname: document.getElementById('tname').value,
            retail_status: document.getElementById('retail_status').value,
            alcohol_survey: document.getElementById('alcohol_survey').value,
            alcohol: document.querySelector('input[name="alcohol"]:checked').value,
            alcohol_item: document.getElementById('alcohol_item').value,
            cigarette_survey: document.getElementById('cigarette_survey').value,
            cigarette: document.querySelector('input[name="cigarette"]:checked').value,
            cigarette_item: document.getElementById('cigarette_item').value,
            lat: document.getElementById('lat').value,
            lng: document.getElementById('lng').value,
            img: dataurl ? dataurl : dataurl = "",
            geom: geom == "" ? "" : geom.toGeoJSON()
        }
    }
    console.log(obj);

    axios.post(url + '/alcohol-api/insert', obj).then((res) => {
        // editData()
        $("#ex5").modal({
            escapeClose: false,
            clickClose: false,
            showClose: false
        });
    })
};

let editData = () => {


    if (liff.getOS() == "web") {
        location.href = "./../report/index.html";
    } else {
        liff.closeWindow()
    }

}

