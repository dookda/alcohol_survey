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
}

// initializeLiff()

// var url = 'https://rti2dss.com:4000';
var url = 'http://localhost:4000'
let xdata = axios.post(url + '/alcohol-api/getdata', { usrid: 'usrid' })
let datArr = []
let loadData = () => {
    datArr = []
    xdata.then((r) => {
        datArr.push(r.data.data)
        showData(r.data.data)
    })
}

let showData = (objArr) => {
    objArr.map(x => {
        let img;
        // console.log(x);
        x.product_type == "บุหรี่" || x.product_type == "บุหรี" ? img = "cigarettes.png" : null;
        x.product_type == "สุรา" || x.product_type == "เหล้า" ? img = "alcohol.png" : null;
        x.product_type == "บุหรี่และสุรา" || x.product_type == "เหล้าและบุหรี่" ? img = "no-alcohol.png" : null;
        document.getElementById("content").innerHTML += `<div class="inner-box mt-2" >
            <div class="content" >
                <span class="company-logo"><img src="./../images/${img}" alt=""></span>
                <h4><span>${x.retail_name}</span></h4>
                <span>${x.owner_name}</span>
                <ul class="job-info">
                    <li><i class="bi bi-cash-coin"></i> ${x.retail_type}</li>
                    <li><i class="bi bi-cart3"></i> ${x.product_type}</li>
                    <li><i class="bi bi-journal-check"></i> ${x.certification}ใบอนุญาต</li>
                    <li><i class="bi bi-calendar-week"></i> ${x.ndate}</li>
                </ul>
            </div>
            <ul class="job-other-info ">
                <li class="f-16 privacy cursor" onclick="editData('${x.gid}')"><i class="bi bi-clipboard-data"></i> รายละเอียด</li>
                <li class="required cursor" onclick="deleteData('${x.gid}')"><i class="bi bi-trash"></i> ลบ</li>
            </ul>
        </div>`
    })
}

let findData = () => {
    document.getElementById("content").innerHTML = "";
    let find = document.getElementById('find').value;
    let datFilter = datArr[0].filter(x => x.txt.includes(find))
    console.log(datFilter);
    showData(datFilter)
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

