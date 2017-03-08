/**
 * Created by fc on 2017/2/8.
 */
$(function () {
    window.viewer = new Cesium.Viewer('cesiumContainer', {
        //animation: false,  //是否显示动画控件
        //timeline: false, //是否显示时间线控件
        baseLayerPicker: false,
        //homeButton:false
        navigationHelpButton: false
    })
    viewer._cesiumWidget._creditContainer.style.display = "none";//描述
    var scene = viewer.scene;
    var canvas = viewer.canvas;
    var clock = viewer.clock;
    var camera = viewer.scene.camera;
    var imageryLayers = viewer.imageryLayers;
    var pointList = []
    var addpolylines = null;
    var entitylines = [];
    var options = {};
    options.defaultResetView = Cesium.Rectangle.fromDegrees(17, 92, 86, 25);//西南东北
    options.enableCompass= false;
    options.enableZoomControls= true;
    options.enableDistanceLegend= true;
    options.enableCompassOuterRing= true;
    viewer.extend(Cesium.viewerCesiumNavigationMixin, options);
    var screenHeat = false;//热力screen
    var heat = false;//reli
    var screenHeat = false;
    var heat = false;
    //try flow  ing...
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    var open;
    var isClustering = false;
    //取消默认的双击事件
    /* viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);*/
    viewer._cesiumWidget._creditContainer.style.display = "none";//描述
    var tms = new Cesium.UrlTemplateImageryProvider({
        url: 'http://192.168.6.203:5060/v1.0/gr?l={z}&x={x}&y={y}',
        /* minimumLevel:5
         maximumLevel:21*/
    });
    //console.log(tms)
    imageryLayers.addImageryProvider(tms);
    var nnjc_1 = new Cesium.UrlTemplateImageryProvider({
        url: 'http://192.168.6.203:5060/v1.0/nnjc_1?l={z}&x={x}&y={y}',
        /* minimumLevel:5
         maximumLevel:21*/
    });
    //console.log(tms)
    imageryLayers.addImageryProvider(nnjc_1);
    var chengdudom = new Cesium.UrlTemplateImageryProvider({
        url: 'http://192.168.6.203:5060/v1.0/chengdu_dom?z={z}&x={x}&y={y}',

    });
    imageryLayers.addImageryProvider(chengdudom);

    imageryLayers.addImageryProvider(nnjc_1);
    var chengdu1 = new Cesium.UrlTemplateImageryProvider({
        url: 'http://192.168.6.203:5060/v1.0/cdjc1?z={z}&x={x}&y={y}',

    });
    imageryLayers.addImageryProvider(chengdu1);
    getPosition();
    function getPosition() {
        var coordWrap = document.getElementById('coords')
        //console.log(coordWrap.innerHTML)
        //得到当前三维场景
        var scene = viewer.scene;
        //得到当前三维场景的椭球体
        var ellipsoid = scene.globe.ellipsoid;
        var entity = viewer.entities.add({
            label: {
                show: false,
                font: '20px sans-serif',
            }
        });
        var longitudeString = null;
        var latitudeString = null;
        var height = null;
        var cartesian = null;
        // 定义当前场景的画布元素的事件处理
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        //设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
        handler.setInputAction(function (movement) {
            //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
            cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
            if (cartesian) {
                //将笛卡尔坐标转换为地理坐标(弧度)
                var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                //console.log(cartographic)movement.endPosition
                //将弧度转为度的十进制度表示
                longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                //获取相机高度
                height = Math.ceil(viewer.camera.positionCartographic.height);
                entity.position = cartesian;
                //entity.label.show = true;
                entity.label.text = '(' + longitudeString + ', ' + latitudeString + "," + height + ')';
                coordWrap.innerHTML = '(' + longitudeString + ', ' + latitudeString + "," + height + ')';
            } else {
                entity.label.show = false;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
        handler.setInputAction(function (wheelment) {
            height = Math.ceil(viewer.camera.positionCartographic.height);
            entity.position = cartesian;
            // entity.label.show = true;
            entity.label.text = '(' + longitudeString + ', ' + latitudeString + "," + height + ')';
        }, Cesium.ScreenSpaceEventType.WHEEL);
    }
    start();//drawview
    var script = document.createElement('script');
    script.src = './js/draw.js';
    document.body.appendChild(script);
})