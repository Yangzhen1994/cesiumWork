/**
 * Created by yz on 2017/2/6.
 */
/*var testData = {
    max: 8,
    data: [{lat: 24.6408, lng:46.7728, count: 3},{lat: 50.75, lng:-1.55, count: 1},
        {lat: 25.6408, lng:46.7728, count: 3},{lat: 26.6408, lng:46.7728, count: 3},{lat:26, lng:108.6408, count: 6},
        {lat:35, lng:117, count: 3},]
};*/
//随机100个点
var len = 100;
var moniPoints = []
while (len--) {
    max = 8;
    var point = {
        lat: Math.floor(Math.random()*20+20),
        lng: Math.floor(Math.random()*77+45),
    };
    moniPoints.push(point);
}
// heatmap data format
var data = {
    max: max,
    data: moniPoints
};
var baseLayer = L.tileLayer(
    'http://192.168.6.203:5060/v1.0/gr?l={z}&x={x}&y={y}',{
        attribution: '热力模拟',
        maxZoom:21
    }
);

var cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 2,
    "maxOpacity": .8,
    // scales the radius based on map zoom
    "scaleRadius": true,
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": true,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    valueField: 'count'
};


var heatmapLayer = new HeatmapOverlay(cfg);

map = new L.Map('heatDom', {
    center: new L.LatLng(26,108.6408),
    zoom: 4,
    layers: [baseLayer, heatmapLayer]
});

handler.setInputAction(function (click) {
    open = true;
    //拖动地球热力走
    handler.setInputAction(function (movement) {
        if (open && map) {
            //console.log(movement.position)
            var cartesianflow = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
            if (cartesianflow) {
                //将笛卡尔坐标转换为地理坐标(弧度)
                var cartographic = ellipsoid.cartesianToCartographic(cartesianflow);
                //console.log(cartographic)movement.endPosition
                //将弧度转为度的十进制度表示
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                map.setView([latitudeString, longitudeString])
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
handler.setInputAction(function () {
    open = false
}, Cesium.ScreenSpaceEventType.LEFT_UP)

//拖动map
var smallOPen;
map.on('mousedown',function () {
    smallOPen = true;
        map.on('mousemove',function (e) {
            if(smallOPen){
                console.log(e)
                camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(e.latlng.lng,e.latlng.lat, 6000000),
                    duration:0.8,
                    /*orientation : {
                     heading : Cesium.Math.toRadians(45.0),
                     pitch : Cesium.Math.toRadians(-35.0),
                     roll : 0.0
                     },*/
                    complete:function () {

                    }
                });
            }
        })
});
map.on('mouseup',function () {
    smallOPen = false;
});

/*var beforeZoom = map.getZoom();
map.on('zoomend',function () {
    var nowZoom = map.getZoom();
    nowZoom>beforeZoom?camera.zoomIn(camera.defaultZoomAmount*nowZoom):camera.zoomOut(camera.defaultZoomAmount*nowZoom);
    beforeZoom = nowZoom;
})*/


heatmapLayer.setData(data);


handler.setInputAction(function (click) {
    open = true;
    //拖动地球热力走
    handler.setInputAction(function (movement) {
        if (open && map) {
            //console.log(movement.position)
            var cartesianflow = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
            if (cartesianflow) {
                //将笛卡尔坐标转换为地理坐标(弧度)
                var cartographic = ellipsoid.cartesianToCartographic(cartesianflow);
                //console.log(cartographic)movement.endPosition
                //将弧度转为度的十进制度表示
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                map.setView([latitudeString, longitudeString])
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
handler.setInputAction(function () {
    open = false
}, Cesium.ScreenSpaceEventType.LEFT_UP)
// try  wheel conrol zomm(cesium滚轮滑动没有上下使用的是浏览器的滚轮事件)
document.onmousewheel = fn
function fn(ev) {
    var e = ev || event;
    var flag = '';
    if (e.wheelDelta) {
        flag = e.wheelDelta > 0 ? "up" : "down";
    } else if (e.detail) {
        flag = e.detail > 0 ? "down" : "up";
    }
    if (map) {
        switch (flag) {
            case "up":
                var nowZoomup = map.getZoom();
                map.setZoom(nowZoomup + 2);
                break;
            case "down":
                var nowZoomdown = map.getZoom();
                map.setZoom(nowZoomdown - 2);
                break;
        }
    }
}