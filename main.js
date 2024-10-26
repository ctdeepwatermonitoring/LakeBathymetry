// initialize the map
var lat= 41.55;
var lng= -72.65;
var zoom= 9;

//Load a tile layer base map from USGS ESRI tile server https://viewer.nationalmap.gov/help/HowTo.htm
var hydro = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSHydroCached/MapServer/tile/{z}/{y}/{x}',{
    attribution: 'USGS The National Map: National Hydrography Dataset. Data refreshed March, 2020.',
    maxZoom:16}),
    topo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',{
        attribution: 'USGS The National Map: National Boundaries Dataset, 3DEP Elevation Program, Geographic Names Information System, National Hydrography Dataset, National Land Cover Database, National Structures Dataset, and National Transportation Dataset; USGS Global Ecosystems; U.S. Census Bureau TIGER/Line data; USFS Road Data; Natural Earth Data; U.S. Department of State Humanitarian Information Unit; and NOAA National Centers for Environmental Information, U.S. Coastal Relief Model. Data refreshed May, 2020.USGS The National Map: National Topography Dataset. Data refreshed March, 2020.',
        maxZoom:16
    });
    Thunderforest_Landscape = L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=e4e0f2bcb8a749f4a9b355b5fca1d913', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: '<your apikey>',
	maxZoom: 22
});

var baseMaps = {
    "Hydro": hydro,
    "Topo": topo,
    "Landscape": Thunderforest_Landscape
  };

var map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    layers:[hydro]
});

map.setView([lat, lng], zoom);
map.createPane('top');
map.getPane('top').style.zIndex=650;

L.control.attribution({position: 'bottomleft'}).addTo(map);

L.control.zoom({
     position:'topright'
}).addTo(map);


var customOptions =
    {
        'maxWidth': '500',
        'className' : 'custom'
    };

var ctsites = "https://www.waterqualitydata.us/data/Station/search?organization=CT_DEP01_WQX&&startDateLo=01-01-2015&startDateHi=01-01-2025&minactivities=1&mimeType=geojson&zip=no"

// load GeoJSON from an external file and display circle markers
$.getJSON("historic_lake_bathymetry.geojson",function(data){
    console.log(data);
  var marker = L.geoJson(data, {
    pointToLayer: function(feature,latlng){
      var markerStyle = {
        fillColor:'#FDB515',
        radius: 5,
        color: "#0D2D6C",
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.7,
        pane: 'top'
      };
      return L.circleMarker(latlng, markerStyle);
    },
    onEachFeature: function (feature,marker) {
      var href = "pdfs/"+ feature.properties.lake_nm
      marker.bindPopup('<b>Lake: </b>'+ feature.properties.locationNa+'</br>' + 
        '<a href="'+href+'"target="_blank"'+'" </a> Link to PDF Map',customOptions);
    }
    }).addTo(map);
  });

// load GeoJSON of CT Boundary
var linestyle = {
    "color": "black",
    "weight": 2,
};

  $.getJSON("CT_state_boundary.geojson",function(linedata){
      console.log(linedata);
      L.geoJson(linedata,{
          style:linestyle
      }).addTo(map);
  });

//add legend
var legend = L.control({position: 'topleft'});

    // Function that runs when legend is added to map
    legend.onAdd = function (map) {
      // Create Div Element and Populate it with HTML
      var div = L.DomUtil.create('div', 'legend');
      div.innerHTML += '<i class="circle" style="background: #FDB515"></i><p> Historic Lake Bathymetry Site <br> Click for pdf map</p>';

      // Return the Legend div containing the HTML content
      return div;
    };

    // Add Legend to Map
    legend.addTo(map);

    L.control.layers(baseMaps).addTo(map);
