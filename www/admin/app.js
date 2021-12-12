function initializeLiff() {
    liff.init({
        liffId: "1656610153-2DajoZbQ"
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

let loadData = () => {
    axios.post(url + '/alcohol-api/getalluser', { usrid: 'usrid' }).then((r) => {
        r.data.data.map(x => {
            document.getElementById("content").innerHTML += `<div class="inner-box mt-2" >
                <div class="content" >
                    <span class="company-logo"><img src="./../images/user.png" alt=""></span>
                    <h4><span>${x.username}</span></h4>
                    <ul class="job-info">
                        <li>ไลน์: ${x.linename}</li>
                        <li>สังกัด: ${x.agency}</li>
                        <li>สถานะ: ${x.usertype}</li>
                    </ul>
                </div>
                <ul class="job-other-info ">
                    <li class="privacy cursor" onclick="setUser('${x.usrid}')"><i class="bi bi-clipboard-data"></i> กำหนดเป็นผู้ใช้งาน</li>
                    <li class="privacy cursor" onclick="setAdmin('${x.usrid}')"><i class="bi bi-clipboard-data"></i> กำหนดเป็น Admin</li>
                    <li class="required cursor" onclick="deleteUser('${x.usrid}')"><i class="bi bi-trash"></i> ลบ</li>
                </ul>
            </div>`
        })
    })
}

let deleteUser = (usrid) => {
    axios.post(url + '/alcohol-api/deleteuser', { usrid }).then(r => {
        document.getElementById("content").innerHTML = "";
        loadData()
    })
}

let setUser = (usrid, usertype) => {
    axios.post(url + '/alcohol-api/updateauth', { usrid, usertype: "ผู้ใช้" }).then(r => {
        document.getElementById("content").innerHTML = "";
        loadData()
    })
}

let setAdmin = (usrid, usertype) => {
    axios.post(url + '/alcohol-api/updateauth', { usrid, usertype: "admin" }).then(r => {
        document.getElementById("content").innerHTML = "";
        loadData()
    })
}



