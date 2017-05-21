//DECLARE NAMESPACES
var map = map || {};

//DECLARE GLOBAL VARIABLES
var gm;
var marker;
var current_infowindow;
var audio;

//ASSIGN NAMESPACES
map = {
    //INITIALISERS
    initMap: function(){
        gm = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 50.8277352, lng: 3.2634012},
            zoom: 15
        });

        helpers.get_geolocation(map.parseMap);
    },

    init: function(){
        //Assign the eventlisteners
        $("#href_trackr").on("click", function(){
            window.location.href = "./index.html";
        });
        $(".toaster").on("click", function(event){
            event.preventDefault();
            map.toggle_menu();
        });
        $("#themetoggler").on("click", function(event){
            event.preventDefault();
            map.toggle_theme();
            helpers.collapse_menu();
        });

        //Execute the needed functions
        helpers.init_theme();

        if(getParameterByName("easter") == "egg"){
            //Preload the easter egg
            var newaudio1 = new Audio('./assets/ding.mp3');
            var newaudio2 = new Audio('./assets/elevator.mp3');
        }

        //Acknowledge the init
        console.log("MAPS has been initialised.");
    },

    //TOGGLERS
    toggle_menu: function(){
        if($("#toastmenu").hasClass('expanded')){
            if($("#placeholder").hasClass('expanded')){
                //Toastmenu is active
                helpers.collapse_menu();
            } else {
                //Error - Clear all classes
                $("#placeholder").removeClass('expanded');
                $("#toastmenu").removeClass('expanded');
            }
        } else {
            if($("#placeholder").hasClass('expanded')){
                //Error - Clear all classes
                $("#placeholder").removeClass('expanded');
                $("#toastmenu").removeClass('expanded');
            } else {
                //Toastmenu is inactive
                helpers.expand_menu();
            }
        }
    },

    //GUI BUILDER
    draw_server_markers: function(that, timeout){
        window.setTimeout(function(){
            //Gather the markerdata
            var position = {
                lat: parseFloat(that.lat),
                lng: parseFloat(that.lng)
            };
            var title = that.host;
            var img = "./assets/dbicon.png";
            //var img = "http://maps.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png";

            var infoContent = '<div id="content">' +
                '<h3>' + title +'</h3>' +
                '<dl><dd>IP-address</dd><dt>' + that.ip + '</dt><dd>Country of Origin</dd><dt>' +
                that.country + '</dt></dl>' + '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: infoContent
            });

            //Draw the markers
            var m = new google.maps.Marker({
                map: gm,
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                icon: img
            });

            m.addListener('mouseover', function(){
                infowindow.open(gm, m);

                //Trigger closing the current infowindow
                if(infowindow != current_infowindow){
                    if(current_infowindow != undefined) current_infowindow.close();
                    current_infowindow = infowindow;
                }
            });
        }, timeout);
    },

    smoothZoom: function(mapa, goal, current) {
        if (current > Math.ceil(goal)) {
            var z = google.maps.event.addListener(mapa, 'zoom_changed', function(event) {
                google.maps.event.removeListener(z);
                mapa.setCenter(marker.getPosition());
                map.smoothZoom(mapa, goal, current - 1, false);
            });
            setTimeout(function(){mapa.setZoom(current)}, 200); // 80ms is what I found to work well on my system -- it might not work well on all systems
        } else if (current < Math.ceil(goal)) {
            z = google.maps.event.addListener(mapa, 'zoom_changed', function(event){
                google.maps.event.removeListener(z);
                map.smoothZoom(mapa, goal, current + 1, false);
            });
            setTimeout(function(){mapa.setZoom(current)}, 200); // 80ms is what I found to work well on my system -- it might not work well on all systems
        } else {
            //Set easteregg
            if(getParameterByName("easter") == "egg"){
                audio.pause();
                audio.volume = 0.7;
                audio = new Audio('./assets/ding.mp3');
                audio.play();
            }

            setTimeout(function(){mapa.setZoom(goal)}, 300);
        }
    },

//LOGIC
    parse_servers: function(data){
        if(getParameterByName("easter") == "egg"){
            audio.pause();
        }

        data = JSON.parse(data).array;
        if(data.length > 0){
            for(var i= 0; i<data.length; i++){
                var that = data[i];
                map.draw_server_markers(that, i*200);
            }
        }
    },

    parse_servers_from_current_country: function(data){
        //Zoom out to see the neighbouring servers
        var zoom = gm.getZoom();
        map.smoothZoom(gm, 8, zoom);

        window.setTimeout(function(){
            //Display the servers
            data = JSON.parse(data).array;
            if(data.length > 0){
                for(var i= 0; i<data.length; i++){
                    var that = data[i];
                    map.draw_server_markers(that, i*200);
                }
            }
            var country = "!" + localStorage.getItem("current_country");
            localStorage.removeItem('current_country');
            helpers.get_searched_site(country, function(data){map.parse_servers(data);});
        }, (zoom - 8) * 250);
    },

    parseMap: function(location){
        if(location.coords.latitude != null && location.coords.longitude != null) {
            var geo = {
                acc: location.coords.accuracy,
                lat: location.coords.latitude,
                long: location.coords.longitude
            };

            gm.setCenter({lat: geo.lat, lng: geo.long});
            var img = "http://maps.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png";

            //Draw the markers with timeout
            marker = new google.maps.Marker({
                map: gm,
                position: {lat: geo.lat, lng: geo.long},
                title: "Your Location",
                animation: google.maps.Animation.DROP,
                icon: img
            });

            map.get_location_by_coordinates(geo.lat, geo.long);
        }
    },

    //AJAX & LOGICAL GETTERS
    get_location_by_coordinates: function(lat, long){
        //The API key
        var key = "AIzaSyBRnyhTk1y81e9DZAms_l-_VRVOf24Wpz4";
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&language=en&key=" + key;

        //Query the reverse geocoding service
        $.ajax({
            url: url,
            method: "GET",
            success: function(data){
                var country = data.results[0].address_components[5].long_name;
                if(localStorage) localStorage.setItem("current_country", country);
                helpers.get_searched_site(country, function(data){map.parse_servers_from_current_country(data);});
            },
            error: function(){
                console.log("Something went wrong, sorry");
            }
        })
    }
};