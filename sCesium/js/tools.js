/**
 * Created by fc on 2017/2/8.
 */
function addMarker() {
    var marker = viewer.entities.add({
        name: 'Citizens Bank Park',
        position: Cesium.Cartesian3.fromDegrees(-75.166493, 39.9060534),
        /*  billboard : {
         image : 'http://localhost:81/images/2015/02-02/Philadelphia_Phillies.png',
         width : 64,
         height : 64
         },*///点可以换成图片
        point: {
            pixelSize: 5,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            show: true
        },
        label: {
            text: '我是一个点',
            font: '14pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
            //horizontal : Cesium.VerticalOrigin.Left
        }
    });
    console.log(marker)
    viewer.zoomTo(marker);
}
function addLine() {
    addpolylines = new Cesium.PolylineCollection();
    var p = addpolylines.add({
        show: true,
        positions: Cesium.Cartesian3.fromDegreesArray([
            -73.10, 37.57,
            -75.02, 36.53,
            -78.50, 33.14,
            -78.12, 23.46]),
        width: 4,
        material: Cesium.Color.RED
    });
    var p2 = addpolylines.add({
        show: true,
        positions: Cesium.Cartesian3.fromDegreesArray([
            -71.10, 37.57,
            -73.02, 36.53,
            -79.50, 33.14,
            -79.12, 23.46]),
        width: 2,
    });
    redLine = viewer.entities.add({
        name: 'Red line on the surface',
        polyline: p
    })
    defaultLine = viewer.entities.add({
        name: 'default',
        polyline: p2
    })

    entitylines.push(redLine)
    entitylines.push(defaultLine)
}
//删除线
function deleteLine() {
    entitylines.forEach(function (item, index) {
        var result = viewer.entities.remove(item)
        console.log(result)
    })
    addpolylines = {}
    entitylines = []
}


function addPolygon() {
    var wyoming = viewer.entities.add({
        name: 'Wyoming',
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
                -109.080842, 45.002073,
                -105.91517, 45.002073,
                -104.058488, 44.996596,
                -104.053011, 43.002989,
                -104.053011, 41.003906,
                -105.728954, 40.998429,
                -107.919731, 41.003906,
                -109.04798, 40.998429,
                -111.047063, 40.998429,
                -111.047063, 42.000709,
                -111.047063, 44.476286,
                -111.05254, 45.002073,
            ]),
            material: Cesium.Color.RED.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            height: 1000,
        }
    });
    console.log(wyoming)
    viewer.zoomTo(wyoming);
}

function addCircle() {
    var greenCircle = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-111.0, 40.0, 150000.0),
        name: 'Green circle at height',
        ellipse: {
            semiMinorAxis: 300000.0,
            semiMajorAxis: 300000.0,
            height: 200000.0,
            material: Cesium.Color.GREEN.withAlpha(0.54)
        }
    });
    console.log(greenCircle);
    viewer.zoomTo(greenCircle)
}

function add3D() {
    var entity = viewer.entities.add({
        id: 'flight1',
        name: '一架飞机',
        position: Cesium.Cartesian3.fromDegrees(103.9613147, 30.56622611, 495.3),
        model: {
            uri: './models/A320/A320H.glb'
        }
    });
    viewer.zoomTo(entity);
    viewer.trackedEntity = entity;
}


function addBillboard() {
    viewer.entities.add({
        name: '广告牌',
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
            image: './img/Cesium_Logo_overlay.png'
        }
    });
}

function setBillboardProperties() {
    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
            image: './img/Cesium_Logo_overlay.png', // default: undefined
            show: true, // default
            pixelOffset: new Cesium.Cartesian2(0, -50), // default: (0, 0)
            eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
            scale: 2.0, // default: 1.0
            color: Cesium.Color.LIME, // default: WHITE
            rotation: Cesium.Math.PI_OVER_FOUR, // default: 0.0
            alignedAxis: Cesium.Cartesian3.ZERO, // default
            width: 100, // default: undefined
            height: 25 // default: undefined
        }
    });
}
function addLabel() {
    //Sandcastle.declare(addLabel)
    var entity = viewer.entities.add({
        name: '标签',
        id: '001',
        position: Cesium.Cartesian3.fromDegrees(-75.1641667, 39.9522222),
        label: {
            text: '这是一个Label',
            fillColor: Cesium.Color.WHITESMOKE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            font: '16px sans-serif',
        }
    });
    entity.label.showBackground = true;
}
function offsetByDistance() {
    var image = new Image();
    image.onload = function () {
        var localLabel = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(-75.1641667, 139.9522222),
            billboard: {
                position: Cesium.Cartesian3.fromDegrees(-75.1641667, 139.9522222),
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 5.0, 1.5e7, 0.5),
                image: image
            },
            label: {
                text: 'Label on top of scaling billboard',
                font: '20px sans-serif',
                showBackground: true,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                pixelOffset: new Cesium.Cartesian2(0.0, -image.height),
                pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.5e2, 3.0, 1.5e7, 0.5)
            }
        })
        viewer.zoomTo(localLabel)
    };
    image.src = './img/facility.gif';

}

function measure() {
    isMeasure = true;
    isPolyline = false;
    isPolygon_line = false;
    isPolygon_fill = false;
    if (isMeasure) {
        var dis;
        var measurePoint = [];
        var start = [];
        var end = [];
        var r = 6371009
        //得到当前三维场景
        var scene = viewer.scene;
        //得到当前三维场景的椭球体
        var ellipsoid = scene.globe.ellipsoid;
        var longitudeString = null;
        var latitudeString = null;
        var cartesian = null;
        // 定义当前场景的画布元素的事件处理
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        //设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
        handler.setInputAction(function (click) {
            console.log(measurePoint);
            event.stopPropagation();
            //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
            cartesian = viewer.camera.pickEllipsoid(click.position, ellipsoid);
            if (cartesian) {
                //将笛卡尔坐标转换为地理坐标
                var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                //console.log(cartographic)
                //将弧度转为度的十进制度表示
                longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                if (measurePoint.length < 2) {
                    if (start.length < 1) {
                        start.push(longitudeString);
                        start.push(latitudeString);
                        measurePoint.push(start)
                    } else if (end.length < 1) {
                        end.push(longitudeString);
                        end.push(latitudeString);
                        measurePoint.push(end);
                        var measureLine = viewer.entities.add({
                            name: 'Red line on the surface',
                            polyline: {
                                positions: Cesium.Cartesian3.fromDegreesArray([measurePoint[0][0], measurePoint[0][1],
                                    measurePoint[1][0], measurePoint[1][1]]),
                                width: 1,
                                material: Cesium.Color.YELLOW
                            }
                        });
                        //转成弧度
                        setTimeout(showdis, 800)
                        function showdis() {
                            var prevLat = Cesium.Math.toRadians(start[1]);
                            var prevLng = Cesium.Math.toRadians(start[0]);
                            var nextLat = Cesium.Math.toRadians(end[1]);
                            var nextLng = Cesium.Math.toRadians(end[0]);

                            var dis = r * distanceRadians(nextLat, nextLng, prevLat, prevLng);


                            // alert(Math.round(dis).toFixed(2)+'m');
                            viewer.entities.add({
                                name: 'distance',
                                //id:'002',
                                position: Cesium.Cartesian3.fromDegrees(end[0], end[1]),
                                label: {
                                    text: dis.toFixed(2) + 'm',
                                    fillColor: Cesium.Color.RED,
                                    outlineColor: Cesium.Color.BLACK,
                                    outlineWidth: 2,
                                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                    font: '16px sans-serif',
                                    pixelOffset: new Cesium.Cartesian2(0, 9)
                                }
                            })
                        }

                        /**
                         * Returns distance on the unit sphere; the arguments are in radians.
                         */
                        function distanceRadians(lat1, lng1, lat2, lng2) {
                            return arcHav(havDistance(lat1, lat2, lng1 - lng2));
                        }

                        function arcHav(x) {
                            //arcsin反正弦
                            return 2 * Math.asin(Math.sqrt(x));
                        }

                        function havDistance(lat1, lat2, dLng) {
                            return hav(lat1 - lat2) + hav(dLng) * Math.cos(lat1) * Math.cos(lat2);
                        }

                        function hav(x) {
                            var sinHalf = Math.sin(x * 0.5);
                            return sinHalf * sinHalf;
                        }
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    }

    handler.setInputAction(function () {
        if (isMeasure) {
            measurePoint = [];
            start = [];
            end = [];
        }
        isMeasure = false;

    }, Cesium.ScreenSpaceEventType.RIGHT_DOWN)
}

function setView() {
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(117, 32.71, 31909931)
    });
}
function trackFlight() {
    //Set the random number seed for consistent results.
    Cesium.Math.setRandomNumberSeed(3);

    //模拟时间边界开始结束
    var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));//2015 3月 25日 8时
    var stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());

    //Make sure viewer is at the desired time.
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
    viewer.clock.multiplier = 3;//速度控制

    //Set timeline to simulation bounds
    viewer.timeline.zoomTo(start, stop);

    //生成不同高度的随机圆形图案（2个点之间）
    function computeCirclularFlight(lon, lat, radius) {
        var property = new Cesium.SampledPositionProperty();
        for (var i = 0; i <= 360; i += 360) {
            var radians = Cesium.Math.toRadians(i / 8);
            var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
            var position = Cesium.Cartesian3.fromDegrees(lon + (radius * 1.5 * Math.cos(radians)), lat + (radius * Math.sin(radians)), Cesium.Math.nextRandomNumber() * 500 + 1750);
            property.addSample(time, position);

            //Also create a point for each sample we generate.
            viewer.entities.add({
                position: position,
                point: {
                    pixelSize: 8,
                    color: Cesium.Color.TRANSPARENT,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 3
                }
            });
        }
        return property;
    }

    //计算实体位置属性
    var position = computeCirclularFlight(110.110693, 36.0994841, 0.03);
    var entity = viewer.entities.add({
        name: 'A320',
        //Set the entity availability to the same interval as the simulation time.
        availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
            start: start,
            stop: stop
        })]),
        //Use our computed positions
        position: position,
        //Automatically compute orientation based on position movement.
        orientation: new Cesium.VelocityOrientationProperty(position),
        model: {
            uri: './models/A320/A320H.glb',
            minimumPixelSize: 32
        },
        //Show the path as a pink line sampled in 1 second increments.
        path: {
            resolution: 1,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.1,
                color: Cesium.Color.YELLOW
            }),
            width: 10
        }
    });
    viewer.trackedEntity = entity;
}


function addHeat() {
    var div = document.createElement('div');
    div.className = 'test';
    document.body.appendChild(div);
    div.style.width = 500 + 'px';
    div.style.height = 500 + 'px';
    div.style.margin = 0 + ' ' + 'auto';
    div.style.marginTop = 100 + 'px';
    var script = document.createElement('script');
    script.src = './js/test.js';
    document.body.appendChild(script);
    if (screenHeat == false) {
        document.querySelector('.test').style.display = 'block';
    } else {
        document.querySelector('.test').style.display = 'none';
    }
    screenHeat = !screenHeat
}

function addHeat1() {
    var script = document.createElement('script');
    script.src = './js/heat.js';
    document.body.appendChild(script);
    camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(106.18, 30, 6000000),
        duration: 3,
        /*orientation : {
         heading : Cesium.Math.toRadians(45.0),
         pitch : Cesium.Math.toRadians(-35.0),
         roll : 0.0
         },*/
        complete: function () {
        }
    });
    if (false == heat) {
        document.querySelector('#heatDom').style.display = 'block';
    } else {
        /* document.querySelector('.heatmap-canvas').style.display = 'none';*/
        document.querySelector('#heatDom').style.display = 'none';
    }
    heat = !heat
}


/***************czml*********************************/
function movePoint() {
    /* $.ajax({
     type:'get',
     url:'./models/czml.json',
     dataType:"json",
     success:function (data) {
     console.log(data)
     },
     error:function(){
     alert('czml加载不到')
     }
     })*/
    var script = document.createElement('script');
    script.src = './js/czmljs.js';
    document.body.appendChild(script);
}


//加一个矩形
/*
 var redRectangle = viewer.entities.add({
 name : 'Red translucent rectangle with outline',
 rectangle : {
 coordinates : Cesium.Rectangle.fromDegrees(-110.0, 20.0, -100.0, 25.0),
 material : Cesium.Color.RED.withAlpha(0.5),
 outline : true,
 outlineColor : Cesium.Color.RED
 }
 })*/
/*
 var rect1 = new Cesium.Rectangle(-110.0, 20.0, -100.0, 25.0);
 var rect2 = new Cesium.Rectangle(-100.0, 20.0, -90.0, 25.0);
 viewer.entities.add({
 name: 'rectangle',
 rectangle: {
 coordinates: Cesium.Rectangle.fromDegrees(rect1.west, rect1.south, rect1.east, rect1.north),
 material: Cesium.Color.RED.withAlpha(0.5),
 outline: true,
 outlineColor: Cesium.Color.RED
 }
 })
 console.log(Cesium.Rectangle.computeHeight(rect1));//Height
 console.log(Cesium.Rectangle.computeWidth(rect1));//width
 var testPoint = new Cesium.Cartographic(-105, 22, 0);
 console.log(Cesium.Rectangle.contains(rect1, testPoint));//经纬度高度 是否在矩形范围内
 console.log(Cesium.Rectangle.equals(rect1, rect2)); //比较两个矩形是否相等(得是西南东北4个都一致)
 console.log(Cesium.Rectangle.northeast(rect1)); //矩形东北角坐标高度（返回）
 // console.log(Cesium.Rectangle.center(rect1)); //中心？
 */