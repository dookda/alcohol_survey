
// var url = 'http://localhost:4000'
// var url = 'http://localhost:4000';

document.getElementById("total").innerHTML = `<div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span> </div>`
document.getElementById("chart1").innerHTML = `<div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span> </div>`
document.getElementById("chartdiv2").innerHTML = `<div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span> </div>`

let map = L.map('map', {
    center: [17.720, 100.200],
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

var prov = L.tileLayer.wms("https://rti2dss.com/geoserver/th/wms?", {
    layers: 'th:province_4326',
    format: 'image/png',
    transparent: true,
    CQL_FILTER: 'pro_code=53'
});

var amp = L.tileLayer.wms("https://rti2dss.com/geoserver/th/wms?", {
    layers: 'th:amphoe_4326',
    format: 'image/png',
    transparent: true,
    CQL_FILTER: 'pro_code=53'
});

var tam = L.tileLayer.wms("https://rti2dss.com/geoserver/th/wms?", {
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

let xdata = axios.get('/alcohol-api/getdata')
let datArr = []
let loadData = () => {
    datArr = []
    xdata.then(async (r) => {
        // console.log(r);
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
    const ciga = L.icon({
        iconUrl: "./../images/ciga.png",
        iconSize: [32, 35],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    const alcohol = L.icon({
        iconUrl: "./../images/alco.png",
        iconSize: [32, 35],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    const both = L.icon({
        iconUrl: "./../images/both.png",
        iconSize: [32, 35],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    if (x.geojson) {
        let json = JSON.parse(x.geojson).coordinates;
        let marker = L.marker([json[1], json[0]], {
            draggable: false,
            name: 'p',
            icon: x.product_type == "บุหรี่" ? ciga : x.product_type == "เหล้า" ? alcohol : both
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

let showMap = async (arr) => {
    removeLayer();
    arr.map(x => {
        x.product_type == "บุหรี่และสุรา" || x.product_type == "เหล้าและบุหรี่" ? loadMap(x, 'no-alcohol.png') : null;
        x.product_type == "สุรา" || x.product_type == "เหล้า" ? loadMap(x, 'alcohol.png') : null;
        x.product_type == "บุหรี่" || x.product_type == "บุหรี" ? loadMap(x, 'cigarettes.png') : null;
    });
}

let zoomMap = (lon, lat, retail_name, owner_name, product_type) => {
    map.setView([lat, lon], 14);
    let img;
    product_type == "บุหรี่และสุรา" || product_type == "เหล้าและบุหรี่" ? img = 'no-alcohol.png' : product_type == "สุรา" || product_type == "เหล้า" ? img = 'alcohol.png' : img = 'cigarettes.png';

    L.popup({ offset: L.point(5, -24) })
        .setLatLng([lat, lon])
        .setContent(`<div class="row">
                        <div class="col-4">
                            <img src="./../images/${img}" alt="" width="50px">
                        </div>
                        <div class="col-8 f-popup">
                            <b>ชื่อร้าน:</b> ${retail_name}
                            <br><b>เจ้าของ:</b> ${owner_name}
                            <br><b>ประเภทที่จำหน่าย:</b> ${product_type}
                        </div>
                    </div>`)
        .openOn(map);
}

let groupTam = (data) => {
    document.getElementById("total").innerHTML = `จำนวนข้อมูลที่สำรวจ<br><span class="badge badge-success f-24"><b>${data.length}</b></span> แห่ง`;

    let tam = [{ tname: 'ท่าอิฐ' }, { tname: 'ท่าเสา' }, { tname: 'บ้านเกาะ' }, { tname: 'ป่าเซ่า' }, { tname: 'คุ้งตะเภา' }, { tname: 'วังกะพี้' }, { tname: 'หาดกรวด' }, { tname: 'น้ำริด' }, { tname: 'งิ้วงาม' }, { tname: 'ด่านนาขาม' }, { tname: 'บ้านด่าน' }, { tname: 'ผาจุก' }, { tname: 'วังดิน' }, { tname: 'แสนตอ' }, { tname: 'หาดงิ้ว' }, { tname: 'ขุนฝาง' }, { tname: 'ถ้ำฉลอง' }];

    let ciga = data.filter(x => x.product_type == "บุหรี่" || x.product_type == "บุหรี")
    var cigat = _(ciga).groupBy('tname').map((i, name) => ({ tname: name, cigarat: i.length })).value();

    let alcohol = data.filter(x => x.product_type == "สุรา" || x.product_type == "เหล้า")
    var alcoholt = _(alcohol).groupBy('tname').map((i, name) => ({ tname: name, alcohol: i.length })).value();

    let both = data.filter(x => x.product_type == "บุหรี่และสุรา" || x.product_type == "เหล้าและบุหรี่")
    var botht = _(both).groupBy('tname').map((i, name) => ({ tname: name, alcohol_cigarat: i.length })).value();

    const a3 = tam.map(t1 => ({ ...t1, ...cigat.find(t2 => t2.tname === t1.tname) }));
    const a4 = a3.map(t1 => ({ ...t1, ...alcoholt.find(t2 => t2.tname === t1.tname) }));
    const a5 = a4.map(t1 => ({ ...t1, ...botht.find(t2 => t2.tname === t1.tname) }));
    tamChart(a5);

    let summbyType = _(data).groupBy('product_type').map((i, name) => ({ type: name, value: i.length })).value();
    loadChart(summbyType, "chart1");
}

let showData = async () => {
    $.extend(true, $.fn.dataTable.defaults, {
        "language": {
            "sProcessing": "กำลังดำเนินการ...",
            "sLengthMenu": "แสดง_MENU_ แถว",
            "sZeroRecords": "ไม่พบข้อมูล",
            "sInfo": "แสดง _START_ ถึง _END_ จาก _TOTAL_ แถว",
            "sInfoEmpty": "แสดง 0 ถึง 0 จาก 0 แถว",
            "sInfoFiltered": "(ทั้งหมด _MAX_ แถว)",
            "sInfoPostFix": "",
            "sSearch": "ค้นหา:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "เริ่มต้น",
                "sPrevious": "ก่อนหน้า",
                "sNext": "ถัดไป",
                "sLast": "สุดท้าย"
            }
        }
    });
    let table = $('#example').DataTable({
        ajax: {
            url: '/alcohol-api/getdata',
            dataSrc: 'data',
            cache: true,
        },
        columns: [
            { data: 'gid' },
            { data: 'retail_name' },
            { data: 'product_type' },
            { data: 'owner_name' },
            { data: 'tname' },
            {
                data: null,
                render: function (data, type, row, meta) {
                    const json = JSON.parse(data.geojson);
                    if (json !== null) {
                        return `
                            <button onclick="zoomMap(${json.coordinates[0]},${json.coordinates[1]},'${data.retail_name}','${data.owner_name}','${data.retail_type}')" class="btn btn-margin btn-success" ><i class="bi bi-map"></i> ซูม</button>
                            <button onclick="editData(${data.gid})" class="btn btn-margin btn-warning" ><i class="bi bi-clipboard-data"></i> แก้ไข</button>
                            `
                    } else {
                        return ''
                    }
                    // <button onclick="deleteData(${data.gid})" class="btn btn-margin btn-danger" ><i class="bi bi-clipboard-x"></i> ลบ</button>
                },
            },
        ],
        dom: 'Bfrtip',
        buttons: [
            'excel', 'print'
        ],
        responsive: true,
        scrollX: true
    });

    table.on('search.dt', () => {
        let data = table.rows({ search: 'applied' }).data();
        // console.log(data);
        showMap(data)
        groupTam(data)
    });

    let findData = function () {
        console.log(this.value);
        table.search(this.value).draw();
    }
    document.getElementById("tam").addEventListener("change", findData);
}

let editData = (gid) => {
    location.href = "./../edit/index.html?gid=" + gid;
}

let deleteData = (gid) => {
    $("#gid").val(gid)
    $("#gidlabel").text(gid)
    $("#deleteModal").modal("show")
}

let closeModal = () => {
    // $('#editModal').modal('hide')
    $('#deleteModal').modal('hide')
    // $('#example').DataTable().ajax.reload();
}

let deleteValue = () => {
    // console.log($("#projId").val());
    $("#deleteModal").modal("hide");
    let gid = $("#gid").val();
    axios.post("/alcohol-api/delete", { gid }).then(r => {
        r.data.data == "success" ? closeModal() : null
        $('#example').DataTable().ajax.reload();
    })
}

// chart.dispose();
let loadChart = (data) => {
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create("chart1", am4charts.XYChart);
    chart.data = data;

    chart.padding(40, 40, 40, 40);

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "type";
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
    series.dataFields.categoryX = "type";
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
    createSeries("cigarat", "บุหรี่");
    createSeries("alcohol", "สุรา");
    createSeries("alcohol_cigarat", "บุหรี่และสุรา");

}


loadData()



