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
import { useGeographic } from "ol/proj";
import SideBar from "./SideBar";

interface LayerVisibility {
    [key: string]: boolean;
}

function OLMap() {
    const [geojsonData, setGeojsonData] = useState(null);
    const mapRef = useRef(null);
    const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
        line2: true,
        line3: false,
    });

    // const [mapState, setMapState] = useState<Map | null>(null);
    const [layerMap, setLayerMap] = useState<Record<
        string,
        VectorLayer<VectorSource<Feature<Geometry>>>
    > | null>(null);

    useGeographic();

    function toggleLayerVisibility(layerName: string) {
        const layer = layerMap?.[layerName];

        if (layer) {
            layer.setVisible(!layer.getVisible());
            setLayerVisibility((prev) => ({
                ...prev,
                [layerName]: !prev[layerName],
            }));
        }
    }

    useEffect(() => {
        const fetchGeoJson = async () => {
            try {
                const response = await fetch("src/assets/stops.geojson");
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

        const features = new GeoJSON().readFeatures(geojsonData);

        const filteredFeatures2 = features.filter(
            (feature) => feature.get("VERKKO") === 2
        );

        const filteredFeatures3 = features.filter(
            (feature) => feature.get("VERKKO") === 3
        );

        const vectorSource2 = new VectorSource({
            features: filteredFeatures2,
        });
        const vectorSource3 = new VectorSource({
            features: filteredFeatures3,
        });

        const vectorLayer2 = new VectorLayer({
            source: vectorSource2 as VectorSource<Feature<Geometry>>,
            visible: layerVisibility.line2,
        });
        const vectorLayer3 = new VectorLayer({
            source: vectorSource3 as VectorSource<Feature<Geometry>>,
            visible: layerVisibility.line3,
        });

        setLayerMap({ line2: vectorLayer2, line3: vectorLayer3 });

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayer2,
                vectorLayer3,
            ],
            view: new View({
                center: [24.87413567501612, 60.19903248030195],
                zoom: 10,
            }),
        });

        // setMapState(map);

        return () => {
            map.dispose();
        };
    }, [geojsonData]);

    // function addVectorLayersToMap() {
    //     if (!mapState || !layerMap) return;

    //     const addedLayerNames = new Set<string>();

    //     Object.entries(layerMap).forEach(([layerName, layer]) => {
    //         if (!addedLayerNames.has(layerName)) {
    //             mapState.addLayer(layer);
    //             addedLayerNames.add(layerName);
    //         }
    //     });
    // }

    // useEffect(() => {
    //     addVectorLayersToMap();
    // }, [mapState]);

    return (
        <div>
            <div ref={mapRef} id="map" />
            <SideBar toggleLayerVisibility={toggleLayerVisibility} />
        </div>
    );
}

export default OLMap;
