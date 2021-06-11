import React, { useRef, useEffect } from "react";
import { loadModules } from "esri-loader";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

function App({ id }) {
  // create a ref to element to be used as the map's container
  const mapEl = useRef(null);

  // use a side effect to create the map after react has rendered the DOM
  useEffect(
    () => {
      // define the view here so it can be referenced in the clean up function
      let view;
      // the following code is based on this sample:
      // https://developers.arcgis.com/javascript/latest/sample-code/webmap-basic/index.html
      // first lazy-load the esri classes
      loadModules(
        [
          "esri/config",
          "esri/views/MapView",
          "esri/WebMap",
          "esri/Graphic",
          "esri/layers/GraphicsLayer",
          "esri/widgets/Locate",
          "esri/layers/FeatureLayer",
          "esri/widgets/Editor",
          "esri/layers/VectorTileLayer",
        ],
        {
          css: true,
        }
      ).then(
        ([
          esriConfig,
          MapView,
          WebMap,
          Graphic,
          GraphicsLayer,
          Locate,
          FeatureLayer,
          Editor,
          VectorTileLayer,
        ]) => {
          esriConfig.apiKey =
            "AAPKa6a668e2ccbf4634b576c1a0075f317dTKlkORpJDF32ilRtRHPgSJX-kRE4gWSysxdsShXmAejrkXpa9QvIV5R-VEFdskzO";

          const parksAndOpenSpacesLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space_Styled/FeatureServer/0",
          });

          const map = new WebMap({
            basemap: "arcgis-topographic",
          });

          // Define a pop-up for Trailheads
          const popupTrailheads = {
            labelPlacement: "above-center",
            labelExpressionInfo: {
              expression: "$feature.TRL_NAME",
            },
            title: "Trailhead",
            content:
              "<b>Trail:</b> {TRL_NAME}<br><b>City:</b> {CITY_JUR}<br><b>Cross Street:</b> {X_STREET}<br><b>Parking:</b> {PARKING}<br><b>Elevation:</b> {ELEV_FT} ft",
          };

          // const trailheads = new FeatureLayer({
          //   url: "https://services8.arcgis.com/N6JD6KmVaB5v5VxQ/arcgis/rest/services/trailheads/FeatureServer/0",

          //   popupTemplate: popupTrailheads,
          // });

          // Reference a feature layer to edit

          const trailheadsRenderer = {
            type: "simple",
            symbol: {
              type: "picture-marker",
              url: "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
              width: "18px",
              height: "18px",
            },
          };

          const trailheadsLayer = new FeatureLayer({
            url: "https://services8.arcgis.com/N6JD6KmVaB5v5VxQ/arcgis/rest/services/trailheads/FeatureServer/0",

            outFields: [
              "TRL_NAME",
              "CITY_JUR",
              "X_STREET",
              "PARKING",
              "ELEV_FT",
            ],
            renderer: trailheadsRenderer,
            popupTemplate: popupTrailheads,
          });

          // map.add(trailheads);
          map.add(trailheadsLayer, 0);
          // map.add(parksAndOpenSpacesLayer, 1);

          const view = new MapView({
            map: map,
            center: [-118.7515267, 34.11305718], // Longitude, latitude

            zoom: 9, // Zoom level

            container: mapEl.current,
          });
          const graphicsLayer = new GraphicsLayer();
          map.add(graphicsLayer);

          const point = {
            //Create a point
            type: "point",
            longitude: 67.001137,
            latitude: 24.860735,
          };
          const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [255, 0, 0], // Red
            outline: {
              color: [255, 255, 255], // White
              width: 1,
            },
          };

          const polyline = {
            type: "polyline",
            paths: [
              [67.021137, 24.830735], //Longitude, latitude
              [67.031137, 24.840735], //Longitude, latitude
              [67.041137, 24.850735], //Longitude, latitude
            ],
          };
          const simpleLineSymbol = {
            type: "simple-line",
            color: [255, 0, 0], // Red
            width: 2,
          };

          const polylineGraphic = new Graphic({
            geometry: polyline,
            symbol: simpleLineSymbol,
          });
          graphicsLayer.add(polylineGraphic);

          const pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol,
          });
          graphicsLayer.add(pointGraphic);

          // Create a polygon geometry
          const polygon = {
            type: "polygon",
            rings: [
              [67.021637, 24.830735], //Longitude, latitude
              [67.031937, 24.840735], //Longitude, latitude
              [67.099137, 24.790735], //Longitude, latitude
              [67.051137, 24.801115], //Longitude, latitude
            ],
          };

          const simpleFillSymbol = {
            type: "simple-fill",
            color: [0, 0, 255, 0.6], // blue
            outline: {
              color: [255, 255, 255],
              width: 1,
            },
          };

          // Attributes

          const popupTemplate = {
            title: "{Name}",
            content: "{Description}",
          };
          const attributes = {
            Name: "Graphic",
            Description: "I am a polygon",
          };

          const polygonGraphic = new Graphic({
            geometry: polygon,
            symbol: simpleFillSymbol,
            attributes: attributes,
            popupTemplate: popupTemplate,
          });
          graphicsLayer.add(polygonGraphic);

          const locate = new Locate({
            view: view,
            useHeadingEnabled: false,
            goToOverride: function (view, options) {
              options.target.scale = 1500;
              return view.goTo(options.target);
            },
          });
          view.ui.add(locate, "top-left");

          // Edit
          // Editor widget
          const editor = new Editor({
            view: view,
          });
          // Add widget to the view
          view.ui.add(editor, "top-right");

          // vector tile

          // const vtlLayer = new VectorTileLayer({
          //   url: "https://vectortileservices3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_Mountains_Parcels_VTL/VectorTileServer/",
          // });

          // map.add(vtlLayer);
          // end
        }
      );

      return () => {
        // clean up the map view
        if (!!view) {
          view.destroy();
          view = null;
        }
      };
    },
    // only re-load the map if the id has changed
    [id]
  );
  return <div style={{ height: "100vh" }} ref={mapEl} />;
}

ReactDOM.render(
  <React.StrictMode>
    <App id="e691172598f04ea8881cd2a4adaa45ba" />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
