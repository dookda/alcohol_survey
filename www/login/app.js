

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


document.getElementById("alcohol_item").style.visibility = "hidden";
let handleAlcohol = () => {
    let alcoholRadio = document.querySelector('input[name="alcohol"]:checked').value
    if (alcoholRadio == "false") {
        document.getElementById("alcohol_item").style.visibility = "visible";
    } else {
        document.getElementById("alcohol_item").style.visibility = "hidden";
    }
}

document.getElementById("cigarette_item").style.visibility = "hidden";
let handleCigarette = () => {
    let alcoholRadio = document.querySelector('input[name="cigarette"]:checked').value
    if (alcoholRadio == "false") {
        document.getElementById("cigarette_item").style.visibility = "visible";
    } else {
        document.getElementById("cigarette_item").style.visibility = "hidden";
    }
}

let saveData = () => {
    $("#status").empty().text("File is uploading...");

    if (!dataurl) {
        dataurl = '-';
    }

    // alert(dataurl)

    const obj = {
        data: {
            owner_name: document.getElementById('owner_name').value,
            retail_type: document.getElementById('retail_type').value,
            product_type: document.getElementById('product_type').value,
            certification: document.getElementById('certification').value,
            addresses: document.getElementById('addresses').value,
            retail_status: document.getElementById('retail_status').value,
            alcohol_survey: document.getElementById('alcohol_survey').value,
            alcohol: document.querySelector('input[name="alcohol"]:checked').value,
            alcohol_item: document.getElementById('alcohol_item').value,
            cigarette_survey: document.getElementById('cigarette_survey').value,
            cigarette: document.querySelector('input[name="cigarette"]:checked').value,
            cigarette_item: document.getElementById('cigarette_item').value,
            lat: document.getElementById('lat').value,
            lng: document.getElementById('lng').value,
            img: dataurl ? dataurl : dataurl = "",
            geom: geom == "" ? "" : geom.toGeoJSON()
        }
    }
    console.log(obj);

    axios.post(url + '/alcohol-api/insert', obj).then((res) => {
        // if (res.status == 'success') {
        //     closed();
        // }
        // $('form :input').val('');
        // $('#preview').attr('src', '');
        console.log("ok");
    })
};

function closed() {
    // liff.closeWindow();
}


