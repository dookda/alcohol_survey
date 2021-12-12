function initializeLiff() {
    liff.init({
        liffId: "1656610153-LnnDqMG5"
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
    chkAdmin(profile.userId)
}

let chkAdmin = (usrid) => {
    axios.post(url + '/alcohol-api/getuser', { usrid }).then((r) => {
        r.data.data[0].usertype == 'admin' ? loadData() : $("#modal").modal("show");
    })
}

let gotoDashboard = () => {
    location.href = "./../report/index.html"
}

initializeLiff()


var url = 'https://rti2dss.com:4000';
// var url = 'http://localhost:4000'

document.getElementById("total").innerHTML = `<div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span> </div>`
document.getElementById("chart1").innerHTML = `<div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span> </div>`
document.getElementById("chartdiv2").innerHTML = `<div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span> </div>`

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
    transparent: true,
    CQL_FILTER: 'pro_code=53'
});

var amp = L.tileLayer.wms("https://rti2dss.com:8443/geoserver/th/wms?", {
    layers: 'th:amphoe_4326',
    format: 'image/png',
    transparent: true,
    CQL_FILTER: 'pro_code=53'
});

var tam = L.tileLayer.wms("https://rti2dss.com:8443/geoserver/th/wms?", {
    layers: 'th:tambon_4326',
    format: 'image/png',
    transparent: true,
    CQL_FILTER: 'pro_code=53'
});

var baseMap = {
    "OSM": osm,
    "แผนที่ถนน": grod.addTo(map),
    "แผนที่ภาพถ่าย": ghyb
}

var overlayMap = {
    "ขอบจังหวัด": prov,
    "ขอบอำเภอ": amp.addTo(map),
    "ขอบตำบล": tam.addTo(map)
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

let loadMap = (x, img) => {
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
    }
}

let showData = async (objArr) => {
    removeLayer();

    let alcohol = 0;
    let cigarat = 0;
    let alcohol_cigarat = 0;

    let tam_1 = { tname: 'ท่าอิฐ', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_2 = { tname: 'ท่าเสา', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_3 = { tname: 'บ้านเกาะ', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_4 = { tname: 'ป่าเซ่า', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_5 = { tname: 'คุ้งตะเภา', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_6 = { tname: 'วังกะพี้', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_7 = { tname: 'หาดกรวด', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_8 = { tname: 'น้ำริด', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_9 = { tname: 'งิ้วงาม', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_10 = { tname: 'ด่านนาขาม', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_11 = { tname: 'บ้านด่าน', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_12 = { tname: 'ผาจุก', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_13 = { tname: 'วังดิน', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_14 = { tname: 'แสนตอ', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_15 = { tname: 'หาดงิ้ว', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_16 = { tname: 'ขุนฝาง', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }
    let tam_17 = { tname: 'ถ้ำฉลอง', alcohol: 0, cigarat: 0, alcohol_cigarat: 0 }


    document.getElementById("total").innerHTML = `จำนวนข้อมูลที่สำรวจ<br><span class="badge badge-success f-24"><b>${objArr.length}</b></span> แห่ง`

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

        if (x.tname == "ท่าอิฐ") {
            x.product_type == "บุหรี่" ? tam_1.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_1.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_1.alcohol_cigarat += 1 : null
        }
        if (x.tname == "ท่าเสา") {
            x.product_type == "บุหรี่" ? tam_2.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_2.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_2.alcohol_cigarat += 1 : null
        }
        if (x.tname == "บ้านเกาะ") {
            x.product_type == "บุหรี่" ? tam_3.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_3.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_3.alcohol_cigarat += 1 : null
        }
        if (x.tname == "ป่าเซ่า") {
            x.product_type == "บุหรี่" ? tam_4.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_4.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_4.alcohol_cigarat += 1 : null
        }
        if (x.tname == "คุ้งตะเภา") {
            x.product_type == "บุหรี่" ? tam_5.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_5.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_5.alcohol_cigarat += 1 : null
        }
        if (x.tname == "วังกะพี้") {
            x.product_type == "บุหรี่" ? tam_6.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_6.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_6.alcohol_cigarat += 1 : null
        }
        if (x.tname == "หาดกรวด") {
            x.product_type == "บุหรี่" ? tam_7.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_7.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_7.alcohol_cigarat += 1 : null
        }
        if (x.tname == "น้ำริด") {
            x.product_type == "บุหรี่" ? tam_8.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_8.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_8.alcohol_cigarat += 1 : null
        }
        if (x.tname == "งิ้วงาม") {
            x.product_type == "บุหรี่" ? tam_9.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_9.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_9.alcohol_cigarat += 1 : null
        }
        if (x.tname == "ด่านนาขาม") {
            x.product_type == "บุหรี่" ? tam_10.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_10.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_10.alcohol_cigarat += 1 : null
        }
        if (x.tname == "บ้านด่าน") {
            x.product_type == "บุหรี่" ? tam_11.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_11.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_11.alcohol_cigarat += 1 : null
        }
        if (x.tname == "ผาจุก") {
            x.product_type == "บุหรี่" ? tam_12.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_12.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_12.alcohol_cigarat += 1 : null
        }
        if (x.tname == "วังดิน") {
            x.product_type == "บุหรี่" ? tam_13.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_13.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_13.alcohol_cigarat += 1 : null
        }
        if (x.tname == "แสนตอ") {
            x.product_type == "บุหรี่" ? tam_14.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_14.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_14.alcohol_cigarat += 1 : null
        }
        if (x.tname == "หาดงิ้ว") {
            x.product_type == "บุหรี่" ? tam_15.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_15.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_15.alcohol_cigarat += 1 : null
        }
        if (x.tname == "ขุนฝาง") {
            x.product_type == "บุหรี่" ? tam_16.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_16.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_16.alcohol_cigarat += 1 : null
        }
        if (x.tname == "ถ้ำฉลอง") {
            x.product_type == "บุหรี่" ? tam_17.alcohol += 1 : null
            x.product_type == "สุรา" ? tam_17.cigarat += 1 : null
            x.product_type == "บุหรี่และสุรา" ? tam_17.alcohol_cigarat += 1 : null
        }

        loadMap(x, img)

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
                <li class="required cursor" onclick="deleteData('${x.gid}')"><i class="bi bi-trash"></i> ลบ</li>
            </ul>
        </div>`
    })

    // console.log(alcohol, cigarat, alcohol_cigarat);
    let tamArr = [tam_1, tam_2, tam_3, tam_4, tam_5, tam_6, tam_7, tam_8, tam_9, tam_10, tam_11, tam_12, tam_13, tam_14, tam_15, tam_16, tam_17];
    // console.log(tamArr);
    loadChart(alcohol, cigarat, alcohol_cigarat, "chart1")
    tamChart(tamArr)
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

let tamChart = (tamArr) => {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create("chartdiv2", am4charts.XYChart);
    chart.data = tamArr;
    chart.legend = new am4charts.Legend();
    chart.legend.position = "right";
    chart.scrollbarX = new am4core.Scrollbar();
    // Create axes
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "tname";
    categoryAxis.renderer.grid.template.opacity = 0;
    // categoryAxis.renderer.labels.template.fontSize = 8;
    categoryAxis.renderer.minGridDistance = 20;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.renderer.grid.template.opacity = 0;
    valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
    valueAxis.renderer.ticks.template.stroke = am4core.color("#495C43");
    valueAxis.renderer.ticks.template.length = 10;
    valueAxis.renderer.line.strokeOpacity = 0.5;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.minGridDistance = 40;
    valueAxis.title.text = "จำนวนร้านที่ขาย";
    // Create series
    function createSeries(field, name) {
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = field;
        series.dataFields.categoryY = "tname";
        series.stacked = true;
        series.name = name;

        var labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.locationX = 0.5;
        labelBullet.label.text = "{valueX}";
        labelBullet.label.fill = am4core.color("#fff");
    }

    chart.cursor = new am4charts.XYCursor();

    createSeries("alcohol", "สุรา");
    createSeries("cigarat", "บุหรี่");
    createSeries("alcohol_cigarat", "สุราและบุหรี่");
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

// loadData()

