//摄像机默认放缩值
/*var viewer = new Cesium.Viewer('cesiumContainer', {
    animation: false,  //是否显示动画控件
    timeline: false, //是否显示时间线控件
});*/
viewer._cesiumWidget._creditContainer.style.display = "none";//描述



//布尔型变量
var isPoint = false;
var isPolyline = false;
var isPolygon_line = false;
var isPolygon_fill = false;

//是否开始绘制标识
var isStartDraw = false;
var isclear = false;
var isMeasure = false;
var points = entities.add(new Cesium.Entity());

var polylines = entities.add(new Cesium.Entity());
var Polygons_Line = entities.add(new Cesium.Entity());
var Polygons_fill = entities.add(new Cesium.Entity());

//画多边形过程中展示的线最后要移除或者不显示
var Polygon_Lines_remove = entities.add(new Cesium.Entity());

var ellipsoid = scene.globe.ellipsoid;
canvas.onclick = function () {
    canvas.focus();
};
var handler = new Cesium.ScreenSpaceEventHandler(canvas);
viewer.zoomTo(viewer.entities);

defaultZoomAmount_ = 3000000.0;
var lastPointLon = -999.0;
var lastPointLat = -999.0;
var firstPointLon = -999.0;
var firstPointLat = -999.0;

var PolygonPointArray_line = null;
var PolygonPointArray_fill = null;

//鼠标移动时的那条线
var moveLine_first = viewer.entities.add({
    id: "moveLine_first",
    name: 'line on the surface',
    polyline: {
        show: false,
        width: 2,
        material: Cesium.Color.WHITE
        // material: Cesium.Color.BLUE
//                material: Cesium.Material.fromType('Dot', {
//                    lightColor: Cesium.Color.BLUE,
//                    darkColor: Cesium.Color.WHITE,
//                    repeat: 10
//                })
    }
});

var moveLine_second = viewer.entities.add({
    id: "moveLine_second",
    name: 'line on the surface',
    polyline: {
        show: false,
        width: 2,
        material: Cesium.Color.WHITE
        // material: Cesium.Color.BLUE
//                material: Cesium.Material.fromType('Dot', {
//                    lightColor: Cesium.Color.BLUE,
//                    darkColor: Cesium.Color.WHITE,
//                    repeat: 10
//                })
    }
});


//鼠标移动时做的操作
handler.setInputAction(function (movement) {
    if (isPolyline || isPolygon_line || isPolygon_fill ) {
        var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
        if (cartesian && isStartDraw) {
            //做清除工作把全局变量moveLine清除掉了 ，需要重新加到entities上 否则显示不正常
            if (isclear) {
                viewer.entities.add(moveLine_first);
                viewer.entities.add(moveLine_second);
                isclear = false;
            }
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var curMovementLon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
            var curMovementLat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
                viewer.entities.getById("moveLine_first").polyline.positions = Cesium.Cartesian3.fromDegreesArray([lastPointLon, lastPointLat, curMovementLon, curMovementLat]);//修改属性
                viewer.entities.getById("moveLine_first").polyline.show = true;
                if (PolygonPointArray_line != null) {
                    if (PolygonPointArray_line.length >= 3) {
                        viewer.entities.getById("moveLine_second").polyline.positions = Cesium.Cartesian3.fromDegreesArray([curMovementLon, curMovementLat, firstPointLon, firstPointLat]);//修改属性
                        viewer.entities.getById("moveLine_second").polyline.show = true;
                    }
                }
                if (PolygonPointArray_fill != null) {
                    //画多边形或面时当点大于等于三个
                    if (PolygonPointArray_fill.length >= 3) {
                        viewer.entities.getById("moveLine_second").polyline.positions = Cesium.Cartesian3.fromDegreesArray([curMovementLon, curMovementLat, firstPointLon, firstPointLat]);//修改属性
                        viewer.entities.getById("moveLine_second").polyline.show = true;
                    }
                }
        }
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

//鼠标左击做的操作
handler.setInputAction(function (click) {
    if (isPoint || isPolyline || isPolygon_line || isPolygon_fill || isMeasure) {
        var cartesian = viewer.camera.pickEllipsoid(click.position, scene.globe.ellipsoid);
        //console.log(cartesian)
        if (cartesian) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var currentClickLon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
            var currentClickLat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
            if (!isStartDraw) {
                var p1 = viewer.entities.add({
                    position: cartesian,
                    point: {
                        parent: points,
                        pixelSize: 3,
                        color: Cesium.Color.YELLOW
                    }
                });
                firstPointLon = currentClickLon;
                firstPointLat = currentClickLat;
                PolygonPointArray_line = null;
                PolygonPointArray_fill = null;
                isStartDraw = true;
                pointList.push(p1)
            } else {
                if (isPoint) {
                    var p2 = viewer.entities.add({
                        position: cartesian,
                        point: {
                            parent: points,
                            pixelSize: 3,
                            color: Cesium.Color.YELLOW
                        }
                    });
                    pointList.push(p2);
                    //juhe()
                    //console.log(pointList)
                }
                if (isPolyline || isPolygon_line || isPolygon_fill) {
                    viewer.entities.add({
                        name: 'line on the surface',
                        parent: polylines,
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArray([lastPointLon, lastPointLat, currentClickLon, currentClickLat]),
                            width: 2,
                            material: Cesium.Color.BLUE
                        }
                    });
                    viewer.entities.getById("moveLine_first").polyline.show = false;
                    viewer.entities.getById("moveLine_second").polyline.show = false;
                }
            }
            //记录鼠标点击的当前位置 作为下一次画线的起始点位置
            lastPointLon = currentClickLon;
            lastPointLat = currentClickLat;

            if (isPolygon_line) {
                if (PolygonPointArray_line == null)
                    PolygonPointArray_line = new Array();
                PolygonPointArray_line.push(currentClickLon);
                PolygonPointArray_line.push(currentClickLat);
            }
            if (isPolygon_fill) {
                if (PolygonPointArray_fill == null)
                    PolygonPointArray_fill = new Array();
                PolygonPointArray_fill.push(currentClickLon);
                PolygonPointArray_fill.push(currentClickLat);
            }
        }
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//鼠标Y右键键点击时做的操作
handler.setInputAction(function (click) {
    if (isPolyline || isPolygon_line || isPolygon_fill) {
        var cartesian = viewer.camera.pickEllipsoid(click.position, scene.globe.ellipsoid);
        if (cartesian && isStartDraw) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var endPointLon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
            var endPointLat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
            if (isPolyline || isPolygon_line || isPolygon_fill) {
                //画末线段
                viewer.entities.add({
                    name: 'line on the surface',
                    parent: polylines,
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArray([lastPointLon, lastPointLat, endPointLon, endPointLat]),
                        width: 2,
                        material: Cesium.Color.BLUE
                    }
                });

                if ( isPolygon_line || isPolygon_fill){
                    viewer.entities.add({
                        name: 'line on the surface',
                        parent: polylines,
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArray([endPointLon, endPointLat, firstPointLon, firstPointLat]),
                            width: 2,
                            material: Cesium.Color.BLUE
                        }
                    });
                    viewer.entities.getById("moveLine_second").polyline.show = false;
                }
                viewer.entities.getById("moveLine_first").polyline.show = false;
            }
            //画多边形 不带填充
            if (isPolygon_line) {
                if (PolygonPointArray_line != null) {
                    PolygonPointArray_line.push(endPointLon);
                    PolygonPointArray_line.push(endPointLat);
                }
                //当多边形数组中点的个数大于等于3时添加多边形
                if (PolygonPointArray_line.length >= 3) {
                    viewer.entities.add({
                        name: 'polygon on surface',
                        polygon: {
                            hierarchy: Cesium.Cartesian3.fromDegreesArray(PolygonPointArray_line),
                            material: Cesium.Color.BLUE,
                            fill: false,  //不显示填充
                            outline: true,
                            outlineWidth: 3.0,
                            outlineColor: Cesium.Color.BLUE

                        }
                    });
                }
                PolygonPointArray_line = null;
                viewer.entities.getById("moveLine_first").polyline.show = false;
                viewer.entities.getById("moveLine_second").polyline.show = false;
            }
            //画面 多边形带填充
            if (isPolygon_fill) {
                if (PolygonPointArray_fill != null) {
                    PolygonPointArray_fill.push(endPointLon);
                    PolygonPointArray_fill.push(endPointLat);
                }
                //当面中点的个数大于等于3时添加面
                if (PolygonPointArray_fill.length >= 3) {
                    viewer.entities.add({
                        name: ' polygon on surface',
                        polygon: {
                            hierarchy: Cesium.Cartesian3.fromDegreesArray(PolygonPointArray_fill),
                            material: Cesium.Color.BLUE.withAlpha(0.5),
                            fill: true,  //不显示填充
                            outline: false
                        }
                    });
                }
                PolygonPointArray_fill = null;
                viewer.entities.getById("moveLine_first").polyline.show = false;
                viewer.entities.getById("moveLine_second").polyline.show = false;
            }
            isStartDraw = false;
        }
    }
}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
//放大
function zoomIn() {
    camera.zoomIn(defaultZoomAmount_);
}
//缩小
function zoomOut() {
    camera.zoomOut(defaultZoomAmount_);
}

//漫游
function fly(){
camera.flyTo({
    destination : Cesium.Cartesian3.fromDegrees(110.11,34.6, 7400000),
    duration:3,
    /*orientation : {
        heading : Cesium.Math.toRadians(45.0),
        pitch : Cesium.Math.toRadians(-35.0),
        roll : 0.0
    },*/
    complete:function () {
        //fly之后加载

        var optionsClu = {
            markerSymbol:'M',
            markerSize:1,//设置大小是0 不显示默认图钉样式之前可以 但是 不行了 改成一
            markerColor: Cesium.Color.BLACK
        };
        dataSourcePoint = Cesium.GeoJsonDataSource.load(point_merge,optionsClu);
        dataSourcePromise = viewer.dataSources.add(dataSourcePoint);
        dataSourcePromiseline = viewer.dataSources.add(Cesium.GeoJsonDataSource.load(line_merge));
        dataSourcePromisepoly = viewer.dataSources.add(Cesium.GeoJsonDataSource.load(poly_merge));
        //加在数据源之后 对应的点
        dataSourcePromise.then(function (ds) {
            var tempCoordinate = [];
            point_merge.features.forEach(function (item,index) {
                tempCoordinate = item.geometry.coordinates;
                ds.entities.add({
                    name: item.properties.pointname,
                    position: Cesium.Cartesian3.fromDegrees(tempCoordinate[0], tempCoordinate[1]),
                    point: {
                        pixelSize: 5,
                        color: Cesium.Color.BLUE,
                        outlineColor: Cesium.Color.BLACK,
                        outline:false,
                        show: true,
                        height: 13000,
                        material: Cesium.Color.DEEPSKYBLUE.withAlpha(0.3),
                    }
                })
            })
        });
    }
});
}

function clearAllPan() {
    viewer.entities.removeAll();
    isStartDraw = false;
    isPoint = false;
    isPolyline = false;
    isPolygon_line = false;
    isPolygon_fill = false;
    isclear = true;
}


//加点
function addPoint() {
    isPoint = true;
    isPolyline = false;
    isPolygon_line = false;
    isPolygon_fill = false;
    isStartDraw = false;
    isMeasure = false
}

//加线
function addPolyline() {
    isPoint = false;
    isPolyline = true;
    isPolygon_line = false;
    isPolygon_fill = false;
    isStartDraw = false;
    isMeasure = false
}

//加多边形不带填充
function addPolygon_line() {
    isPoint = false;
    isPolyline = false;
    isPolygon_line = true;
    isPolygon_fill = false;
    isStartDraw = false;
    isMeasure = false
}

function addPolygon_fill() {
    isPoint = false;
    isPolyline = false;
    isPolygon_line = false;
    isPolygon_fill = true;
    isStartDraw = false;
    isMeasure = false
}




