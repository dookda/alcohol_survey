// const url = "https://rti2dss.com/p4000"
const url = "http://localhost:4000"

const showChart = (div, data) => {
    var root = am5.Root.new(div);
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

    xAxis.data.setAll(data);
    series.data.setAll(data);

    series.appear(1000);
    chart.appear(1000, 100);
}


axios.post(url + '/tobe1/getbyage/', { group: 1 }).then(r => {
    let data = r.data.data.map(i => {
        let a = i.hosname.replace("โรงพยาบาลส่งเสริมสุขภาพตำบล", "รพ.สต.")
        let b = a.replace("สถานพยาบาลเรือนจำจังหวัดอุตรดิตถ์", "สถานพยาบาลอื่นๆ")
        return { name: b, value: Number(i.count) }
    })
    showChart("chart1", data)
})

axios.post(url + '/tobe1/getbyage/', { group: 2 }).then(r => {
    let data = r.data.data.map(i => {
        let a = i.hosname.replace("โรงพยาบาลส่งเสริมสุขภาพตำบล", "รพ.สต.")
        let b = a.replace("สถานพยาบาลเรือนจำจังหวัดอุตรดิตถ์", "สถานพยาบาลอื่นๆ")
        return { name: b, value: Number(i.count) }
    })
    showChart("chart2", data)
})





