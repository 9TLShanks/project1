

    let mapToken=Maptoken;
	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: Listings.geometry.coordinates, // starting position [lng, lat].
        zoom: 10 // starting zoom
    });

    const marker1 = new mapboxgl.Marker({ color: "red"})
    .setLngLat(Listings.geometry.coordinates)
    .setPopup (new mapboxgl.Popup({offset: 25})
    .setHTML(`<h3>${Listings.location}</h3>
        <p>Exact details will be provided after booking</p>`))
    .addTo(map);
