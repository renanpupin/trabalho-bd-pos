let map;
let heatmap;
let markers = [];

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
    let chart = new google.visualization.ColumnChart(document.getElementById('chart_container'));
    chart.draw(data, {title: 'Crimes em SP'});
}

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
        // alert('Fetch Error:'+ err.message);
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


    initDraw();

    // getOcorrencias({});  //get all
}

function initDraw(){
    let drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['circle', 'polygon']
        },
        // markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
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

        getOcorrencias({
            type: "Circle",
            lon: circle.getCenter().lng(),
            lat: circle.getCenter().lat(),
            radius: circle.getRadius()
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
}