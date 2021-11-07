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

var url = 'https://rti2dss.com:3150';
// var url = 'http://localhost:3000'



let getData = (usrid) => {
    axios.post(url + "/alcohol-api/getuser", { usrid }).then((r) => {
        console.log(r);
        if (r.data.data.length > 0) {
            document.getElementById("displayName").value = r.data.data[0].username
            document.getElementById("agency").value = r.data.data[0].username
            document.getElementById("insertuser").style.visibility = "hidden";
            document.getElementById("updateuser").style.visibility = "visible";
        } else {
            document.getElementById("insertuser").style.visibility = "visible";
            document.getElementById("updateuser").style.visibility = "hidden";
        }
    })
}

let insertUser = (usrid) => {
    let username = document.getElementById("displayName").value;
    let agency = document.getElementById("agency").value;
    let linename = document.getElementById("displayName").value;
    axios.post(url + "/alcohol-api/insertuser", { usrid, username, agency, linename }).then((r) => {
        getData(usrid)
    })
}

let updateUser = (usrid) => {
    let username = document.getElementById("displayName").value;
    let agency = document.getElementById("agency").value;
    axios.post(url + "/alcohol-api/updateuser", { usrid, username, agency }).then((r) => {
        getData(usrid)
    })
}

async function getUserid() {
    const profile = await liff.getProfile();
    // console.log(profile);
    // document.getElementById("userid").value = await profile.userId;
    document.getElementById("profile").src = await profile.pictureUrl;
    document.getElementById("displayName").value = await profile.displayName;
    // document.getElementById("displayName").innerHTML = await profile.displayName;
    // console.log(profile);
    getData(await profile.userId)
}

initializeLiff()

