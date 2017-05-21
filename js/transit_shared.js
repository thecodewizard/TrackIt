//DECLARE NAMESPACES
var helpers = helpers || {};

//Global variables
var timer = [];

//DEFINE HELPER FUNCTIONS
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function make_sss_id(x)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < x; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//ASSIGN NAMESPACES
helpers = {
    //INITIALISERS
    init_theme: function(){
        if(localStorage){
            var saved_theme = localStorage.getItem('trackit_theme');
            if(saved_theme != undefined && saved_theme == "dark"){
                if(!$("body").hasClass("dark")) helpers.toggle_theme();
            } else if(saved_theme != undefined && saved_theme == "light"){
                if($("body").hasClass("dark")) helpers.toggle_theme();
            }
        }
    },

    //TOGGLERS
    expand_menu: function(){
        $("#placeholder").addClass('expanded');
        $("#toastmenu").addClass('expanded');
    },

    collapse_menu: function(){
        $("#placeholder").removeClass('expanded');
        $("#toastmenu").removeClass('expanded');
    },

    toggle_theme: function(){
        if($("body").hasClass("dark")){
            $("body").removeClass("dark");
            $("#themetoggler").text("Go To Dark Theme");
            if(localStorage) localStorage.setItem('trackit_theme', 'light');
        } else {
            $("body").addClass("dark");
            $("#themetoggler").text("Go To Light Theme");
            if(localStorage) localStorage.setItem('trackit_theme', 'dark');
        }
    },

    //LOGIC - LOGICAL GETTERS
    get_geolocation: function(callback_function){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(callback_function);
        } else {
            callback_function(false);
        }
    },

    start_timer: function(){
        //Make the timer
        var i;
        do{
            i = Math.random() * 100;
            i = Math.round(i);
        } while(timer[i] != undefined);
        timer[i] = { value: "", tmr: "" };
        timer[i].value = 0.1;
        timer[i].tmr = setInterval(function(){
            timer[i].value = timer[i].value + 0.01;
        }, 10);

        return i;
    },

    stop_timer: function(i){
        if(timer[i] == undefined){
            return false;
        } else {
            clearInterval(timer[i].tmr);
            return timer[i].value;
        }
    },

    //AJAX GETTERS
    get_searched_site: function(country, callback_site){
        //Prepare the ajax call
        var sss = make_sss_id(country.length);
        var url = "http://estebandenis.ddns.net/api/get_site.php?country=" + country + "&sss=" + sss;

        //Make the ajax call
        $.ajax({
            method: "GET",
            url:    url,
            success: function(data){
                //Set easteregg
                if(getParameterByName("easter") == "egg"){
                    audio = new Audio('./assets/elevator.mp3');
                    audio.volume = 0.5;
                    audio.play();
                    audio.currentTime = 1;
                }

                callback_site(data);
            },
            error: function(){
                console.log("Something went wrong during the 'get_searched_site' ajax call");
            }
        });
    }
};