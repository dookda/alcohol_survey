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

app.get("/alcohol-api/getdata", (req, res) => {
    // const { usrid } = req.body;

    const sql = `SELECT gid, pid, CONCAT(retail_name, owner_name, addresses, retail_type, product_type) as txt,
            retail_name, owner_name, retail_type, product_type, 
            certification, addresses, retail_status, alcohol_survey, alcohol, 
            alcohol_item, cigarette_survey, cigarette, cigarette_item,lat,lng,tname,
            TO_CHAR(ts, 'DD-MM-YYYY') as ndate, ST_AsGeojson(geom) as geojson  
        FROM v_ud_alcohol ORDER BY ts DESC`;
    // console.log(sql);
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/alcohol-api/getselectdata", (req, res) => {
    const { gid } = req.body;
    const sql = `SELECT gid, pid, retail_name, owner_name, retail_type, product_type, 
        certification, addresses, retail_status, alcohol_survey, alcohol, 
        alcohol_item, cigarette_survey, cigarette, cigarette_item,lat,lng,tname,
        TO_CHAR(ts, 'DD-MM-YYYY') as ndate, img, ST_AsGeojson(geom) as geojson  
    FROM v_ud_alcohol WHERE gid='${gid}' ORDER BY ts DESC`;

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
    const { pid, data } = req.body;
    let d;
    for (d in data) {
        if (data[d] !== '' && d !== 'geom') {
            let sql = `UPDATE ud_alcohol SET ${d}='${data[d]}', ts=now() WHERE pid='${pid}'`;
            await db.query(sql)
        }
    }

    if (data.geom !== "" && data.geom.geometry) {
        let sql = `UPDATE ud_alcohol SET geom = ST_GeomfromGeoJSON('${JSON.stringify(data.geom.geometry)}') 
            WHERE pid='${pid}'`;
        await db.query(sql)
    }
    res.status(200).json({
        data: "success"
    })
})

app.post("/alcohol-api/delete", (req, res) => {
    const { gid } = req.body;
    const sql = `DELETE FROM ud_alcohol WHERE gid='${gid}'`
    // console.log(sql);
    db.query(sql).then(r => {
        res.status(200).json({
            data: "success"
        })
    })
})

app.post("/alcohol-api/getalluser", (req, res) => {
    const { usrid } = req.body;
    const sql = `SELECT * FROM usertb ORDER BY username ASC`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/alcohol-api/getuser", (req, res) => {
    const { usrid } = req.body;
    const sql = `SELECT * FROM usertb WHERE usrid='${usrid}'`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/alcohol-api/insertuser", (req, res) => {
    const { usrid, username, agency, linename } = req.body;
    const sql = `INSERT INTO usertb(usrid, username, agency, linename)VALUES('${usrid}', '${username}', '${agency}', '${linename}') `;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/alcohol-api/updateuser", (req, res) => {
    const { usrid, username, agency } = req.body;
    const sql = `UPDATE usertb SET username='${username}', agency='${agency}'  WHERE usrid='${usrid}'`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/alcohol-api/deleteuser", (req, res) => {
    const { usrid } = req.body;
    const sql = `DELETE FROM usertb WHERE usrid='${usrid}'`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

app.post("/alcohol-api/updateauth", (req, res) => {
    const { usrid, usertype } = req.body;
    const sql = `UPDATE usertb SET usertype='${usertype}' WHERE usrid='${usrid}'`;
    db.query(sql).then(r => {
        res.status(200).json({
            data: r.rows
        })
    })
})

module.exports = app;