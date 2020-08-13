
$(function(){

    function initMap(target){

        let osmMap = new Cesium.OpenStreetMapImageryProvider({
            url : 'https://a.tile.openstreetmap.org/'
        })

        let viewer = new Cesium.Viewer(target, {
            homeButton:true,
            animation: false,
            timeline: false,
            infoBox: false,
            selectionIndicator: false,
            baseLayerPicker: true,
            imageryProvider: osmMap,
            terrainProviderViewModels: [],
            geocoder: false,
            vrButton: false,
            navigationHelpButton: false,
            mapProjection: new Cesium.WebMercatorProjection(),
            sceneMode: Cesium.SceneMode.SCENE3D,
        });

        return viewer;
    }

    let viewer = initMap("cesiumContainer");
    viewer.camera.setView({
        destination : Cesium.Cartesian3.fromDegrees(125.10, 24.30, 5000000)
    });
    viewer._cesiumWidget._creditContainer.style.display="none";
    
    let typhoon = new $.typhoon(viewer);
    typhoon.init();

});