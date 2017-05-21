//THIS JAVASCRIPT FILE RETURNS THE VALUES NEEDED FOR THE CUSTOM
//TRANSPORTATION CALCULATIONS

//Namespaces
var speed_of_light = speed_of_light || {};
var marathon_runner = marathon_runner || {};
var bpost = bpost || {};
var public_transport = public_transport || {};
var pigeon = pigeon || {};

//Constants
var tcp_packet_data = 64;   //in KB
var tmr_id;

//Assign namespaces
speed_of_light = {
    get_speed: function(expects_int, expects_sec){
        //Check for optional parameters
        if(expects_int == undefined || !expects_int) expects_int = false;
        if(expects_sec == undefined || !expects_sec) expects_sec = false;

        if(expects_int){
            if(expects_sec){
                return 299792458;   //in m/s
            } else {
                return 1079252848.8;    //in km/h
            }
        } else {
            return "299 792 458 m/s";
        }
    },

    get_duration: function(distance_in_km, expectsNanoSeconds, expectsFull){
        //Check for optional parameters
        if(expectsNanoSeconds == undefined || !expectsNanoSeconds) expectsNanoSeconds = false;
        if(expectsFull == undefined || !expectsFull) expectsFull = false;

        var distance;
        if(distance_in_km != undefined) distance = distance_in_km; //in km
        else distance = 0;

        var speed = parseFloat(speed_of_light.get_speed(true, true));   //in m/s
        var duration = parseFloat(parseFloat(distance * 1000) / speed); // in seconds

        if(expectsNanoSeconds){
            var duration_in_ns = parseFloat(duration * 1000000000); // in ns
            if(expectsFull) return duration_in_ns;
            else return duration_in_ns.toFixed(2);
        } else {
            if(expectsFull) return duration;    //in sec
            else return duration.toFixed(2);
        }
    },

    get_transmittionrate: function(distance, time_in_seconds){
        //Get the tripduration in hours
        var trip = parseFloat(speed_of_light.get_duration(distance, false, true) * 2); // in sec

        //Get the total trips within given time.
        var total_trips = Math.floor(parseFloat(time_in_seconds / trip));

        //Calculate the data
        var data_in_kb = parseFloat(total_trips * tcp_packet_data);
        var data_in_mb = parseFloat(data_in_kb / 1024).toFixed(2);

        return {
            value: data_in_mb,
            text: data_in_mb + "MB"
        };
    },

    get_description: function(){
        var description = {
            image: "./assets/speed_of_light.png",
            title: "The Speed of Light",
            duration: "Fast As Lightning",
            duration_p: 100,
            duration_annotation: "progress-bar-success",
            cost: "FREE!",
            cost_p: 5,
            cost_annotation: "progress-bar-success",
            availability: "Always",
            availability_annotation: "text-success",
            datarate: "Very High",
            datarate_annotation: "text-success"
        };
        return JSON.stringify(description);
    },

    get_tracker_response: function(distance, callback_function){
        //Get the results
        var dur = speed_of_light.get_duration(distance, true);
        var transrate = speed_of_light.get_transmittionrate(distance, 60);

        //Get the annotations
        var an1 = get_annotation(dur, 100000);
        var an2 = get_annotation(transrate.value, 1500);

        var response = [
            {
                title: "Speed Of Light",
                value: dur,
                display_value: dur + " nanoseconds",
                annotation: an1
            },

            {
                title: 'Data transferred in 1 minute',
                value: transrate.value,
                display_value: transrate.text,
                annotation: an2
            },

            {
                title: 'Cost',
                value: 0,
                display_value: 'NOTHING - Light is free!',
                annotation: "progress-bar-success"
            }
        ];

        callback_function(response);
    }
};

marathon_runner = {
        //Pheidippides liep 246 km in 2 dagen en stierf dan.
    get_marathon_distance: function(){return 246;},

    get_duration: function(distance_in_km){
        var runners = marathon_runner.get_needed_runners(distance_in_km, true);
        var days_to_run = runners * 2;

        return days_to_run.toFixed(1);
    },

    get_needed_runners: function(distance_in_km, expectFull){
        //Handle the optional parameters
        if(expectFull == undefined || !expectFull) expectFull = false;

        var runners_needed = parseFloat(distance_in_km) / marathon_runner.get_marathon_distance();

        if(expectFull) return runners_needed;
        else return Math.ceil(runners_needed);
    },

    get_walking_distance: function(client, target, d, c, isGeo){
        //Check for optional paramaters
        if(isGeo == undefined || isGeo != false) isGeo = true;

        //Check if the geo is set
        if(isGeo == false){
            marathon_runner.parse_tracker_response(d, c, d);    //If not available,
                    // return the effective distance as walking distance.
        }

        //Prepare the ajax
        var key = "AIzaSyBRnyhTk1y81e9DZAms_l-_VRVOf24Wpz4";
        var url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" +
            client.lat + "," + client.long + "&destinations=" + target.lat + "," + target.long +
            "&mode=walking&key=" + key;

        $.ajax({
            method: "POST",
            //url: "./php/api_forwarder.php?soft_secur_shell=" + encodeURIComponent(make_sss_id(url.length)),
            url: url,
            data: {'apiurl': url},
            success: function(data){
                data = JSON.parse(data);
                if(data.status == "OK"){
                    if(data.rows[0].elements[0].status == "ZERO_RESULTS"){
                        marathon_runner.parse_tracker_response(d, c, d); //If not available,
                        // return the effective distance as walking distance.
                    } else {
                        var distance = {
                            text: data.rows[0].elements[0].distance.text,
                            value: parseFloat(data.rows[0].elements[0].distance.value / 1000).toPrecision(3)
                        };
                        marathon_runner.parse_tracker_response(d, c, distance);
                    }
                } else marathon_runner.parse_tracker_response(d, c, d); //If not available,
                    // return the effective distance as walking distance.
            },
            error: function(){
                marathon_runner.parse_tracker_response(d, c, d);  //If not available,
                            // return the effective distance as walking distance.
            }
        });
    },

    get_description: function(){
        var description = {
            image: "./assets/marathon_runner.png",
            title: "Half Nude Greek Marathon Runner",
            duration: "Running 'till death",
            duration_p: 30,
            duration_annotation: "progress-bar-danger",
            cost: "17 septimus!",
            cost_p: 17,
            cost_annotation: "progress-bar-success",
            availability: "Extinct",
            availability_annotation: "text-danger",
            datarate: "Very High",
            datarate_annotation: "text-success"
        };
        return JSON.stringify(description);
    },

    get_tracker_response: function(distance, callback_function, geo) {
        //Check for optional parameters
        if(geo.client == undefined || geo.target == undefined) geo = undefined;

        //Fetch the location
        (geo != undefined) ?
            marathon_runner.get_walking_distance(geo.client, geo.target, distance, callback_function)
            : marathon_runner.get_walking_distance(null, null, distance, callback_function);
    },

    parse_tracker_response: function(distance, callback_function, wd){
        //Get the results
        var d = marathon_runner.get_duration(distance);
        var r = Math.ceil(marathon_runner.get_needed_runners(distance) - 1);

        var val = wd.value;
        wd = wd.text;

        //Get the annotations
        var an1 = get_annotation(d, 20, true);
        var an2 = get_annotation(r, 8, true);
        var an3 = (val != undefined) ? get_annotation(val, 400) : "progress-bar-info";

        var dv = (wd != undefined) ? "a little " + wd + " field trip." : "error in geolocation";

        var response = [
            {
                title: "Website loaded in",
                value: d * 100,
                display_value: d + " days",
                annotation: an1
            },

            {
                title: "Runners Sacrificed",
                value: r * 10,
                display_value: r + " runners dead",
                annotation: an2
            },

            {
                title: "Walking Distance",
                value: val,
                display_value: dv,
                annotation: an3
            }
        ];

        callback_function(response);
    }
};

bpost = {
    get_duration: function(){
        var random = Math.round(Math.random() * 20);
        return {
            value: random,
            display_value: random + " days"
        };
    },

    get_transferrate: function(){
        var random = Math.round(Math.random() * 100);
        return {
            value: random,
            display_value: random + " GB"
        };
    },

    get_cost: function(){
        var random = Math.round(Math.random() * 400);
        return {
            value: random,
            display_value: random + " euro/packet"
        };
    },

    get_description: function(){
        var description = {
            image: "./assets/bpost.png",
            title: "BPost Service",
            duration: "3/4 Day Delivery",
            duration_p: 70,
            duration_annotation: "progress-bar-warning",
            cost: "Based On Distance",
            cost_p: 50,
            cost_annotation: "progress-bar-warning",
            availability: "Week-only",
            availability_annotation: "text-success",
            datarate: "High",
            datarate_annotation: "text-success"
        };
        return JSON.stringify(description);
    },

    get_tracker_response: function(distance, callback_function){
        var d = bpost.get_duration();
        var tr = bpost.get_transferrate();
        var c = bpost.get_cost();

        var an1 = get_annotation(d.value, 14, true);
        var an2 = get_annotation(tr.value, 30, true);
        var an3 = get_annotation(c.value, 60, true);

        var response = [
            {
                title: "In Transit",
                value: d.value,
                display_value: d.display_value,
                annotation: an1
            },
            {
                title: "More efficient then internet if",
                value: tr.value,
                display_value: tr.display_value + " is transferred",
                annotation: an2
            },
            {
                title: "Poststamp Cost",
                value: c.value,
                display_value: c.display_value,
                annotation: an3
            }
        ];

        callback_function(response);
    }
};

public_transport = {
    get_cost: function(steps){
        var total = 0;

        if(steps != undefined)
        for(var i=0; i<steps.length; i++){
            if(steps[i] == undefined) break;
            var e = steps[i];
            if(e.travel_mode == "WALKING"){
                //WALKING IS FREE
            } else if (e.travel_mode == "TRANSIT"){
                if(e.transit_details.line.vehicle == undefined) break;
                var type = e.transit_details.line.vehicle.type;
                switch(type){
                    case "BUS":
                        total = total + 3;
                        break;
                    case "RAIL":
                        total = total + 10;
                        break;
                    case "SUBWAY":
                        total = total + 2;
                        break;
                    case "TRAM":
                        total = total + 2.5;
                        break;
                    case "MONORAIL":
                        total = total + 4;
                        break;
                    case "TROLLEYBUS":
                        total = total + 3.2;
                        break;
                    case "CABLE_CAR":
                        total = total + 30;
                        break;
                    case undefined:
                        var name = e.transit_details.line.vehicle.name;
                        if(name == undefined){
                            //We charge 1 euro for each not recognized type
                            total++;
                        } else if (name == "Long distance train"){
                            total = total + 12;
                        }
                        break;
                    default:
                        //DEFAULT, We charge 1.8 euro for each undefined type
                        total = total + 1.8;
                        break;
                }
            } else {
                //DEFAULT, We charge 1.8 euro for each undefined type
                total = total + 1.8;
            }
        }

        //Double for the return trip
        total = total * 2;

        return {
            text: total + " euro",
            value: total
        }
    },

    get_transport_route: function(client, target, d, c){
        //Set the ajax call
        var key = "AIzaSyBRnyhTk1y81e9DZAms_l-_VRVOf24Wpz4";
        var url = "https://maps.googleapis.com/maps/api/directions/json?origin=" +
            client.lat + "," + client.long + "&destination=" + target.lat + "," + target.long +
            "&mode=transit&key=" + key;

        $.ajax({
            method: "POST",
            //url: "./php/api_forwarder.php?soft_secur_shell=" + encodeURIComponent(make_sss_id(url.length)),
            url: url,
            data: {'apiurl': url},
            success: function(data){
                data = JSON.parse(data);
                if(data.status == "OK"){
                    var duration = {
                        text: data.routes[0].legs[0].duration.text,
                        value: parseFloat(parseFloat(data.routes[0].legs[0].duration.value) / 3600)
                    };

                    var overstappen = parseInt(data.routes[0].legs[0].steps.length) - 1;
                    var steps = {
                        text: "transfer " + overstappen + " times",
                        value: overstappen
                    };

                    var cost = public_transport.get_cost(data.routes[0].legs[0].steps);

                    var results = [
                        duration, steps, cost
                    ];

                    public_transport.parse_tracker_response(d, c, results);
                } else public_transport.parse_tracker_response(d, c);
            },
            error: function(){
                public_transport.parse_tracker_response(d, c);
            }
        })
    },

    get_description: function(){
        var description = {
            image: "./assets/public_transport.png",
            title: "Public Transport",
            duration: "waiting for the bus...",
            duration_p: 20,
            duration_annotation: "progress-bar-danger",
            cost: "go-pass anyone?",
            cost_p: 70,
            cost_annotation: "progress-bar-warning",
            availability: "Every Day",
            availability_annotation: "text-success",
            datarate: "Average",
            datarate_annotation: "text-warning"
        };
        return JSON.stringify(description);
    },

    get_tracker_response: function(distance, callback_function, geo){
        //Check for optional parameters
        if(geo.client == undefined || geo.target == undefined) geo = undefined;

        //Fetch the location
        (geo != undefined) ?
            public_transport.get_transport_route(geo.client, geo.target, distance, callback_function)
            : public_transport.parse_tracker_response(distance, callback_function)
    },

    parse_tracker_response: function(d, callback_function, r){
        if(r == undefined){
            var response = undefined;
        } else {
            var an1 = get_annotation(r[0].value, 10, true);
            var an2 = get_annotation(r[1].value, 10);
            var an3 = get_annotation(r[2].value, 200, true);

            var response = [
                {
                    title: "Single Trip Duration",
                    value: r[0].value.toFixed(2) * 10,
                    display_value: r[0].text,
                    annotation: an1
                },

                {
                    title: "Transfers",
                    annotation: an2
                },

                {
                    title: "Estimated Transfercost",
                    value: r[2].value.toFixed(2) * 3,
                    display_value: r[2].text,
                    annotation: an3
                }
            ];
        }

        callback_function(response);
    }
};

pigeon = {
    get_duration: function(distance, expectsSec){
        //Check for optional parameters
        if(expectsSec == undefined || !expectsSec) expectsSec = false;

        //A pigeon flies at 80 km/h and up to 1300km.
        var duration = parseFloat(distance / 80);   //in hours

        if(expectsSec){
            return duration * 3600;
        } else return duration.toFixed(2);
    },

    get_efficiency_call: function(distance, ping_in_sec){
        //Get the duration of the pidgeon
        var dur = pigeon.get_duration(distance, true);   //In seconds

        //Get the amout of data that can be send in that time.
        var packets = Math.floor(parseFloat(dur / ping_in_sec));
        var kb = parseInt(packets * tcp_packet_data);

        //Recalculate to MB.
        return parseFloat(parseFloat(kb / 1024) / 1024).toFixed(2);
    },

    get_description: function(){
        var description = {
            image: "./assets/pigeon.png",
            title: "Postal Pidgeon",
            duration: "at Windspeed",
            duration_p: 35,
            duration_annotation: "progress-bar-warning",
            cost: "At least two pidgeons.",
            cost_p: 60,
            cost_annotation: "progress-bar-success",
            availability: "Pidgeons sleep at night",
            availability_annotation: "text-warning",
            datarate: "USB-stick",
            datarate_annotation: "text-success"
        };
        return JSON.stringify(description);
    },

    get_tracker_response: function(distance, callback_function){
        tmr_id = helpers.start_timer();
        $.ajax({
            method: "GET",
            url: "http://estebandenis.ddns.net/api/get_site.php?ping=pong",
            success: function(){
                var count_in_sec = helpers.stop_timer(tmr_id);
                var eff = pigeon.get_efficiency_call(distance, count_in_sec);

                (eff == undefined || isNaN(eff)) ? pigeon.parse_tracker_response(distance, callback_function)
                    : pigeon.parse_tracker_response(distance, callback_function, { value: parseFloat(eff), display_value: eff + " GB" });
            },
            error: function(){
               pigeon.parse_tracker_response(distance, callback_function);
            }
        });
    },

    parse_tracker_response: function(distance, callback_function, r){
        //Get the results
        var dur = pigeon.get_duration(distance);

        //Get the annotations
        var an1 = get_annotation(dur, 1000);
        var an3 = get_annotation(parseInt(distance), 500, true);

        if(r != undefined && r.value != undefined){
            var val = (parseFloat(parseFloat(r.value) / 10) < 150) ? 150 : parseFloat(r.value);
        }

        var response;
        if(val != undefined && r.display_value != undefined){
            response = [
                {
                    title: "Flight Duration",
                    value: dur * 3,
                    display_value: dur + " hours",
                    annotation: an1
                },
                {
                    title: "More efficient then internet when: ",
                    value: val,
                    display_value: r.display_value + " is transferred",
                    annotation: "progress-bar-info"
                },
                {
                    title: "Flight Distance",
                    value: distance,
                    display_value: distance + " km in freeflight",
                    annotation: an3
                }
            ];
        } else {
            response = [
                {
                    title: "Flight Duration",
                    value: dur,
                    display_value: dur + " hours",
                    annotation: an1
                },
                {
                    title: "Flight Distance",
                    value: distance,
                    display_value: distance + " km in freeflight",
                    annotation: an3
                }
            ];
        }

        callback_function(response);
    }
};

//GENERAL FUNCTION
function get_annotation(value, max_value, inverted){
    //Check for optional parameters
    if(inverted == undefined || !inverted) inverted = false;

    var pro = parseFloat((value / max_value) * 100);

    if(inverted){
        if(pro < 25){
            return "progress-bar-success";
        } else if (pro < 65){
            return "progress-bar-warning";
        } else if (pro < 100 || pro > 100){
            return "progress-bar-danger";
        } else return "progress-bar-info";
    } else {
        if(pro < 25){
            return "progress-bar-danger";
        } else if (pro < 65){
            return "progress-bar-warning";
        } else if (pro < 100 || pro > 100){
            return "progress-bar-success";
        } else return "progress-bar-info";
    }
}