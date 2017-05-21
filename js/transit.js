//DECLARE NAMESPACES
var gui = gui || {};
var logic = logic || {};
var xhr = xhr || {};

//Assign Global Variables
var ajax_allowed = true;
var false_host = false;
var current_owl; var nav_buffer;

//Add native function
/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

//ASSIGN NAMESPACES
gui = {
    log_error: function(error){
        console.log(error);
    },

//INITIALIZES
    init: function(){
        //Set the eventlisteners
        $(".toaster").on("click", function(event){
            event.preventDefault();
            gui.toggle_menu();
        });
        $("#themetoggler").on("click", function(event){
            event.preventDefault();
            helpers.toggle_theme();
            helpers.collapse_menu();
        });
        $("#submit").on("click", function(event){
            var hostname = $("#txt_searchsite").val();
            logic.hostname_submission(event, hostname);
        });
        $("#btn_lastsite").on("click", function(event){
            var hostname = (localStorage.getItem('next_random_site') != undefined)
                ? localStorage.getItem('next_random_site') : "estebandenis.ddns.net";
            logic.hostname_submission(event, hostname);
        });
        $("#btn_randomsite").on("click", function(event){
            gui.toggle_menu();  //Close the menu again.
            var hostname = (localStorage.getItem('next_random_site') != undefined)
            ? localStorage.getItem('next_random_site') : "estebandenis.ddns.net";
            logic.hostname_submission(event, hostname);
        });
        $("#refresh").on("click", function(){
            helpers.get_geolocation(logic.parse_client_geolocation);
        });
        $("#refresh_mobile").on("click", function(){
            helpers.get_geolocation(logic.parse_client_geolocation);
        });
        $("#track_it").on("click", function(event){
            event.preventDefault();
            gui.show_trackr_result();
        });
        $("#track_it_mobile").on("click", function(event){
            event.preventDefault();
            gui.show_trackr_result();
        });
        $("#href_map").on("click", function(){
            window.location.href = "./map.html";
        });
        $("#download_apk").on("click", function(event){
            event.preventDefault();
            window.location.href = './app/';
        });

        //Execute the needed functions
        logic.get_lastest_sites();
        gui.init_theme();
        gui.parse_menu_items();
        gui.prepare_owl_framework();

        //Get previous trackstate if available
        var activeOWL = localStorage.getItem('activeOWL');
        var OWLS = $("#transportation .item"); var active = -1;
        OWLS.each(function(i, e){
            if(e.getAttribute("data-tag") == activeOWL) active = i;
        });
        if(active > -1){
            var owl = $("#transportation");
            while (active > 0){
                owl.trigger('owl.next');
                active--;
            }
        }

        //Acknowledge that the init has executed
        console.log("The GUI init has been executed");
    },

    init_theme: function(){
        helpers.init_theme();
    },

    prepare_owl_framework: function(){
        //Inject the items
        gui.prepare_owl_items();

        //Initialize the carousel.
        var owl = $("#transportation");
        if(parseInt(window.innerWidth) < 768){
            owl.owlCarousel({
                navigation : false, // Toggle next and prev buttons
                slideSpeed : 300,
                paginationSpeed : 400,
                responsive: true,
                singleItem: true,

                addClassActive : true,   //Add active to selected element

                afterMove: function(){
                    var d = $(".owl-carousel .active .item").data("description");

                    $("#speed_progress").attr("aria-valuenow", d.duration_p);
                    $("#speed_progress").attr("style", "width:" + d.duration_p + "% !important; color:#363636;");
                    $("#speed_progress").attr("class", "progress-bar " + d.duration_annotation + " progress-bar-striped active");
                    $("#speed_progress").text(d.duration);

                    $("#cost_progress").attr("aria-valuenow", d.cost_p);
                    $("#cost_progress").attr("style", "width:" + d.cost_p + "%; color:#363636;");
                    $("#cost_progress").attr("class", "progress-bar " + d.cost_annotation + " progress-bar-striped active");
                    $("#cost_progress").text(d.cost);

                    $("#avail").text(d.availability);
                    $("#avail").attr("class", d.availability_annotation);

                    $("#data").text(d.datarate);
                    $("#data").attr("class", d.datarate_annotation);
                }
            });
        } else if(parseInt(window.innerWidth < 1200)) {
            owl.owlCarousel({
                navigation : false, // Toggle next and prev buttons
                slideSpeed : 300,
                paginationSpeed : 400,
                responsive: true,
                items: 3,
                transitionStyle : "fade",

                addClassActive : true,   //Add active to selected element

                afterMove: function(){
                    var d = $(".owl-carousel .active .item").eq(1).data("description");

                    $("#speed_progress").attr("aria-valuenow", d.duration_p);
                    $("#speed_progress").attr("style", "width:" + d.duration_p + "% !important; color:#363636;");
                    $("#speed_progress").attr("class", "progress-bar " + d.duration_annotation + " progress-bar-striped active");
                    $("#speed_progress").text(d.duration);

                    $("#cost_progress").attr("aria-valuenow", d.cost_p);
                    $("#cost_progress").attr("style", "width:" + d.cost_p + "%; color:#363636;");
                    $("#cost_progress").attr("class", "progress-bar " + d.cost_annotation + " progress-bar-striped active");
                    $("#cost_progress").text(d.cost);

                    $("#avail").text(d.availability);
                    $("#avail").attr("class", d.availability_annotation);

                    $("#data").text(d.datarate);
                    $("#data").attr("class", d.datarate_annotation);

                    $(".owl-carousel .item").css("transform", "scale(0.75)");
                    $(".owl-carousel .active .item").eq(1).css("transform", "scale(1.1)");
                }
            });
        } else {
            $('.item').on('click', function(event){
                $(".item").css("transform", "scale(0.75)");
                $(this).css("transform", "scale(1.1)");

                var d = $(this).data("description");
                current_owl = $(this);

                $("#speed_progress").attr("aria-valuenow", d.duration_p);
                $("#speed_progress").attr("style", "width:" + d.duration_p + "% !important; color:#363636;");
                $("#speed_progress").attr("class", "progress-bar " + d.duration_annotation + " progress-bar-striped active");
                $("#speed_progress").text(d.duration);

                $("#cost_progress").attr("aria-valuenow", d.cost_p);
                $("#cost_progress").attr("style", "width:" + d.cost_p + "%; color:#363636;");
                $("#cost_progress").attr("class", "progress-bar " + d.cost_annotation + " progress-bar-striped active");
                $("#cost_progress").text(d.cost);

                $("#avail").text(d.availability);
                $("#avail").attr("class", d.availability_annotation);

                $("#data").text(d.datarate);
                $("#data").attr("class", d.datarate_annotation);
            });

            owl.owlCarousel({
                navigation : false, // Toggle next and prev buttons
                slideSpeed : 300,
                paginationSpeed : 400,
                responsive: true,
                items: 4,
                transitionStyle : "fade"
            });

            $('.item[data-carousel="start"]').trigger("click");
        }

        //Init the sliders
        owl.trigger("owl.next");
        owl.trigger("owl.prev");

        // Custom Navigation Events
        $(".next").click(function(){
            owl.trigger('owl.next');
        });
        $(".prev").click(function(){
            owl.trigger('owl.prev');
        });
    },

    prepare_owl_items: function(){
        var owl_items = $("#transportation .item");

        //Scan for mediaquery
        if(parseFloat(window.innerWidth) >= 767){
            $(".item.no-desktop").remove();
        } else if (parseFloat(window.innerWidth) < 767) {
            $(".item.no-mobile").remove();
        }

        //Get the data
        owl_items.each(function(i, e){
            var tag = e.getAttribute('data-tag');
            var dp = logic.get_namespace(tag).get_description();
            var d = JSON.parse(dp);

            //Enter the body
            var img = new Image(); img.src = d.image;    //preload
            e.innerHTML = '<img src="' + d.image + '" alt="' + tag + '"/>'
                + '<p class="title">' + d.title + '</p>';

            //Assign the data- attribs
            e.setAttribute("data-description", dp);
        });
    },

    parse_menu_items: function(){
        var bottomarts = document.getElementById('toastmenu').getElementsByClassName('bottom');
        $.each(bottomarts, function(i, value){
            var height = value.offsetHeight;
            height = (parseInt(height) > 0) ? parseInt(height) : 50;
            value.style.bottom = parseInt(i * height) + "px";
        })
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

//ELEMENT CREATORS
    build_result_node: function(title, value, progress_value, progress_annotation){
        var element = document.createElement('div');
        var title_holder = $('<div>').appendTo(element);
        var progress_holder = $('<div>').appendTo(element);

        //Title Div
        var p = $('<p>').appendTo(title_holder);
        var span = $('<span>').appendTo(title_holder);

        p.text(htmlEntities(title));
        span.text(" - " + htmlEntities(value));

        //Progress div
        progress_holder.addClass("progress");
        var bar = $('<div>').appendTo(progress_holder);
        bar.attr('id', 'progress_' + htmlEntities(title));
        bar.addClass('progress-bar');
        bar.addClass('progress-bar-striped');
        bar.addClass(htmlEntities(progress_annotation));
        bar.addClass('active');
        bar.attr('role', 'progressbar');

        bar.attr('aria-valuenow', '0');
        bar.attr('aria-valuemin', "0");
        bar.attr('aria-valuemax', "100");
        bar.css('width', '0');
        bar.css('color', "#363636");
        bar.addClass('animo');

        bar.text(htmlEntities(value));

        //Set the animation on the element
        element.style.opacity = '0 !important';
        setTimeout(function(){
            bar.attr('aria-valuenow', htmlEntities(progress_value));
            bar.css('width', htmlEntities(progress_value) + "px");
        }, 1200);

        return element;
    },

//CONTENT MANAGEMENT
    show_trackr: function(hostname){
        //Write the hostname in the next page.
        $("#target > p").text(hostname);
        $('title_results').remove();

        //Transform to the next page.
        if($("main").hasClass("home")) $("main").removeClass("home");
        $("#track_it").fadeTo(100, 1);
        $("#tracker").css("height", "auto");
        $("#placeholder > footer > i").fadeOut(100);
        $("#lander").fadeTo(100, 0, function(){
            $("#tracker").css("pointer-events", "auto");
            $("#carousel").css("pointer-events", "auto");
            $("footer").css("height", "50px");
            $("#tracker").fadeTo(100, 1);
            $("#carousel").css("z-index", "1000");
            $("#lander").css("display", "none");
        });
    },

    show_home: function(){
        //Undo the changed actions
        $("#locations").show();
        $("#transprops").show();
        $(".owl-controls").show();
        $(".customNavigation").show();
        if(parseFloat(window.innerWidth) > 1200) $("#step_3").show();
        if(parseFloat(window.innerWidth) > 1200) $("#tracker h3").show();
        if(document.getElementById('current_transport') != undefined){
            $("#current_transport").remove();
            $("#carousel").append(nav_buffer);
        }
        $("#results").remove();
        $("#title_results").remove();

        $("#carousel").fadeTo(100, 1);
        if(parseFloat(window.innerWidth) < 768) $("#results_holder").css("top", "150px");
        $("#results_holder").css("height", "0");
        $("#tracker").css("height", "0");
        if(!$("main").hasClass("home")) $("main").addClass("home");


        $("#carousel").css("padding", "20px 20px 0");
        $("#carousel").removeClass("result");
        $("#transportation .item img").css("max-height", "125px");
        if(parseInt(window.innerWidth) > 767 && parseInt(window.innerHeight) > parseInt(window.innerWidth)){
            $("#carousel").css("height", "375px");
        } else {
            $("#carousel").css("height", "190px");
        }
        $(".title").css("margin-top", "0");
        if(parseInt(window.innerWidth) < 500) $("footer").css("height", "25px");

        //Set the titles of the owl elements
        var owl_items = $("#transportation .item");
        owl_items.each(function(i, e){
            var tag = e.getAttribute('data-tag');
            var dp = logic.get_namespace(tag).get_description();
            var d = JSON.parse(dp);
            e.getElementsByClassName('title')[0].innerHTML = d.title;
        });

        $("#track_it").fadeTo(100, 0);
        $("#track_it").text("Track IT");
        $("#track_it").off();
        $("#track_it").on("click", function(event){
            event.preventDefault();
            gui.show_trackr_result();
        });

        //Transform to the previous page
        $("#placeholder > footer > i").fadeIn(100);
        $("#lander").fadeTo(100, 1, function(){
            $("#tracker").css("pointer-events", "none");
            $("#carousel").css("pointer-events", "none");
            $("#tracker").fadeTo(100, 0);

            var owl = $("#transportation");
            owl.trigger('owl.goTo(0)');
        });
        $("#txt_searchsite").val("");
    },

    show_client_position: function(street, city){
        $("#client_location").parent().css("max-height", "40px");
        var loc_deposits = $("#client_location").children();
        loc_deposits[0].textContent = street;
        loc_deposits[1].textContent = city;
    },

    show_trackr_result: function(){
        var hostname = $("#target > p").text();
        $("#carousel").css("z-index", "0");

        //Hide inputboxes
        $("#locations").fadeOut(1000);
        $("#transprops").fadeOut(1000);
        $("#tracker h3").fadeOut(1000);
        window.setTimeout(function(){
            $("#carousel").css("padding", "0 0 0 20px");
            $("#carousel").addClass("result");

            $(".owl-controls").fadeOut(500);
            $(".customNavigation").fadeOut(500);
            $("#step_3").fadeOut(500);
            $("#transportation .item img").css("max-height", "100px");
            $("#carousel").css("height", "150px");

            $(".title").text("To domain: " + hostname);
            $(".title").css("margin-top", "10px");

            $("#track_it").text("Track Another Site");
            $("#track_it").off();
            $("#track_it").on("click", function(){
                logic.unlog_all_parsers();
                gui.show_home();
                if(parseFloat(window.innerWidth) > 767) window.location.href='./index.html';
            });
        }, 500);

        window.setTimeout(function(){
            //Make body for the result data:
            if(parseFloat(window.innerWidth) < 767 && parseFloat(window.innerWidth) > parseFloat(window.innerHeight)){
                $("#results_holder").css("height", "calc(100vh - 50px - 30px)");
            } else if(parseFloat(window.innerWidth) < 979){
                var tracker = parseInt(document.getElementById("tracker").offsetHeight);
                var carousel = parseInt(document.getElementById("carousel").offsetHeight);
                var button = parseInt(document.getElementsByTagName("footer")[0].offsetHeight);
                $("#results_holder").css("height", "calc(100vh - " + carousel + "px - " + button + "px)");
            } else {
                $("#results_holder").css("height", "500px");
            }

            //On landscape Phone, retract the locator
            if(window.innerWidth > window.innerHeight && parseFloat(window.innerWidth) <= 767){
                window.scrollTo(0,0);
                window.setTimeout(function(){
                    $("#carousel").fadeTo(200, 0);
                    $("#results_holder").css("top", "0");
                    $("#tracker").css("height", "calc(100vh - 50px - 30px)");
                }, 1500);
            }

            $(".owl-controls").css("display", "none !important;");
        }, 1500);

        //Show only the current OWL
        if(parseFloat(window.innerWidth) > 767) gui.create_summary();

        //Stop interaction
        $("#carousel").css("pointer-events", "none");

        //Set the ajax waiting icon

        window.setTimeout(function(){
            //Prepare GUI
            $("#results_holder").append("<h3 id='title_results' class='margin'>Trans-IT Results</h3>");
            $("#results_holder").append('<section id="results">');
            if(parseFloat(window.innerWidth) > 1200)
                $("#results_holder").append('<button class="desktop" onclick="gui.show_home(); location = location.href;">Track another site</button>');
            $("#results").addClass("animo");

            //Trigger the ajax calls
            xhr.set_searched_site(hostname);
            logic.track_it();
        }, 1000);
    },

    create_summary: function(){
        var selection = $("#transportation .active .item").data("tag");
        if(selection == undefined && current_owl != undefined){
            selection = $(current_owl);
        }

        nav_buffer = $("#carousel > *");
        $("#carousel > *").remove();
        $("#carousel").append("<div id='current_transport'>");
        $("#current_transport").append($(selection));
        $("#current_transport .item img").css("max-height", "100px");
    }
};

logic = {
//FLOWMANAGEMENT
    hostname_submission: function(event, hostname){
        //Set the vars to allow ajax
        gui.show_home();
        ajax_allowed = true;
        false_host = false;
        event.preventDefault();

        //Delete traces of previous track
        logic.unlog_all_parsers();

        //Init the new track
        logic.get_lastest_sites();
        logic.request_site_track(hostname);
        gui.show_trackr(hostname);
        helpers.get_geolocation(logic.parse_client_geolocation);
    },

    request_site_track: function(hostname){
        //Combine get_ip_by_hostname and get_location_by_ip.
        xhr.get_ip_by_hostname(hostname, true);
    },

    track_it: function(){
        if(localStorage.getItem("client_location") != undefined
            && localStorage.getItem("target_location") != undefined){

            //Get the selected transportation method
            var selection = $("#transportation .active .item").data("tag");
            if(selection == undefined && current_owl != undefined){
                selection = $(current_owl).data("tag");
            }

            //Write the current state to localstorage
            localStorage.setItem('activeOWL', selection);

            //Get the locations from client and target.
            //Get the geolocations
            var geo = {
                "client" : JSON.parse(localStorage.getItem("client_location")),
                "target" : JSON.parse(localStorage.getItem("target_location"))
            };

            if(geo.client == undefined || geo.target == undefined){
                gui.log_error("The cache has been lost, please try again. Apologies");
                return;
            }

            //Get the Distance
            var distance = logic.get_distance_from_geolocations(geo.client, geo.target);

            //Request the results from the selected transportation method
            logic.get_namespace(selection).get_tracker_response(distance, function(response){
                logic.parse_tracker_response(response);
            }, geo);

        } else {
            gui.log_error("The geocoördinates are not known");

            //Parse without response to trigger the error logging.
            logic.parse_tracker_response();
        }
    },

//PARSERS
    parse_target_location: function(location){
        //Save the location for the target in localstorage.

        if(location != undefined && location.statusCode == "OK"){
            //Get the data
            var target_loc = {
                street: "",
                city: location.cityName,
                region: location.regionName,
                zip: location.zipCode,
                country: location.countryName,
                lat: location.latitude,
                long: location.longitude,
                ip: location.ipAddress
            };

            //Save the data
            localStorage.setItem('target_location', JSON.stringify(target_loc));
        } else if(location != undefined && location.statusMessage != undefined) {
            //Show the error
            gui.log_error(location.statusMessage);

            //Block the remaining ajax calls from this request.
            ajax_allowed = false; setTimeout(function(){ajax_allowed = true;}, 1000);

            //Return to the homescreen
            gui.show_home();
        } else {
            //Show the error
            gui.log_error("An error occured while fetching the target's location. We're sorry.");

            //Block the remaining ajax calls from this request.
            ajax_allowed = false; setTimeout(function(){ajax_allowed = true;}, 1000);

            //Return to the homescreen
            gui.show_home();
        }
    },

    parse_client_geolocation: function(location){
        //Check for optional parameters
        if(location == undefined || location == false) {
            gui.error("Geolocation couldn't be fetched");
        }

        if(location.coords.latitude != null && location.coords.longitude != null){
            var client_geoloc = {
                acc: location.coords.accuracy,
                lat: location.coords.latitude,
                long: location.coords.longitude
            };

            //Save the data
            localStorage.setItem("client_geolocation", JSON.stringify(client_geoloc));

            //Fetch the location for these geocoordinates.
            xhr.get_location_by_coordinates(client_geoloc.lat, client_geoloc.long);
        } else {
            gui.error("Geolocation response packet damaged");
        }
    },

    parse_client_location: function(address){
        if(address != undefined && address.status == "OK" && address.results != undefined && address.results.length > 3
            && localStorage.getItem('client_geolocation') != undefined){
            //Get the geolocation data
            var client_geoloc = JSON.parse(localStorage.getItem("client_geolocation"));
            address = address.results;

            //Get the data
            var client_loc = {
                number: address[0].address_components[0].short_name,
                street: address[0].address_components[1].long_name,
                city: address[0].address_components[2].long_name,
                region: address[0].address_components[3].long_name,
                zip: address[0].address_components[6].long_name,
                country: address[5]["formatted_address"],
                lat: client_geoloc.lat,
                long: client_geoloc.long,
                ip: "",
                display_street: address[0].address_components[1].long_name + " " + address[0].address_components[0].long_name,
                display_city: address[1]["formatted_address"]
            };

            //Save & show the data
            localStorage.setItem('client_location', JSON.stringify(client_loc));
            gui.show_client_position(client_loc.display_street, client_loc.display_city);
        } else {
            //Show the error
            gui.log_error("An error occured while fetching the client's location. We're sorry.");
        }
    },

    parse_tracker_response: function(response){
        //Reset the results display
        $("#results").empty();
        var results_displayed = false;

        //Display the duration
        if(response != undefined && response.length > 0){
            for(var i=0; i<response.length; i++){
                if(response[i] != undefined){
                    var r = response[i];
                    var title = (r.title != undefined) ? r.title : "";
                    var dv = (r.display_value != undefined) ? r.display_value : "";
                    var val = (r.value != undefined) ? r.value : 0;
                    var an = (r.annotation != undefined) ? r.annotation : "progress-bar-info";

                    var node = gui.build_result_node(title, dv, val, an);
                    $( node )
                        .appendTo("#results");
                    node.id = 'node' + i;

                    node.style.opacity = 0;
                    (function(x){
                        setTimeout(function(){
                            document.getElementById('node' + x).style.opacity = 1;
                        }, 500);
                    })(i);

                    results_displayed = true;
                }
            }
        } else{
            gui.log_error("The Response was undefined, sorry");
        }

        if(!results_displayed){
            var p = $('<p>').appendTo("#results");
            p.html("No Valid Results could be shown. <br/>" +
                "Sorry for the inconvenience.");
        }
    },

    parse_latest_sites: function(data){
        var random_site;

        data = JSON.parse(data);
        if(data.success == "1") {
            data = data["array"];
            if(data.length > 0){
                var random_index = Math.floor(Math.random() * data.length);
                if(data[random_index] != undefined){
                    random_site = data[random_index].host;
                }
            }
        }

        //SafeGuard for the new found website
        if(random_site == undefined) random_site = "estebandenis.ddns.net";

        //Write the found random site
        localStorage.setItem('next_random_site', random_site);
    },

    unlog_all_parsers: function(){
        //Remove target_location data
        localStorage.removeItem('target_location');

        //Remove client geolocation data
        localStorage.removeItem("client_geolocation");

        //Remove client address data
        localStorage.removeItem('client_location');

        //Remove the selected item
        localStorage.removeItem('activeOWL');
    },

//LOGICAL GETTERS
    get_lastest_sites: function(){
        //This will get the random countries
        helpers.get_searched_site("!xyz", function(data){logic.parse_latest_sites(data);});
    },

    get_namespace: function(tag){
        switch(tag){
            case "speed_of_light":
                return speed_of_light;
            case "marathon_runner":
                return marathon_runner;
            case "bpost":
                return bpost;
            case "public_transport":
                return public_transport;
            case "pigeon":
                return pigeon;
            default:
                return logic;
        }
    },

    get_distance_from_geolocations: function(geoloc_start, geoloc_end){
        //Get the lat & longs
        var lat1 = parseFloat(geoloc_start.lat);
        var lat2 = parseFloat(geoloc_end.lat);
        var lon1 = parseFloat(geoloc_start.long);
        var lon2 = parseFloat(geoloc_end.long);

        //Calculate using the HaverSine Algorithm (Source: Stackoverflow)
        var R = 6371; // Radius of the earth in km
        var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
        var dLon = (lon2-lon1).toRad();
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km

        //Return the distance in int.
        return parseInt(d);
    }
};

xhr = {
//AJAX GETTERS
    get_ip_by_hostname: function(hostname, expects_location){
        //Check for override
        if(!ajax_allowed) return;

        //Check for optional parameters
        if(expects_location == undefined || !expects_location) expects_location = false;

        //Make sure that only the domain name is passed trough
            //hostname = hostname.split('/')[0];

        //Query the DNS-service
        var ip = "81.245.137.156";
        if(expects_location){
            return xhr.get_location_by_ip(ip, true);
        } else return ip;
        /*$.ajax({
            url: "http://api.statdns.com/" + hostname + "/a",
            method: "GET",
            success: function(data){
                if(data.answer != undefined && data.answer[0] != undefined && data.answer[0].rdata != undefined){
                    var ip = data.answer[0].rdata;
                    if(expects_location){
                        return xhr.get_location_by_ip(ip, true);
                    } else return ip;
                } else {
                    false_host = true;
                    gui.log_error("Hostname not resolved! Please try again by clicking the menu title");
                }
            },
            error: function(){
                gui.log_error("Something went wrong, sorry");
            }
        });*/
    },

    get_location_by_ip: function(ip, expects_callback){
        //Check for override
        if(!ajax_allowed) return;

        //Check for optional parameters
        if(expects_callback == undefined || !expects_callback) expects_callback = false;

        //The API key
        var key = "29794a40db8e20e6e4d9d20714252146bf17d2b63644f1fb35c8347c20201720";
        var url = "http://api.ipinfodb.com/v3/ip-city/?key=" + key + "&ip=" + ip + "&format=json";

        //Query the IPLocator service
        $.ajax({
            url: url,
            method: "GET",
            success: function(data){
                if(expects_callback){
                    logic.parse_target_location(data);
                } else return data;
            },
            error: function(){
                console.log("Something went wrong, sorry");
            }
        });
    },

    get_location_by_coordinates: function(lat, long){
        //Check for override
        if(!ajax_allowed) return;

        //The API key
        var key = "AIzaSyBRnyhTk1y81e9DZAms_l-_VRVOf24Wpz4";
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&language=en&key=" + key;

        //Query the reverse geocoding service
        $.ajax({
            url: url,
            method: "GET",
            success: function(data){
                logic.parse_client_location(data);
            },
            error: function(){
                console.log("Something went wrong, sorry");
            }
        })
    },

    set_searched_site: function(hostname){
        if(localStorage.getItem("target_location") != undefined){
            var data = JSON.parse(localStorage.getItem("target_location"));
            var country = data.country;
            var ip = data.ip;
            var lat = data.lat;
            var long = data.long;

            var data = {
                "ip": ip.toString() ,
                "country": country.toString(),
                "lat": lat.toString(),
                "long": long.toString(),
                "host": hostname.toString()
            };
            data = JSON.stringify(data);
            var sss = make_sss_id(data.length);

            var url = "http://estebandenis.ddns.net/api/update_site.php?sss=" + sss;

            $.ajax({
                method: "POST",
                url: url,
                data: {"data": data},
                success: function(){
                    console.log(hostname + " has been saved to the database");
                },
                error: function(){
                    console.log(hostname + " resulted in an error in the database");
                }
            });
        }
    }
};