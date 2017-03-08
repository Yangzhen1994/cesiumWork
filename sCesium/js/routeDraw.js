var polylinespoint = [];
var addroutepolylines = {};
var isRoute = false;

function addRoute() {
    if(isRoute) {
        $.each(polylinespoint, function(index, item) {
            viewer.entities.remove(item)
        });
        polylinespoint = [];
        addroutepolylines = {};
        isRoute = false;
        return;
    }
    addroutepolylines = new Cesium.PolylineCollection();
    $.each(poly_merge.features, function(index, item) {
        createRoute(item);
    });
    $.each(line_merge.features, function(index, item) {
        createRouteLine(item);
    });
   /* $.each(point_merge.features, function(index, item) {
        createRoutePoint(item);
    });*/
    isRoute = true;
}
var arr = [];
//航路
function createRoute(item) {
    arr = [];
    $.each(item.geometry.coordinates[0][0], function(index, items) {
        arr.push(items[0]);
        arr.push(items[1]);
    });
    var saftyheigh = item.properties.saftyheigh;
    if(saftyheigh > 13000) {
        saftyheigh = 2000;
    }
    var addroute = viewer.entities.add({
        name: '航路名称：' + item.properties.name,
        description: '<!--HTML-->起点：' + item.properties.startpoint + '\r\n终点：' + item.properties.endpoint + '\r\n安全高度：' + item.properties.saftyheigh + '\r\n距离：' + item.properties.seglength,
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(arr),
            material: Cesium.Color.LIGHTSKYBLUE.withAlpha(0.3),
            outline: true,
            outlineColor: Cesium.Color.DEEPSKYBLUE,
            outlineWidth: 2,
            height: saftyheigh,
            extrudedHeight: 13000 //设置拉伸高度
        }
    });
    polylinespoint.push(addroute);
    //viewer.zoomTo(wyoming);
}

//航线
function createRouteLine(item) {
    arr = [];
    $.each(item.geometry.coordinates[0], function(index, items) {
        arr.push(items[0]);
        arr.push(items[1]);
    });
    var heights = item.properties.height;
    if(heights > 13000) {
        heights = 2000;
    }
    var descriptions = "";
    if(item.properties.cta) {
        descriptions = '管制区：' + item.properties.cta;
    }
    if(item.properties.fir) {
        descriptions += '情报区：' + item.properties.fir;
    }
    if(item.properties.code) {
        descriptions += '扇区区：' + item.properties.code;
    }
    if(item.properties.TERM_LINE) {
        descriptions += '进近区：' + item.properties.TERM_LINE;
    }
    if(item.properties.length) {
        descriptions += '距离：' + item.properties.length;
    }
    if(item.properties.height) {
        descriptions += '高度：' + item.properties.height;
    }

    var addLine = viewer.entities.add({
        name: '名称：' + item.properties.name,
        description: descriptions,
        polyline: {
            show: true,
            positions: Cesium.Cartesian3.fromDegreesArray(arr),
            width: 2,
            material: Cesium.Color.DEEPSKYBLUE.withAlpha(0.3),
            height: heights,
        }
    });
    polylinespoint.push(addLine);
}

//航路点
function createRoutePoint(item) {
    var marker = viewer.entities.add({
        name: '航路点：' + item.properties.pointname,
        position: Cesium.Cartesian3.fromDegrees(item.geometry.coordinates[0], item.geometry.coordinates[1], 13000),
        /*  billboard : {
         image : 'http://localhost:81/images/2015/02-02/Philadelphia_Phillies.png',
         width : 64,
         height : 64
         },*/ //点可以换成图片
        point: {
            pixelSize: 5,
            color: Cesium.Color.BLUE,
            outlineColor: Cesium.Color.BLACK,
            outline:false,
            show: true,
            height: 13000,
            material: Cesium.Color.DEEPSKYBLUE.withAlpha(0.3),
        },
        label: {
            text: item.properties.pointname,
            font: '12pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            color: Cesium.Color.BLACK,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
            height: 13000
        }
    });
    polylinespoint.push(marker);
}