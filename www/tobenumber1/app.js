
let hname = document.getElementById("hname");

const getHname = (hospcode) => {
    axios.post('/tobe1/gethname/', { hospcode }).then(r => {
        r.data.data.map(i => {
            console.log(i);
            hname.innerHTML += `<option value="${i.hospcode}">${i.hosname}</option>`;
        })
    })
}

const getParam = (hospcode, colname) => {
    axios.post('/tobe1/getparam', { hospcode, colname }).then(r => {
        r.data.data.map(i => {
            console.log(i);
        })
    })
}

const hospcode = 6266;
const colname = "sex"

getHname(6266)
getParam(hospcode, colname)