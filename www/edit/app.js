

// var userId;
// async function getUserid() {
//     const profile = await liff.getProfile();
//     console.log(profile)
//     userId = await profile.userId;

//     $('#profile').attr('src', await profile.pictureUrl);
//     // $('#userId').text(profile.userId);
//     $('#statusMessage').text(await profile.statusMessage);
//     $('#displayName').text(await profile.displayName);
// }

var url = 'https://rti2dss.com:3150';
// var url = 'http://localhost:3000';

let pid = sessionStorage.getItem("pid");

let map = L.map('map', {
    center: [16.820378, 100.265787],
    zoom: 13
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
// let lc = L.control.locate().addTo(map);
// lc.start();

let removeLayer = () => {
    map.eachLayer(i => {
        i.options.name == "p" ? map.removeLayer(i) : null;
    })
}

map.on('click', (e) => {
    if (geom) {
        map.removeLayer(geom);
    }
    // lc.stop();
    geom = L.marker(e.latlng, {
        draggable: false,
        name: 'p'
    }).addTo(map);
    document.getElementById('lat').value = e.latlng.lat
    document.getElementById('lng').value = e.latlng.lng
});

let getData = (pid) => {
    axios.post(url + "/alcohol-api/getselectdata", { pid }).then(r => {
        // console.log(r.data.data[0]);

        r.data.data[0].alcohol == "true" ? document.getElementById("alcoholyes").checked = true : document.getElementById("alcoholno").checked = true;
        r.data.data[0].cigarette == "true" ? document.getElementById("cigaretteyes").checked = true : document.getElementById("cigaretteyno").checked = true;

        document.getElementById('owner_name').value = r.data.data[0].owner_name
        document.getElementById('retail_type').value = r.data.data[0].retail_type
        document.getElementById('product_type').value = r.data.data[0].product_type
        document.getElementById('certification').value = r.data.data[0].certification
        document.getElementById('addresses').value = r.data.data[0].addresses
        document.getElementById('retail_status').value = r.data.data[0].retail_status
        document.getElementById('alcohol_survey').value = r.data.data[0].alcohol_survey
        //   document.querySelector('input[name="alcohol"]:checked').value,
        document.getElementById('alcohol_item').value = r.data.data[0].alcohol_item
        document.getElementById('cigarette_survey').value = r.data.data[0].cigarette_survey
        //  document.querySelector('input[name="cigarette"]:checked').value,
        document.getElementById('cigarette_item').value = r.data.data[0].cigarette_item
        document.getElementById('preview').src = r.data.data[0].img
        sessionStorage.removeItem("pid");
        // console.log(r.data.data);
        geom = L.marker([r.data.data[0].lat, r.data.data[0].lng], {
            draggable: false,
            name: 'p'
        }).addTo(map);
        map.setView([r.data.data[0].lat, r.data.data[0].lng], 14)
    })
}


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
        dataurl = '';
    }

    const obj = {
        pid: pid,
        data: {
            pid: pid,
            owner_name: document.getElementById('owner_name').value,
            retail_type: document.getElementById('retail_type').value,
            product_type: document.getElementById('product_type').value,
            certification: document.getElementById('certification').value,
            addresses: document.getElementById('addresses').value,
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

    axios.post(url + '/alcohol-api/update', obj).then((res) => {
        gotoReport()
    })
};

let gotoReport = () => {
    location.href = "./../report/index.html";
}

getData(pid)


