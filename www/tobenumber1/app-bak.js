const url = "https://rti2dss.com/p4000"

var root = am5.Root.new("chart1");
root.setThemes([
    am5themes_Animated.new(root)
]);

var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX",
    pinchZoomX: true
}));

var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
cursor.lineY.set("visible", false);

var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
xRenderer.labels.template.setAll({
    rotation: -90,
    centerY: am5.p50,
    centerX: am5.p100,
    paddingRight: 15
});

var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    maxDeviation: 0.3,
    categoryField: "name",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
}));

var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation: 0.3,
    renderer: am5xy.AxisRendererY.new(root, {})
}));

var series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Series 1",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    sequencedInterpolation: true,
    categoryXField: "name",
    tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY} คน"
    })
}));

series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
series.columns.template.adapters.add("fill", function (fill, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
});

series.columns.template.adapters.add("stroke", function (stroke, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
});

series.appear(1000);
chart.appear(1000, 100);

var root2 = am5.Root.new("chart2");
root2.setThemes([
    am5themes_Animated.new(root2)
]);

var chart2 = root2.container.children.push(am5xy.XYChart.new(root2, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX",
    pinchZoomX: true
}));

var cursor2 = chart2.set("cursor", am5xy.XYCursor.new(root2, {}));
cursor2.lineY.set("visible", false);

var xRenderer2 = am5xy.AxisRendererX.new(root2, { minGridDistance: 30 });
xRenderer2.labels.template.setAll({
    rotation: -90,
    centerY: am5.p50,
    centerX: am5.p100,
    paddingRight: 15
});

var xAxis2 = chart2.xAxes.push(am5xy.CategoryAxis.new(root2, {
    maxDeviation: 0.3,
    categoryField: "name",
    renderer: xRenderer2,
    tooltip: am5.Tooltip.new(root2, {})
}));

var yAxis2 = chart2.yAxes.push(am5xy.ValueAxis.new(root2, {
    maxDeviation: 0.3,
    renderer: am5xy.AxisRendererY.new(root2, {})
}));

var series2 = chart2.series.push(am5xy.ColumnSeries.new(root2, {
    name: "Series 1",
    xAxis: xAxis2,
    yAxis: yAxis2,
    valueYField: "value",
    sequencedInterpolation: true,
    categoryXField: "name",
    tooltip: am5.Tooltip.new(root2, {
        labelText: "{valueY} คน"
    })
}));

series2.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
series2.columns.template.adapters.add("fill", function (fill, target) {
    return chart2.get("colors").getIndex(series2.columns.indexOf(target));
});

series2.columns.template.adapters.add("stroke", function (stroke, target) {
    return chart2.get("colors").getIndex(series2.columns.indexOf(target));
});

series2.appear(1000);
chart2.appear(1000, 100);

let hname = document.getElementById("hname");

const getHname = () => {
    axios.post(url + '/tobe1/gethname/').then(r => {
        r.data.data.map(i => {
            hname.innerHTML += `<option value="${i.hospcode}">${i.hosname}</option>`;
        })
    })
}

const getHcount = (hospcode) => {
    axios.post(url + '/tobe1/gethcount/', { hospcode }).then(r => {
        let data = r.data.data.map(i => {
            let a = i.hosname.replace("โรงพยาบาลส่งเสริมสุขภาพตำบล", "รพ.สต.")
            let b = a.replace("สถานพยาบาลเรือนจำจังหวัดอุตรดิตถ์", "อื่นๆ")
            return { name: b, value: Number(i.count) }
        })
        xAxis.data.setAll(data);
        series.data.setAll(data);
    })
}

const getParam = (hospcode, colname) => {
    axios.post(url + '/tobe1/getparam', { hospcode, colname }).then(r => {
        console.log(r.data.data);
        let data = r.data.data.map(i => {
            return { name: i.sex == 1 ? "ชาย" : "หญิง", value: Number(i.count) }
        })
        xAxis2.data.setAll(data);
        series2.data.setAll(data);
    })
}

const hospcode = '9999';
const colname = "sex"

const onHchang = () => {
    const hospcode = document.getElementById('hname').value;
    // console.log(hname);
    getHcount(hospcode)
    getParam(hospcode, colname)
}

getHname()
getHcount(hospcode)
getParam(hospcode, colname)



