import { useEffect, useRef, useState } from "react";
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
import { useGeographic } from "ol/proj";

function OLMap() {
    const [geojsonData, setGeojsonData] = useState(null);
    const mapRef = useRef(null);

    useGeographic();

    useEffect(() => {
        const fetchGeoJson = async () => {
            try {
                const response = await fetch("src/assets/export.geojson");
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch GeoJSON (${response.status} ${response.statusText})`
                    );
                }
                const data = await response.json();
                setGeojsonData(data);
            } catch (error) {
                console.error("Error fetching GeoJSON:", error);
                throw error;
            }
        };

        fetchGeoJson();
    }, []);

    useEffect(() => {
        if (!mapRef.current || !geojsonData) return;

        console.log(geojsonData);

        const features = new GeoJSON().readFeatures(geojsonData);

        console.log(features);

        const vectorSource = new VectorSource({
            features: features,
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource as VectorSource<Feature<Geometry>>,
        });

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayer,
            ],
            view: new View({
                center: [29.77208484658834, 62.58383087994005], // Start from Joensuu
                zoom: 12,
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
    }, [geojsonData]);

    return <div ref={mapRef} id="map" />;
}

export default OLMap;
