let map;

async function getPoints(){
    try{
        let response = await fetch('/api/point');
        console.log(response);

        if (response.status !== 200) {
            throw new Error("Erro: "+response.status);
        }

        let responseBody = await response.json();
        console.log(responseBody);

        if(!responseBody.success){
            throw new Error(responseBody.message);
        }else{

            responseBody.points.forEach((item) => {
                let myLatlng = new google.maps.LatLng(item.location.coordinates[0], item.location.coordinates[1]);

                let marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: item.name
                });
            });
        }
    } catch (err) {
        console.log(err);
        alert('Fetch Error:'+ err.message);
    }
}

function initMap() {
    console.log("initMap");

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -21.397, lng: -44.644},
        zoom: 4
    });

    getPoints();

    // $.get( "http://localhost:1345/", function( data ) {
    //
    //     var lat=-20.1;
    //     var lon=50.1;
    //
    //     var myLatlng = new google.maps.LatLng(lat, lon);
    //     var mapProp = {
    //         center:myLatlng,
    //         zoom:5,
    //         mapTypeId:google.maps.MapTypeId.ROADMAP,
    //         mapTypeControl: false
    //     };
    //
    //     //criando objeto mapa
    //     var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
    //
    //     var obj = jQuery.parseJSON(data);
    //
    //     $.each($.parseJSON(data), function(idx, obj) {
    //
    //         var lat=obj.lat;
    //         var lon=obj.lon;
    //
    //         var myLatlng = new google.maps.LatLng(lat, lon);
    //
    //         var marker = new google.maps.Marker({
    //             position: myLatlng,
    //             map: map,
    //             title: obj.nome
    //         });
    //     });
    //
    // });
}