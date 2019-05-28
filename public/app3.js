let map;
let heatmap;

let markers = [];

let bounds;

let moveCoords;

function toggleMarkers(){
    let isVisible = !!markers[0].getMap();

    markers.forEach(item => {
        item.setMap(isVisible ? null : map);
    });
}

function toggleHeatmap(){
    let isVisible = !!heatmap.getMap();

    heatmap.setMap(isVisible ? null : map);
}

function sortObject(obj) {
    let arr = [];
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort((a, b) => b.value - a.value);
    return arr; // returns array
}

function getStats(){
    let reasons = {};
    for(let marker of markers){
        if(!reasons[marker.crime]){
            reasons[marker.crime] = 1;
        }else{
            reasons[marker.crime]++;
        }
    }
    console.log("getStats", reasons);

    // let reasonsSorted = Object.keys(reasons).sort((a,b) => {return reasons[a] - reasons[b]});
    let reasonsSorted = sortObject(reasons);
    console.log("reasonsSorted =", reasonsSorted);

    let html = "<h5 style='margin: 0; line-height: 2;'>Crimes</h5>";
    reasonsSorted.forEach(item => {
        html += "<p style='font-size: 14px; line-height: 1.5; margin: 0;'>" +
            "<input type='checkbox' id='"+item.key+"' name='filter' onchange='handleChange(this);' checked/>" +
            "<b>"+item.key+"</b>: "+item.value+"" +
            "</p>";
    });
    document.getElementById("info").innerHTML = html;

    let data = [["Crime", "Qtd"]];

    reasonsSorted.forEach(item => {
        data.push([item.key, item.value])
    });

    drawChart(google.visualization.arrayToDataTable(data));
}

function drawChart(data) {
    // Define the chart to be drawn.
    // var data = google.visualization.arrayToDataTable([
    //     ['Year', 'Asia', 'Europe'],
    //     ['2012',  900,      390],
    //     ['2013',  1000,      400],
    //     ['2014',  1170,      440],
    //     ['2015',  1250,       480],
    //     ['2016',  1530,      540]
    // ]);

    let chart = new google.visualization.ColumnChart(document.getElementById('chart_container'));
    chart.draw(data, {title: 'Crimes em SP'});
}
// google.charts.setOnLoadCallback(drawChart);

function handleChange(checkbox){
    // console.log(checkbox);

    let id = checkbox.id;
    let checked = checkbox.checked;

    for(let marker of markers){
        if(marker.crime === id){
            marker.setMap(checked ? map : null);
        }
    }
}

async function getOcorrencias({type = null, lon = null, lat = null, radius = null, path = null}){
    try{

        let url = "";
        if(type === "Point"){
            url = "?type=Point&lon="+lon+"&lat="+lat;
        }else if(type === "Circle"){
            url = "?type=Circle&lon="+lon+"&lat="+lat+"&radius="+radius;
        }else if(type === "LineString"){
            url = "?type=LineString&path="+path;
        }else if(type === "Polygon"){
            url = "?type=Polygon&path="+path;
        }

        let response = await fetch('/api/ocorrencias'+url);
        console.log(response);

        if (response.status !== 200) {
            throw new Error("Erro: "+response.status);
        }

        let responseBody = await response.json();
        console.log(responseBody);

        if(!responseBody.success){
            throw new Error(responseBody.message);
        }else{

            let markersHeatMap = [];

            responseBody.ocorrencias.forEach((item) => {
                let markerLatlng = new google.maps.LatLng(item.localizacao.coordinates[1], item.localizacao.coordinates[0]);

                let marker = new google.maps.Marker({
                    position: markerLatlng,
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

                markers.push(marker);

                markersHeatMap.push(markerLatlng);

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

            // heatmap = new google.maps.visualization.HeatmapLayer({
            //     data: markersHeatMap,
            //     map: map,
            //     radius: 30
            // });

            getStats();
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
        center: {lng: -46.64, lat: -23.56},
        zoom: 12
    });


    google.maps.event.addListener(map, 'click', function(event) {
        console.log(event);
    });

    google.maps.event.addListener(map, 'mousemove', function (event) {
        // console.log(event.latLng.lat(), event.latLng.lng());
    });

    // getOcorrencias({});  //get all

    initDraw();
}

function initDraw(){
    let drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            // drawingModes: ['circle', 'polygon', 'polyline']
            drawingModes: ['circle', 'polygon']
        },
        markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
        circleOptions: {
            strokeColor: '#FF0000',
            strokeOpacity: 0.5,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.15,
            map: map,
            center: map.getCenter(),
            radius: 700, //in meters
            // editable: true
        }
    });
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'circlecomplete', function(circle) {
        console.log("circlecomplete =", circle);

        // if(circle.getRadius() > 5000){
        //     circle.setMap(null);
        //
        //     alert("Área de busca muito grande.");
        //
        //     return;
        // }

        // let searchCircle = new google.maps.Circle({
        //     strokeColor: '#7d3eff',
        //     strokeOpacity: 0.5,
        //     strokeWeight: 2,
        //     fillColor: '#7d3eff',
        //     fillOpacity: 0.15,
        //     map: map,
        //     center: circle.getCenter(),
        //     radius: circle.getRadius(), //in meters
        //     // editable: true
        // });

        getOcorrencias({
            type: "Circle",
            lon: circle.getCenter().lng(),
            lat: circle.getCenter().lat(),
            radius: circle.getRadius()
        });
    });

    google.maps.event.addListener(drawingManager, 'polylinecomplete', function(polyline) {
        console.log("polylinecomplete =", polyline);

        let geometry = polyline.getPath().getArray();
        geometry = geometry.map(item => [item.lng(), item.lat()]);

        let buffer = 0.2;    //coords

        let fakeLinePolygon = [];
        geometry.map(item => {
            fakeLinePolygon.push()
        });

        // let fakeLinePolygon = polyline.getPath().getArray();
        // fakeLinePolygon.reverse();
        // fakeLinePolygon = fakeLinePolygon.map(item => [item.lng(), item.lat()]);
        // geometry.concat(fakeLinePolygon);
        //
        // geometry.push(geometry[0]);
        // geometry = [geometry];
        // geometry = JSON.stringify(geometry);
        // geometry = JSON.stringify([[[-46.596054687499986,-23.524433631138947],[-46.59571136474608,-23.56755268026285],[-46.59571136474608,-23.56755268026285], [-46.596054687499986,-23.524433631138947]]]);

        console.log("geometry =", geometry);

        getOcorrencias({
            type: "LineString",
            path: geometry
        });
    });

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
        console.log("polygoncomplete =", polygon);

        let geometry = polygon.getPath().getArray();
        geometry = geometry.map(item => [item.lng(), item.lat()]);
        geometry.push(geometry[0]);
        geometry = [geometry];
        geometry = JSON.stringify(geometry);

        console.log("geometry =", geometry);

        getOcorrencias({
            type: "Polygon",
            path: geometry
        });
    });

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

    // var someLine = new google.maps.Polyline({
    //     path: [{
    //         lat: -42,
    //         lng: -19
    //     }, {
    //         lat: -48,
    //         lng: -25
    //     }],
    //     geodesic: true,
    //     strokeColor: '#000000',
    //     strokeOpacity: 1.0,
    //     strokeWeight: 5
    // });
    // someLine.setMap(map);
    // var lineWidth = 0.5; // (meters)
    // // var lineHeading = google.maps.geometry.spherical.computeHeading(someLine.getPath().getAt(0), someLine.getPath().getAt(1));
    // // var p0a = google.maps.geometry.spherical.computeOffset(someLine.getPath().getAt(0), lineWidth, lineHeading + 90);
    // // var p0b = google.maps.geometry.spherical.computeOffset(someLine.getPath().getAt(0), lineWidth, lineHeading - 90);
    // // var p1a = google.maps.geometry.spherical.computeOffset(someLine.getPath().getAt(1), lineWidth, lineHeading + 90);
    // // var p1b = google.maps.geometry.spherical.computeOffset(someLine.getPath().getAt(1), lineWidth, lineHeading - 90);
    // // var p2a = google.maps.geometry.spherical.computeOffset(someLine.getPath().getAt(2), lineWidth, lineHeading + 90);
    // // var p2b = google.maps.geometry.spherical.computeOffset(someLine.getPath().getAt(2), lineWidth, lineHeading - 90);
    //
    // let geometry = someLine.getPath().getArray();
    // geometry = geometry.map(item => [item.lng(), item.lat()]);
    // let paths = [];
    // geometry.map(item => {
    //     paths.push(
    //         [new google.maps.LatLng(item[0]+lineWidth), new google.maps.LatLng(item[1]+lineWidth)]
    //     );
    // });
    // paths.push(
    //     [new google.maps.LatLng(item[0]+lineWidth), new google.maps.LatLng(item[1]+lineWidth)]
    // );
    //
    // console.log("paths =", paths);
    //
    //
    // // how to convert above someLine into?:
    // var airway = new google.maps.Polygon({
    //     paths: paths[0],
    //     strokeColor: '#FF0000',
    //     strokeOpacity: 0.8,
    //     strokeWeight: 3,
    //     fillColor: '#FF0000',
    //     fillOpacity: 0.35,
    //     geodesic: true
    // });
    // airway.setMap(map);
    // var bounds = new google.maps.LatLngBounds();
    // for (var i = 0; i < airway.getPath().getLength(); i++) {
    //     bounds.extend(airway.getPath().getAt(i));
    // }
    // map.fitBounds(bounds);
}