function initializeLiff() {
    liff.init({
        liffId: "1656610153-zABWNJ9d"
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

var url = 'https://rti2dss.com:4000';
// var url = 'http://localhost:4000'

let getData = (usrid) => {
    axios.post(url + "/alcohol-api/getuser", { usrid }).then((r) => {
        console.log(r);
        if (r.data.data.length > 0) {
            document.getElementById("username").value = r.data.data[0].username;
            document.getElementById("agency").value = r.data.data[0].agency;
            document.getElementById("btn").innerHTML = `<button class="btn btn-success" id="updateuser" onclick="updateUser()"><i
            class="bi bi-save"></i> บันทึก</button>`
        } else {
            document.getElementById("btn").innerHTML = `<button class="btn btn-primary" id="insertuser" onclick="insertUser()"><i
            class="bi bi-save"></i> บันทึก</button>`
        }
    })
}

let insertUser = () => {
    let usrid = document.getElementById("usrid").value;
    let username = document.getElementById("username").value;
    let agency = document.getElementById("agency").value;
    let linename = document.getElementById("displayName").value;
    axios.post(url + "/alcohol-api/insertuser", { usrid, username, agency, linename }).then((r) => {
        getData(usrid)
    })
}

let updateUser = () => {
    let usrid = document.getElementById("usrid").value;
    let username = document.getElementById("username").value;
    let agency = document.getElementById("agency").value;
    axios.post(url + "/alcohol-api/updateuser", { usrid, username, agency }).then((r) => {
        getData(usrid)
    })
}

async function getUserid() {
    const profile = await liff.getProfile();
    // console.log(profile);
    document.getElementById("usrid").value = await profile.userId;
    document.getElementById("profile").src = await profile.pictureUrl;
    document.getElementById("displayName").value = await profile.displayName;
    // document.getElementById("displayName").innerHTML = await profile.displayName;
    // console.log(profile);
    getData(await profile.userId)
}

initializeLiff()

