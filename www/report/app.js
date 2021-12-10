
var url = 'https://rti2dss.com:4000';
// var url = 'http://localhost:4000'


let map = L.map('map', {
    center: [17.720, 100.050],
    zoom: 10,
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
    "แผนที่ถนน": grod.addTo(map),
    "แผนที่ภาพถ่าย": ghyb
}

var overlayMap = {
    "ขอบจังหวัด": prov
}

L.control.layers(baseMap, overlayMap).addTo(map);

let xdata = axios.post(url + '/alcohol-api/getdata', { usrid: 'usrid' })
let datArr = []
let loadData = () => {
    datArr = []
    xdata.then((r) => {
        datArr.push(r.data.data)
        showData(r.data.data)
    })
}

let removeLayer = () => {
    map.eachLayer(i => {
        i.options.name == "p" ? map.removeLayer(i) : null;
    })
}

let showMap = (geojson) => {
    console.log(geojson);

}

let showData = async (objArr) => {
    removeLayer();

    let alcohol = 0;
    let cigarat = 0;
    let alcohol_cigarat = 0;

    // console.log(objArr.length);
    document.getElementById("total").innerHTML = `จำนวนข้อมูลที่สำรวจ<h1><b>${objArr.length}</b></h1>แห่ง`

    objArr.map(x => {
        let img;
        if (x.product_type == "บุหรี่" || x.product_type == "บุหรี") {
            img = "cigarettes.png";
            alcohol += 1
        }

        if (x.product_type == "สุรา" || x.product_type == "เหล้า") {
            img = "alcohol.png";
            cigarat += 1
        }

        if (x.product_type == "บุหรี่และสุรา" || x.product_type == "เหล้าและบุหรี่") {
            img = "no-alcohol.png";
            alcohol_cigarat += 1
        }

        // console.log(x.geojson);
        if (x.geojson) {
            let json = JSON.parse(x.geojson).coordinates;
            let marker = L.marker([json[1], json[0]], {
                draggable: false,
                name: 'p'
            })

            marker.bindPopup(`<div class="row">
                    <div class="col-4">
                        <img src="./../images/${img}" alt="" width="50px">
                    </div>
                    <div class="col-8 f-popup">
                        <b>ชื่อร้าน:</b> ${x.retail_name}
                        <br><b>เจ้าของ:</b> ${x.owner_name}
                        <br><b>ประเภทที่จำหน่าย:</b> ${x.product_type}
                    </div>
                </div>`,
                { maxWidth: 400 }).openPopup().addTo(map);
            // map.setView([json[1], json[0]], 14)
        }

        document.getElementById("content").innerHTML += `<div class="inner-box mt-2" >
            <div class="content" >
                <span class="company-logo"><img src="./../images/${img}" alt=""></span>
                <h4><span>${x.retail_name}</span></h4>
                <span>${x.owner_name}</span>
                <ul class="job-info">
                    <li><i class="bi bi-cart3"></i>&nbsp;${x.product_type}</li>
                    <li><i class="bi bi-journal-check"></i>&nbsp;ใบอนุญาต: ${x.certification}</li>
                    <li><i class="bi bi-calendar-week"></i>&nbsp;วันที่สำรวจ: ${x.ndate}</li>
                </ul>
            </div>
            <ul class="job-other-info ">
                <li class="f-16 privacy cursor" onclick="editData('${x.gid}')"><i class="bi bi-clipboard-data"></i> รายละเอียด</li>
            </ul>
        </div>`
    })

    // console.log(alcohol, cigarat, alcohol_cigarat);
    loadChart(alcohol, cigarat, alcohol_cigarat, "chart1")
}

let findData = () => {
    document.getElementById("content").innerHTML = "";
    let find = document.getElementById('find').value;
    let datFilter = datArr[0].filter(x => x.txt.includes(find))
    showData(datFilter)
}

let loadChart = (alcohol, cigarat, alcohol_cigarat, div) => {
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create(div, am4charts.XYChart);

    chart.data = [{
        country: "สุรา",
        value: alcohol
    }, {
        country: "บุหรี่",
        value: cigarat
    }, {
        country: "สุราและบุหรี่",
        value: alcohol_cigarat
    }];

    chart.padding(40, 40, 40, 40);

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.extraMax = 0.1;

    valueAxis.title.text = "จำนวนร้านที่ขาย";
    //valueAxis.rangeChangeEasing = am4core.ease.linear;
    //valueAxis.rangeChangeDuration = 1500;

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "country";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.cornerRadiusTopLeft = 10;
    //series.interpolationDuration = 1500;
    //series.interpolationEasing = am4core.ease.linear;
    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.verticalCenter = "bottom";
    labelBullet.label.dy = -10;
    labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";

    chart.zoomOutButton.disabled = true;

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
    });
}

let deleteData = (gid) => {
    axios.post(url + '/alcohol-api/delete', { gid }).then(r => {
        document.getElementById("content").innerHTML = "";
        loadData()
    })
}

let editData = (gid) => {
    location.href = "./../edit/index.html?gid=" + gid;
}

loadData()

