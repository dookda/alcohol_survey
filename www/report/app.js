// var userId;
// async function getUserid() {
//     const profile = await liff.getProfile();
//     console.log(profile)
//     userId = await profile.userId;

//     $('#profile').attr('src', await profile.pictureUrl);
//     // $('#userId').text(profile.userId);
//     $('#statusMessage').text(await profile.statusMessage);
//     $('#displayName').text(await profile.displayName);
// }

var url = 'https://rti2dss.com:3150';


// var url = 'http://localhost:3000'

let loadData = () => {
    axios.post(url + '/alcohol-api/getdata', { usrid: 'usrid' }).then((r) => {
        r.data.data.map(x => {
            let img;
            x.product_type == "บุหรี่" ? img = "cigarettes.png" : null;
            x.product_type == "สุรา" ? img = "alcohol.png" : null;
            x.product_type == "บุหรี่และสุรา" ? img = "no-alcohol.png" : null;
            document.getElementById("content").innerHTML += `<div class="inner-box mt-2" >
                <div class="content" >
                    <span class="company-logo"><img src="./../images/${img}" alt=""></span>
                    <h4><span>${x.owner_name}</span></h4>
                    <ul class="job-info">
                        <li><i class="bi bi-cash-coin"></i> ${x.retail_type}</li>
                        <li><i class="bi bi-cart3"></i> ${x.product_type}</li>
                        <li><i class="bi bi-journal-check"></i> ${x.certification}ใบอนุญาต</li>
                        <li><i class="bi bi-calendar-week"></i> ${x.ndate}</li>
                    </ul>
                </div>
                <ul class="job-other-info ">
                    <li class="f-16 privacy cursor" onclick="editData('${x.pid}')"><i class="bi bi-clipboard-data"></i> รายละเอียด</li>
                    <li class="required cursor" onclick="deleteData('${x.pid}')"><i class="bi bi-trash"></i> ลบ</li>
                </ul>
            </div>`
        })
    })
}

let deleteData = (pid) => {
    axios.post(url + '/alcohol-api/delete', { pid }).then(r => {
        document.getElementById("content").innerHTML = "";
        loadData()
    })
}

let editData = (pid) => {
    sessionStorage.setItem("pid", pid);
    location.href = "./../edit/index.html";
}

loadData()

