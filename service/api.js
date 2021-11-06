const express = require('express');
const app = express.Router();
const con = require("./db");
const db = con.db;

app.post("/alcohol-api/getdataone", (req, res) => {
    const { proj_id } = req.body;
    // console.log(proj_id);
    const sql = `SELECT gid, proj_id, bioname, biodetail, bioplace, biotype, lat,lon,
            pro, amp, tam, pro_name, amp_name, tam_name, 
            TO_CHAR(ndate, 'DD-MM-YYYY') as ndate, usrname, img,   
            ST_AsGeojson(geom) as geojson  
        FROM ud_alcohol WHERE proj_id='${proj_id}'`;

    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/alcohol-api/getdata", (req, res) => {
    const { usrid } = req.body;
    const sql = `SELECT gid, proj_id, bioname, biodetail, bioplace, biotype,
            pro, amp, tam, pro_name, amp_name, tam_name, lat, lon,
            TO_CHAR(ndate, 'DD-MM-YYYY') as ndate, usrname, img,   
            ST_AsGeojson(geom) as geojson  
        FROM ud_alcohol`;

    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/alcohol-api/getownerdata", (req, res) => {
    const { usrid } = req.body;
    const sql = `SELECT gid, proj_id, bioname, biodetail, bioplace, biotype,
            pro, amp, tam, pro_name, amp_name, tam_name, lat, lon,
            TO_CHAR(ndate, 'DD-MM-YYYY') as ndate, usrname, img,   
            ST_AsGeojson(geom) as geojson  
        FROM ud_alcohol WHERE usrid='${usrid}' ORDER BY ndate ASC`;

    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/alcohol-api/insert", async (req, res) => {
    const { data } = req.body;
    let pid = Date.now()
    await db.query(`INSERT INTO ud_alcohol(pid, ts)VALUES('${pid}', now())`)
    let d;
    for (d in data) {
        // console.log(d, data[d]);
        if (data[d] !== '' && d !== 'geom') {
            let sql = `UPDATE ud_alcohol SET ${d}='${data[d]}' WHERE pid='${pid}'`;
            await db.query(sql)
        }
    }

    // console.log(data);

    if (data.geom !== "") {
        let sql = `UPDATE ud_alcohol SET geom = ST_GeomfromGeoJSON('${JSON.stringify(data.geom.geometry)}') 
            WHERE pid='${pid}'`;
        await db.query(sql)
    }
    res.status(200).json({
        data: "success"
    })
})

app.post("/alcohol-api/update", async (req, res) => {
    const { proj_id, data } = req.body;
    let d;
    for (d in data) {
        if (data[d] !== '' && d !== 'geom') {
            let sql = `UPDATE ud_alcohol SET ${d}='${data[d]}', ndate=now() WHERE proj_id='${proj_id}'`;
            await db.query(sql)
        }
    }

    if (data.geom !== "" && data.geom.geometry) {
        let sql = `UPDATE ud_alcohol SET geom = ST_GeomfromGeoJSON('${JSON.stringify(data.geom.geometry)}') 
            WHERE proj_id='${proj_id}'`;
        await db.query(sql)
    }
    res.status(200).json({
        data: "success"
    })
})

app.post("/alcohol-api/delete", (req, res) => {
    const { proj_id } = req.body;
    const sql = `DELETE FROM ud_alcohol WHERE proj_id='${proj_id}'`
    // console.log(sql);
    db.query(sql).then(r => {
        res.status(200).json({
            data: "success"
        })
    })
})

module.exports = app;