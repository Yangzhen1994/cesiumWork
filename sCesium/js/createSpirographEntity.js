/**
 * Created by yz on 2017/2/3.
 */
'use strict';


var options = {};
options.defaultResetView = Cesium.Rectangle.fromDegrees(17, 92, 86, 25);//西南东北
options.enableCompass= false;
options.enableZoomControls= true;
options.enableDistanceLegend= true;
options.enableCompassOuterRing= true;

viewer.extend(Cesium.viewerCesiumNavigationMixin, options);

//2个运动实体
function createSpirographEntity(url, longitude, latitude, height, radiusMedian, radiusSubCircle, durationMedianCircle, durationSubCircle) {
    var centerPosition = Cesium.Cartographic.fromDegrees(longitude, latitude, height);
    var spirographPositionProperty = new Cesium.SpirographPositionProperty(centerPosition, radiusMedian, radiusSubCircle,
        durationMedianCircle, durationSubCircle, viewer.scene.globe.ellipsoid);

    viewer.entities.add({
        name: url,
        description: '运动的模型',
        position: spirographPositionProperty,
       orientation: new Cesium.VelocityOrientationProperty(spirographPositionProperty, viewer.scene.globe.ellipsoid),
        model: {
            uri: url,
            minimumPixelSize: 96
        }
    });
}

/*createSpirographEntity('models/CesiumAir/Cesium_Air.glb', -100, 44, 10000.0,
    Cesium.Math.toRadians(0.5), Cesium.Math.toRadians(2), 1e6, 2e5);
createSpirographEntity('models/CesiumMilkTruck/CesiumMilkTruck.glb', -122, 45, 0,
    Cesium.Math.toRadians(0.1), Cesium.Math.toRadians(1), 5e6, 7e5);*/
