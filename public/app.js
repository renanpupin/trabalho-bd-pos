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
                let myLatlng = new google.maps.LatLng(item.location.coordinates[1], item.location.coordinates[0]);

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

async function getPolygon(){
    try{
        let response = await fetch('/api/polygon');
        console.log(response);

        if (response.status !== 200) {
            throw new Error("Erro: "+response.status);
        }

        let responseBody = await response.json();
        console.log(responseBody);

        if(!responseBody.success){
            throw new Error(responseBody.message);
        }else{

            responseBody.polygons.forEach((item) => {
                // console.log(item);

                let coords = item.location.coordinates[0].map(coord => {
                    return {lat: coord[1], lng: coord[0]}
                });

                console.log(coords);

                let polygon = new google.maps.Polygon({
                    paths: coords,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35
                });
                polygon.setMap(map);

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
        center: {lat: -21, lng: -44},
        zoom: 2
    });

    google.maps.event.addListener(map, 'mousemove', function (event) {
        console.log(event.latLng.lat(), event.latLng.lng());
    });

    getPoints();
    getPolygon();

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