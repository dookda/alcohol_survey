

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

// var url = 'https://rti2dss.com:3100';


var url = 'http://localhost:3000'

let loadData = () => {
    axios.post(url + '/alcohol-api/getdata', { usrid: 'usrid' }).then((r) => {
        console.log(r.data.data);

        r.data.data.map(x => {
            console.log(x);
        })

        // r.data.map((x) => {
        //     document.getElementById("content").innerHTML += `<div class="content" >
        //     <span class="company-logo"><img src="./../images/liquor.png" alt=""></span>
        //     <h4><span href="#">Software Engineer (Android), Libraries</span></h4>
        //         <ul class="job-info">
        //             <li><span class="icon flaticon-money"></span>ประเภทร้าน</li>
        //             <li><span class="icon flaticon-money"></span>จำหน่าย</li>
        //             <li><span class="icon flaticon-briefcase"></span> ใบอนุญาตจำหน่าย</li>
        //             <li><span class="icon flaticon-map-locator"></span> ที่อยู่</li>
        //         </ul>
        //     </div>
        //     <ul class="job-other-info">
        //         <li class="privacy">ดูรายละเอียดเพิ่มเติม</li>
        //         <li class="required">ลบ</li>
        //     </ul>`
        // })
    })
}

loadData()

