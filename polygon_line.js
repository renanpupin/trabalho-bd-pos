let debug = true;
function initMap() {
    var infos = [] ;

    var polyLeft = [] ;
    var polyRight = [] ;
    var strokeOpacity = 0.5 ;
    var widthInMeters = 20 ;


    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.772, lng: -122.214},
        scrollwheel: false,
        zoom: 2
    });

    var path = [{"lat":45.878521,"lng":3.694520},{"lat":45.879269,"lng":3.693960},{"lat":45.880539,"lng":3.694340},{"lat":45.882172,"lng":3.694080},{"lat":45.883900,"lng":3.692780},{"lat":45.884430,"lng":3.692930},{"lat":45.885101,"lng":3.692600},{"lat":45.885490,"lng":3.692590},{"lat":45.887169,"lng":3.692070},{"lat":45.887421,"lng":3.691580},{"lat":45.888000,"lng":3.690050},{"lat":45.888889,"lng":3.689280},{"lat":45.889408,"lng":3.688710},{"lat":45.890331,"lng":3.688690},{"lat":45.890461,"lng":3.688480},{"lat":45.890511,"lng":3.687520},{"lat":45.891251,"lng":3.687020},{"lat":45.891769,"lng":3.686900},{"lat":45.894039,"lng":3.687510},{"lat":45.896568,"lng":3.688810},{"lat":45.897430,"lng":3.689040},{"lat":45.898140,"lng":3.688630},{"lat":45.898769,"lng":3.687980},{"lat":45.899719,"lng":3.687290},{"lat":45.900040,"lng":3.687170},{"lat":45.900101,"lng":3.686700},{"lat":45.900570,"lng":3.685970},{"lat":45.901321,"lng":3.685550},{"lat":45.902061,"lng":3.685050},{"lat":45.903030,"lng":3.683950},{"lat":45.903412,"lng":3.683880},{"lat":45.903938,"lng":3.683920},{"lat":45.905102,"lng":3.683280},{"lat":45.906361,"lng":3.682710},{"lat":45.906681,"lng":3.682380},{"lat":45.907082,"lng":3.682250},{"lat":45.907970,"lng":3.682800},{"lat":45.908772,"lng":3.682820},{"lat":45.909149,"lng":3.683270},{"lat":45.909370,"lng":3.684730},{"lat":45.909679,"lng":3.685440},{"lat":45.910191,"lng":3.685902},{"lat":45.910381,"lng":3.686270},{"lat":45.911282,"lng":3.686700},{"lat":45.912209,"lng":3.687900},{"lat":45.912281,"lng":3.688140},{"lat":45.912128,"lng":3.688280},{"lat":45.911942,"lng":3.689290},{"lat":45.911709,"lng":3.690250},{"lat":45.911339,"lng":3.691200},{"lat":45.911491,"lng":3.693050},{"lat":45.912109,"lng":3.695400},{"lat":45.913391,"lng":3.698570},{"lat":45.913940,"lng":3.700200},{"lat":45.914688,"lng":3.701790},{"lat":45.915218,"lng":3.702120},{"lat":45.916248,"lng":3.703170},{"lat":45.916889,"lng":3.703440},{"lat":45.917122,"lng":3.703860},{"lat":45.917210,"lng":3.704280},{"lat":45.917770,"lng":3.704750},{"lat":45.918739,"lng":3.704860},{"lat":45.919571,"lng":3.704730},{"lat":45.919861,"lng":3.704920},{"lat":45.920139,"lng":3.706380},{"lat":45.920460,"lng":3.706880},{"lat":45.920818,"lng":3.708750},{"lat":45.921249,"lng":3.709650},{"lat":45.921680,"lng":3.711240},{"lat":45.921822,"lng":3.712880},{"lat":45.921860,"lng":3.715220},{"lat":45.921951,"lng":3.715510},{"lat":45.922371,"lng":3.715930},{"lat":45.922691,"lng":3.718220},{"lat":45.922958,"lng":3.719330},{"lat":45.923012,"lng":3.720330},{"lat":45.922821,"lng":3.721420},{"lat":45.923988,"lng":3.718530},{"lat":45.924110,"lng":3.717490},{"lat":45.924030,"lng":3.716700},{"lat":45.924389,"lng":3.715310},{"lat":45.924671,"lng":3.714956},{"lat":45.925072,"lng":3.714200},{"lat":45.925621,"lng":3.711630},{"lat":45.926830,"lng":3.709340},{"lat":45.927231,"lng":3.709070},{"lat":45.928013,"lng":3.708873},{"lat":45.929050,"lng":3.708430},{"lat":45.929790,"lng":3.707750},{"lat":45.930168,"lng":3.707290},{"lat":45.930759,"lng":3.707410},{"lat":45.931370,"lng":3.707620},{"lat":45.931900,"lng":3.707470},{"lat":45.932739,"lng":3.706920},{"lat":45.933529,"lng":3.705940},{"lat":45.934410,"lng":3.703300},{"lat":45.934662,"lng":3.701430},{"lat":45.934841,"lng":3.699650},{"lat":45.934700,"lng":3.698620},{"lat":45.934841,"lng":3.697930},{"lat":45.935371,"lng":3.696900},{"lat":45.935741,"lng":3.696590},{"lat":45.936520,"lng":3.695530},{"lat":45.936661,"lng":3.695120},{"lat":45.936729,"lng":3.694160},{"lat":45.936600,"lng":3.693150},{"lat":45.936710,"lng":3.692080},{"lat":45.936699,"lng":3.691320},{"lat":45.936989,"lng":3.690560},{"lat":45.938160,"lng":3.689220},{"lat":45.939362,"lng":3.688750},{"lat":45.940102,"lng":3.688380},{"lat":45.940521,"lng":3.687900},{"lat":45.940731,"lng":3.687590},{"lat":45.940990,"lng":3.686870},{"lat":45.941479,"lng":3.686270},{"lat":45.941959,"lng":3.685800},{"lat":45.942169,"lng":3.685150},{"lat":45.942520,"lng":3.684640},{"lat":45.942829,"lng":3.683400},{"lat":45.943020,"lng":3.682970},{"lat":45.943199,"lng":3.682250},{"lat":45.943600,"lng":3.681720},{"lat":45.944160,"lng":3.681310},{"lat":45.944771,"lng":3.681170},{"lat":45.945690,"lng":3.681750},{"lat":45.946121,"lng":3.681730},{"lat":45.946960,"lng":3.681180},{"lat":45.947201,"lng":3.681140},{"lat":45.948021,"lng":3.681520},{"lat":45.949181,"lng":3.682410},{"lat":45.949741,"lng":3.683030},{"lat":45.949959,"lng":3.683370},{"lat":45.950809,"lng":3.684230},{"lat":45.951229,"lng":3.684470},{"lat":45.952309,"lng":3.685560},{"lat":45.953129,"lng":3.685960},{"lat":45.953758,"lng":3.686160},{"lat":45.954319,"lng":3.685820},{"lat":45.955429,"lng":3.685740},{"lat":45.956108,"lng":3.685940},{"lat":45.956200,"lng":3.686010},{"lat":45.956619,"lng":3.686740},{"lat":45.956860,"lng":3.687270},{"lat":45.956921,"lng":3.687740},{"lat":45.957260,"lng":3.688530},{"lat":45.957809,"lng":3.689250},{"lat":45.958401,"lng":3.689540},{"lat":45.958851,"lng":3.689660},{"lat":45.959599,"lng":3.690140},{"lat":45.959789,"lng":3.690520},{"lat":45.960258,"lng":3.690750},{"lat":45.960571,"lng":3.691020},{"lat":45.961521,"lng":3.692110},{"lat":45.961761,"lng":3.692530}];

    var bounds = new google.maps.LatLngBounds() ;
    map.fitBounds(bounds)  ;

    for ( var i in path )
        bounds.extend(path[i]) ;

    var poly = new google.maps.Polyline({
        path: path,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 5
    })
    poly.setMap(map) ;

    for ( var k in path )
    {
        var currentLatLng = new google.maps.LatLng(path[k]) ;
        var lastLatLng = null ;
        var nextLatLng = null ;
        var headingRight, headingLeft ;
        var cas = 0 ;

        if ( typeof path[parseInt(k)-1] != 'undefined' ) lastLatLng = new google.maps.LatLng(path[parseInt(k)-1]) ;
        if ( typeof path[parseInt(k)+1] != 'undefined' ) nextLatLng = new google.maps.LatLng(path[parseInt(k)+1]) ;

        var etat = 'lastLatLng='+lastLatLng + '<br />' +
            'currentLatLng='+currentLatLng+'<br />' +
            'nextLaLng='+nextLatLng+'<br />' ;

        if ( lastLatLng === null && nextLatLng !== null )
        {
            for ( var i = 0 ; i <= 180 ; i += 10 )
            {
                var heading = parseFloat(google.maps.geometry.spherical.computeHeading(currentLatLng,nextLatLng)) + 90 + i ;
                addPoint(heading,currentLatLng,false) ;
            }
        }

        if ( lastLatLng !== null )
        {
            headingRight = parseFloat(google.maps.geometry.spherical.computeHeading(currentLatLng,lastLatLng)) - 90 ;
            addPoint(headingRight,currentLatLng) ;
        }

        if ( lastLatLng !== null && nextLatLng !== null )
        {
            cas = 'intermediaires' ;
            var headingBefore = google.maps.geometry.spherical.computeHeading(currentLatLng,lastLatLng) ;
            var headingAfter = google.maps.geometry.spherical.computeHeading(currentLatLng,nextLatLng) ;
            headingBefore += 360 ; headingBefore = headingBefore % 360 ;
            headingAfter += 360 ; headingAfter = headingAfter % 360 ;

            headingRight = parseFloat( ( headingBefore + headingAfter ) / 2 ) ;
            if ( headingAfter > headingBefore ) headingRight += 180 ;
            headingRight += 360 ;

            headingRight = headingRight % 360 ;

            addPoint(headingRight,currentLatLng) ;
        }

        if ( nextLatLng !== null )
        {
            headingRight = parseFloat(google.maps.geometry.spherical.computeHeading(currentLatLng,nextLatLng)) + 90 ;
            addPoint(headingRight,currentLatLng) ;
        }

        if ( lastLatLng !== null && nextLatLng === null )
        {
            for ( var i = 0 ; i <= 180 ; i += 10 )
            {
                var heading = parseFloat(google.maps.geometry.spherical.computeHeading(currentLatLng,lastLatLng)) - 90 - i ;
                addPoint(heading,currentLatLng,false) ;
            }
        }


        if ( debug )
        {
            var content = etat+'<hr />'+
                'k='+k+'<br />'+
                'cas='+cas+'<br />'+
                'currentLatLng='+currentLatLng+'<br />'+
                'path[k]='+path[k]['lat']+','+path[k]['lng']+' <br /> '+
                'headingBefore='+headingBefore+'<br />'+
                'headingAfter='+headingAfter+'<br />'+
                'headingRight='+headingRight+'<br />'+
                'headingLeft='+headingLeft+'<br />' ;
            /*
            'pointLeft='+pointLeft.lat()+','+pointLeft.lng()+'<br />'+
            'pointLeft='+pointRight.lat()+','+pointRight.lng() ;
            */

            var marker = new google.maps.Marker({
                position: path[k],
                map: map,
                title: 'Uluru (Ayers Rock)'
            });
            var infowindow = new google.maps.InfoWindow() ;

            google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
                return function() {
                    closeInfos();
                    infowindow.setContent(content);
                    infowindow.open(map,marker);

                    infos[0]=infowindow;

                };
            })(marker,content,infowindow));
        }

    }

    /*
    console.log(path) ;
    console.log(polyTop) ;
    console.log(polyBottom) ;
    */
    // At this point, polyTop and polyBottom should contain a pass parrallel as your initial path, but from widthInMeter/2 on left of the orig. path for polyFrom and  widthInMeter/2 on right for polyBottom.

    // It's a start, but if we want to draw a complex polygon, we need only one path of coordinates.
    // What we need to do know is "mix" the 2 pathes into one, reversing bottomPath so the path created will go from first element of polyTop, to last element of polyTop, then last element of polyBottom and finish on last element of polyBottom. It should result in a sort a huge polygon making a "tour" around your original path.

    new google.maps.Polyline({
        path: polyLeft,
        geodesic: true,
        strokeColor: '#00FF00',
        strokeOpacity: strokeOpacity,
        strokeWeight: 2
    }).setMap(map) ;

    new google.maps.Polyline({
        path: polyRight,
        geodesic: true,
        strokeColor: '#0000FF',
        strokeOpacity: strokeOpacity,
        strokeWeight: 2
    }).setMap(map) ;

    polyRight.reverse() ;
    var polys = polyLeft.concat(polyRight) ;

    var complexPoly = new google.maps.Polygon({
        paths: polys,
        strokeOpacity: 0,
        strokeWeight: 0,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
    });
    complexPoly.setMap(map);

    function closeInfos(){

        if(infos.length > 0){

            /* detach the info-window from the marker ... undocumented in the API docs */
            infos[0].set("marker", null);

            /* and close it */
            infos[0].close();

            /* blank the array */
            infos.length = 0;
        }
    }

    function addPoint(hRight,currentLatLng,both=true)
    {
        hLeft = hRight + 180 ;
        if ( hLeft > 360 ) hLeft -= 360 ;
        if ( hRight > 360 ) hRight -= 360 ;

        var pointRight = google.maps.geometry.spherical.computeOffset(currentLatLng,widthInMeters/2,hRight) ;
        var pointLeft  = google.maps.geometry.spherical.computeOffset(currentLatLng,widthInMeters/2,hLeft) ;

        if ( ! isNaN(pointLeft.lat()) && ! isNaN(pointRight.lat()) )
        {
            if ( both ) polyLeft.push({'lat':pointLeft.lat(),'lng':pointLeft.lng()}) ;
            polyRight.push({'lat':pointRight.lat(),'lng':pointRight.lng()}) ;
        }
    }
}