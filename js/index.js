window.onload = () => {};

var map;
var markers = [];
var infoWindow;
var locationSelect;

function initMap(style) {
  var losAngeles = {
    lat: 34.06338,
    lng: -118.35808,
  };
  map = new google.maps.Map(document.getElementById("map"), {
    center: losAngeles,
    zoom: 11,
    mapTypeId: "roadmap",
    styles: style,
  });
  infoWindow = new google.maps.InfoWindow();
  searchStores();
}

function searchStores() {
  var zipCode = document.getElementById("zip-code-input").value;
  var foundStores = [];
  if (zipCode.length > 4) {
    foundStores = stores.filter(
      (store) => store.address.postalCode.substring(0, 5) == zipCode
    );
  }
  if (foundStores.length == 0) {
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores);
  showStoresMarkers(foundStores);
  setOnClickListener();
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function setOnClickListener() {
  var storeElements = document.querySelectorAll(".store-container");
  storeElements.forEach((storeElement, index) => {
    storeElement.addEventListener("click", () => {
      google.maps.event.trigger(markers[index], "click");
    });
  });
}

function displayStores(stores) {
  var storesHtml = "";
  stores.forEach((store, index) => {
    var {
      addressLines: address,
      phoneNumber: phone,
      name
    } = store;
    storesHtml += `
            <div class="store-container">
              <div class="store-container-background">
                  <div class="store-info-container">
                      <div class="store-address">
                          <span>
                              ${address[0]}
                          </span>
                          <span>
                              ${address[1]}
                          </span>
                      </div>
                      <div class="store-phone-number">${phone}</div>
                  </div>
                  <div class="store-number-container">
                      <div class="store-number">
                          ${index + 1}
                      </div>
                  </div>
              </div>
            </div>
        `;
    document.querySelector(".stores-list").innerHTML = storesHtml;
  });
}

function showStoresMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  stores.forEach((store, index) => {
    var latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude
    );
    var {
      name,
      addressLines: address,
      openStatusText: openStatus,
      phoneNumber: phone,
    } = store;
    bounds.extend(latlng);
    createMarker(latlng, name, address[0], openStatus, phone, index + 1);
  });
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, openStatus, phone, index) {
  var html = `
      <div class="store-info-window">
        <div class="store-info-name">
          ${name}
        </div>
        <div class="store-info-status">${openStatus}</div>
        <div class="store-info-address" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${latlng}')">
          <div class="circle">
            <i class="fas fa-location-arrow"></i>
          </div>
          ${address}
        </div>
        <div class="store-info-phone">
          <div class="circle">
            <i class="fas fa-phone-alt"></i>
          </div>
          ${phone}
        </div>
      </div>
    `;
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: index.toString()
  });
  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

function openMarker(lat, lng, index, name, openStatus, address) {
  var latlng = new google.maps.LatLng(lat, lng);
  var html = `
      <div class="marker">
        <div class="marker-info">
            <b>${name}</b>
            <div class="working-hours">${openStatus}</div>
        </div>
        <div class="marker-contact-info">
        <div class="adress">
            <a href="https://www.google.com/maps/search/?api=1&query=${latlng}" target="_blank">
                <div class="icon-container"><i class="fa fa-location-arrow" aria-hidden="true"></i>
                </div>
                <div>${address}</div>
            </a>
        </div>
        <div class="phone">
            <div class="icon-container"><i class="fa fa-phone" aria-hidden="true"></i>
            </div><div>${phone}</div>
        </div>
        </div>
      </div>
    `;
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: index.toString(),
  });
  infoWindow.setContent(html);
  infoWindow.open(map, marker);
}

//Change theme
function changeTheme() {
  var checked = document.getElementById("theme-toggle").checked;
  var style = [{
      elementType: "geometry",
      stylers: [{
        color: "#242f3e",
      }, ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{
        color: "#242f3e",
      }, ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{
        color: "#746855",
      }, ],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#d59563",
      }, ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#d59563",
      }, ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{
        color: "#263c3f",
      }, ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#6b9a76",
      }, ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{
        color: "#38414e",
      }, ],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{
        color: "#212a37",
      }, ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#9ca5b3",
      }, ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{
        color: "#746855",
      }, ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{
        color: "#1f2835",
      }, ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#f3d19c",
      }, ],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{
        color: "#2f3948",
      }, ],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#d59563",
      }, ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{
        color: "#17263c",
      }, ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#515c6d",
      }, ],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{
        color: "#17263c",
      }, ],
    },
  ];

  if (checked) {
    document.getElementById("dark-theme-manager").classList.add("dark-theme");
    return initMap(style);
  } else {
    document
      .getElementById("dark-theme-manager")
      .classList.remove("dark-theme");
    return initMap();
  }
}
