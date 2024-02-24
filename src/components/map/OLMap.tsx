import { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "./olMap.css";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";
import MapBrowserEvent from "ol/MapBrowserEvent";

const geojsonData = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [3286012.0935983104, 9006746.720218109],
            },
            properties: {
                name: "Koti",
            },
        },
    ],
};

// Create a new GeoJSON format parser instance
const geoJSONFormat = new GeoJSON();

// Parse the GeoJSON data into an OpenLayers feature
const features = geoJSONFormat.readFeatures(geojsonData);

// Create a vector source and add the features
const vectorSource = new VectorSource({
    features: features, // Pass an array of features
});

// Create a vector layer and add the source
const vectorLayer = new VectorLayer({
    source: vectorSource as VectorSource<Feature<Geometry>>,
});

function OLMap() {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayer,
            ],
            view: new View({
                center: [3282802.75875484, 8989233.876836976], // Start from Joensuu
                zoom: 9.377050107672698,
            }),
        });

        function coords(e: MapBrowserEvent<PointerEvent>) {
            const view = map.getView();
            const center = view.getCenter();
            const zoom = view.getZoom();
            console.log("View Center:", center);
            console.log("Zoom Level:", zoom);

            console.log("click coords ", e.coordinate);
        }

        map.on("click", (e) => coords(e));

        return () => {
            map.dispose();
        };
    }, []);

    return <div ref={mapRef} id="map" />;
}

export default OLMap;
