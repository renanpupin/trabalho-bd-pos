let map;

async function getGeometries(){
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
                if(item.location.type === "Point"){
                    let myLatlng = new google.maps.LatLng(item.location.coordinates[1], item.location.coordinates[0]);

                    let marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        title: item.name,
                        coordinates: item.location.coordinates
                    });

                    marker.addListener('click', function() {
                        new google.maps.InfoWindow({
                            content: "<div>"+
                                "<p>Coordenadas: ["+this.coordinates+"]</p>"+
                                "</div>",
                            maxWidth: 400
                        }).open(map, this);
                    });
                }else if(item.location.type === "LineString") {
                    let coords = item.location.coordinates.map(coord => {
                        return {lat: coord[1], lng: coord[0]}
                    });
                    console.log(coords);

                    let polyline = new google.maps.Polyline({
                        map: map,
                        path: coords,
                        // strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 3,
                        // fillColor: '#FF0000',
                        fillOpacity: 0.35,
                        coordinates: item.location.coordinates
                    });

                    google.maps.event.addListener(polyline, 'click', function(event) {
                        new google.maps.InfoWindow({
                            position: event.latLng,
                            content: "<div>"+
                                "<p>Coordenadas: ["+this.coordinates+"]</p>"+
                                "</div>",
                            maxWidth: 400
                        }).open(map, this);
                    });

                }else if(item.location.type === "Polygon") {
                    let coords = item.location.coordinates[0].map(coord => {
                        return {lat: coord[1], lng: coord[0]}
                    });
                    console.log(coords);

                    let polygon = new google.maps.Polygon({
                        map: map,
                        paths: coords,
                        strokeColor: '#0000FF',
                        strokeOpacity: 0.8,
                        strokeWeight: 3,
                        fillColor: '#0000FF',
                        fillOpacity: 0.35,
                        coordinates: item.location.coordinates[0]
                    });

                    google.maps.event.addListener(polygon, 'click', function(event) {
                        new google.maps.InfoWindow({
                            // position: getPolygonCenter(polygon),
                            position: event.latLng,
                            content: "<div>"+
                                "<p>Coordenadas: ["+this.coordinates+"]</p>"+
                                "</div>",
                            maxWidth: 400
                        }).open(map, this);
                    });
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

async function saveGeometry(type, event){
    console.log("saveGeometry =", type, event);

    let geometry;

    if(type === "Point"){
        geometry = [event.overlay.position.lng(), event.overlay.position.lat()];
        console.log("savePoint =", geometry);
    }else if(type === "LineString"){
        geometry = event.overlay.getPath().getArray();
        geometry = geometry.map(item => [item.lng(), item.lat()]);
        console.log("saveLine =", geometry);
    }else if(type === "Polygon"){
        geometry = event.overlay.getPath().getArray();
        geometry = geometry.map(item => [item.lng(), item.lat()]);
        geometry.push(geometry[0]);
        geometry = [geometry];
        console.log("savePolygon =", geometry);
    }

    try{
        let response = await fetch('/api/geometry', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Headers': 'Accept, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Access-Control-Allow-Methods',
            },
            body: JSON.stringify({
                type,
                coordinates: geometry
            })
        });

        console.log(response);
        if (response.status !== 200) {
            throw new Error("Erro: "+response.status);
        }

        let responseBody = await response.json();
        console.log(responseBody);

        if(!responseBody.success){
            throw new Error(responseBody.message);
        }else{
            console.log("sucesso");
        }
    } catch (err) {
        console.log(err);
        alert('Fetch Error:'+ err.message);
    }
}

function initDraw(){
    let drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker', 'polygon', 'polyline']
        },
    });
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
        console.log("overlaycomplete =", event);

        if (event.type === 'marker') {
            saveGeometry("Point", event);
        }else if (event.type === 'polyline') {
            saveGeometry("LineString", event);
        }else if (event.type === 'polygon') {
            saveGeometry("Polygon", event);
        }else{
            alert("Type not supported.");
        }
    });
}

function initMap() {
    console.log("initMap");

    //init map
    map = new google.maps.Map(document.getElementById('map'), {
        gestureHandling: 'cooperative',
        center: {lat: -21, lng: -44},
        zoom: 2
    });

    //init google maps draw tools
    let drawingManager = new google.maps.drawing.DrawingManager({
        map: map,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker', 'polygon', 'polyline']
        },
        circleOptions: {
            map: map,
            center: map.getCenter(),
            radius: 700, //in meters
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
        },
        polylineOptions: {
            // strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            // fillColor: '#FF0000',
            fillOpacity: 0.35,
        },
        polygonOptions: {
            strokeColor: '#0000FF',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: '#0000FF',
            fillOpacity: 0.35,
        }
    });

    //add listeners for draw tools
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
        console.log("overlaycomplete =", event);

        if (event.type === 'marker') {
            saveGeometry("Point", event);
        }else if (event.type === 'polyline') {
            saveGeometry("LineString", event);
        }else if (event.type === 'polygon') {
            saveGeometry("Polygon", event);
        }else{
            alert("Type not supported.");
        }
    });

    //get existing geometries from database
    getGeometries();
}