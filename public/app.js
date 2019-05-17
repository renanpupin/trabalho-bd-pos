let map;

let bounds;

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

            let size = 503.947;
            let scale = 75;
            responseBody.points.forEach((item) => {
                let myLatlng = new google.maps.LatLng(item.location.coordinates[1], item.location.coordinates[0]);

                let marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: item.name,
                    icon: {
                        url: './rocket.svg',
                        size: new google.maps.Size(size, size),
                        scaledSize: new google.maps.Size(scale, scale),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(scale/2, scale)
                    },
                    animation: google.maps.Animation.BOUNCE,
                });
            });

            // function toggleBounce() {
            //     if (marker.getAnimation() !== null) {
            //         marker.setAnimation(null);
            //     } else {
            //         marker.setAnimation(google.maps.Animation.BOUNCE);
            //     }
            // }
        }
    } catch (err) {
        console.log(err);
        alert('Fetch Error:'+ err.message);
    }
}

async function getOcorrencias(){
    try{
        let response = await fetch('/api/ocorrencias');
        console.log(response);

        if (response.status !== 200) {
            throw new Error("Erro: "+response.status);
        }

        let responseBody = await response.json();
        console.log(responseBody);

        if(!responseBody.success){
            throw new Error(responseBody.message);
        }else{

            responseBody.ocorrencias.forEach((item) => {
                let myLatlng = new google.maps.LatLng(item.localizacao.coordinates[1], item.localizacao.coordinates[0]);

                let marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: item._id,
                    numero_bo: item.numero_bo,
                    mes: item.mes,
                    ano: item.ano,
                    crime: item.crime,
                    delegacia: item.delegacia,
                    nome_departamento: item.nome_departamento,
                    cidade: item.cidade,
                    logradouro: item.logradouro,
                });

                marker.addListener('click', function() {
                    new google.maps.InfoWindow({
                        content: "<div>"+
                            "<p>Número do BO: "+this.numero_bo+"</p>"+
                            "<p>Mês: "+this.mes+"</p>"+
                            "<p>Ano: "+this.ano+"</p>"+
                            "<p>Crime: "+this.crime+"</p>"+
                            "<p>Delegacia: "+this.delegacia+"</p>"+
                            "<p>Departamento: "+this.nome_departamento+"</p>"+
                            "<p>Cidade: "+this.cidade+"</p>"+
                            "<p>Logradouro: "+this.logradouro+"</p>"+
                            "</div>",
                        maxWidth: 400
                    }).open(map, this);
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

async function getGeometry(){
    try{
        let response = await fetch('/api/geometry');
        console.log(response);

        if (response.status !== 200) {
            throw new Error("Erro: "+response.status);
        }

        let responseBody = await response.json();
        console.log(responseBody);

        if(!responseBody.success){
            throw new Error(responseBody.message);
        }else{

            responseBody.geometries.forEach((item) => {
                console.log(item);

                if(item.location.type === "Point"){
                    let myLatlng = new google.maps.LatLng(item.location.coordinates[1], item.location.coordinates[0]);

                    let marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        title: item.name,
                        // animation: google.maps.Animation.BOUNCE,
                    });
                }else if(item.location.type === "Polygon") {

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
                }else{
                    alert("Tipo de geometria não suportado.");
                }
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
        gestureHandling: 'cooperative',
        center: {lat: -21, lng: -44},
        zoom: 2
    });

    //https://developers.google.com/maps/documentation/javascript/examples/directions-draggable

    google.maps.event.addListener(map, 'mousemove', function (event) {
        console.log(event.latLng.lat(), event.latLng.lng());
    });


    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            // console.log(pos);

            // let size = 512;
            // let scale = 50;
            // let userLocationMarker = new google.maps.Marker({
            //     id: "user",
            //     position: pos,
            //     icon: {
            //         url: './astronaut.svg',
            //         size: new google.maps.Size(size, size),
            //         scaledSize: new google.maps.Size(scale, scale),
            //         origin: new google.maps.Point(0, 0),
            //         anchor: new google.maps.Point(scale/2, scale)
            //     },
            //     map: map,
            //     title: "Sua localização",
            //     draggable: true,
            //     animation: google.maps.Animation.DROP,
            //     // animation: google.maps.Animation.BOUNCE,
            //     // info: new google.maps.InfoWindow({
            //     //     content: 'Add some info here',
            //     //     pixelOffset: new google.maps.Size(0, -(size)),
            //     //     maxWidth: 400
            //     // })
            // });
            //
            // userLocationMarker.addListener('click', function() {
            //     new google.maps.InfoWindow({
            //         content: this.id,
            //         pixelOffset: new google.maps.Size(-(size/2)+(scale/2),-5),
            //         maxWidth: 400
            //     }).open(map, this);
            // });

            map.setCenter(pos);
            map.setZoom(6);

            // let userLocationRadius = new google.maps.Circle({
            //     strokeColor: '#FF0000',
            //     strokeOpacity: 0.5,
            //     strokeWeight: 2,
            //     fillColor: '#FF0000',
            //     fillOpacity: 0.15,
            //     map: map,
            //     center: userLocationMarker.position,
            //     radius: 200000, //in meters
            //     editable: true
            // });
            //
            // userLocationMarker.addListener('drag', function (event) {
            //     console.log("drag", event.latLng.lat(), event.latLng.lng());
            //
            //     userLocationRadius.setCenter({
            //         lat: event.latLng.lat(),
            //         lng: event.latLng.lng()
            //     });
            // });
            //
            // userLocationMarker.addListener('dragend', function (event) {
            //     console.log("dragend", event.latLng.lat(), event.latLng.lng());
            //
            //     map.panTo(event.latLng);
            // });

            google.maps.event.addListener(map, 'bounds_changed', function() {
                let bounds = map.getBounds();
                let southWest = bounds.getSouthWest();
                let northEast = bounds.getNorthEast();

                console.log("bounds = ", bounds);
                console.log("southWest = ", southWest);
                console.log("northEast = ", northEast);
            });

            // http://jsfiddle.net/glafarge/mbuLw/

        }, function(err) {
            console.log(err);
            alert("Erro: "+err.message);
        });
    } else {
        // Browser doesn't support Geolocation
        alert("Seu browser não suporta Geolocation.");
    }

    // getPoints();
    // getPolygon();
    // getGeometry();
    getOcorrencias();


    // google.maps.event.addListener(circle, 'radius_changed', function() {
    //     console.log(circle.getRadius());
    // });
    //
    // google.maps.event.addListener(outerPath, 'set_at', function() {
    //     console.log('Vertex moved on outer path.');
    // });
    //
    // google.maps.event.addListener(innerPath, 'insert_at', function() {
    //     console.log('Vertex removed from inner path.');
    // });
    //
    // google.maps.event.addListener(rectangle, 'bounds_changed', function() {
    //     console.log('Bounds changed.');
    // });
}