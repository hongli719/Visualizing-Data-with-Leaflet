var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {


    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
      },
      pointToLayer: function(feature, latlng) {
        if (feature.properties.mag > 5) {
            var color = "rgb(255,0,0)";
        }
        else if (feature.properties.mag > 4) {
            var color = "rgb(255,51,0)";
        }
        else if (feature.properties.mag > 3) {
            var color = "rgb(255,102,0)";
        }
        else if (feature.properties.mag > 2) {
            var color = "rgb(255,153,0)";
        }
        else if (feature.properties.mag > 1) {
            var color = "rgb(255,204,0)";
        }
        else {
            var color = "rgb(255,255,0)";
        }

        var marker = {
            radius: 5*feature.properties.mag,
            fillColor: color,
            color: color,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          };
        
        return L.circleMarker(latlng, marker);
      }
     
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });

    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });
    
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap,
        "Satellite Map": satellite
    };
    
      // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes

        // Tectonic_Plates: d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
        // function(dataa) {
     
        //   L.geoJson(dataa, {
        //     color: "yellow",
        //     weight: 2
        //   })
          
        // })
    };
    
      // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });
    
      // Create a layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({
        position: "bottomright"
    });
    legend.onAdd = function(myMap) {
        var div = L
          .DomUtil
          .create("div", "info legend");
        
        var labels = ["<strong>Magnitude</strong>"];
    
        var grades = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        var colors = ["rgb(255,255,0)", "rgb(255,204,0)", "rgb(255,153,0)", "rgb(255,102,0)", "rgb(255,51,0)", "rgb(255,0,0)"];
    
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML += labels.push("<i style='background:" + colors[i] + "'></i> " +
          (grades[i] ? grades[i] : '+'));
        }
        div.innerHTML = labels.join('<br>');

        return div;
    };
    
    legend.addTo(myMap);
}




