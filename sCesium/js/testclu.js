/**
 * Created by yz on 2017/2/7.
 */
//数据源加载
/*
 dataSourcePromise = viewer.dataSources.add(Cesium.GeoJsonDataSource.load(point_merge));
*/
function openClustering() {
    isClustering = !isClustering;
    isClustering == false?document.getElementById('toolbarR').style.display = 'none':document.getElementById('toolbarR').style.display = 'block';
    dataSourcePromise.then(function(dataSource) {
        var pixelRange = 30;
        var minimumClusterSize = 3;
        var enabled = isClustering;

        dataSource.clustering.enabled = enabled;
        dataSource.clustering.pixelRange = pixelRange;
        dataSource.clustering.minimumClusterSize = minimumClusterSize;

        var removeListener;
        //PinBuilder生成自定义地图图钉作为画布元素的实用程序类。生成地图的图钉
        var pinBuilder = new Cesium.PinBuilder();
        var pin50 = pinBuilder.fromText('50+', Cesium.Color.RED, 48).toDataURL();
        var pin40 = pinBuilder.fromText('40+', Cesium.Color.ORANGE, 48).toDataURL();
        var pin30 = pinBuilder.fromText('30+', Cesium.Color.YELLOW, 48).toDataURL();
        var pin20 = pinBuilder.fromText('20+', Cesium.Color.GREEN, 48).toDataURL();
        var pin10 = pinBuilder.fromText('10+', Cesium.Color.BLUE, 48).toDataURL();

        var singleDigitPins = new Array(8);
        for (var i = 0; i < singleDigitPins.length; ++i) {
            singleDigitPins[i] = pinBuilder.fromText('' + (i + 2), Cesium.Color.VIOLET, 48).toDataURL();
        }

        function customStyle() {
            if (Cesium.defined(removeListener)) {
                removeListener();
                removeListener = undefined;
            } else {
                removeListener = dataSource.clustering.clusterEvent.addEventListener(function(clusteredEntities, cluster) {
                    cluster.label.show = false;
                    cluster.billboard.show = true;
                    cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
                    // 个数不同标牌的图片不同
                    if (clusteredEntities.length >= 50) {
                        cluster.billboard.image = pin50;
                    } else if (clusteredEntities.length >= 40) {
                        cluster.billboard.image = pin40;
                    } else if (clusteredEntities.length >= 30) {
                        cluster.billboard.image = pin30;
                    } else if (clusteredEntities.length >= 20) {
                        cluster.billboard.image = pin20;
                    } else if (clusteredEntities.length >= 10) {
                        cluster.billboard.image = pin10;
                    } else {
                        cluster.billboard.image = singleDigitPins[clusteredEntities.length - 2];
                    }
                });
            }

            // force a re-cluster with the new styling
            var pixelRange = dataSource.clustering.pixelRange;
            dataSource.clustering.pixelRange = 0;
            dataSource.clustering.pixelRange = pixelRange;
        }

        // start with custom style
        customStyle();

        var viewModel = {
            pixelRange: pixelRange,
            minimumClusterSize: minimumClusterSize
        };
        Cesium.knockout.track(viewModel);

        var toolbar = document.getElementById('toolbarR');
        //绑定方法实现数据绑定 cesium里面封装了一个小的knockout  所以不需要在引入knockout的js类库
        Cesium.knockout.applyBindings(viewModel, toolbar);

        function subscribeParameter(name) {
            Cesium.knockout.getObservable(viewModel, name).subscribe(
                function(newValue) {
                    dataSource.clustering[name] = newValue;
                }
            );
        }

        subscribeParameter('pixelRange');
        subscribeParameter('minimumClusterSize');

        Sandcastle.addToggleButton('聚合', true, function(checked) {
            dataSource.clustering.enabled = checked;
        });

       /* Sandcastle.addToggleButton('Custom Styling', true, function(checked) {
            customStyle();
        });*/

        /*var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
         handler.setInputAction(function(movement) {
         var pickedLabel = viewer.scene.pick(movement.position);
         console.log(pickedLabel)
         if (Cesium.defined(pickedLabel)) {
         var ids = pickedLabel.id;
         if (Cesium.isArray(ids)) {
         for (var i = 0; i < ids.length; ++i) {
         ids[i].label.fillColor = Cesium.Color.RED;
         }
         }
         }
         }, Cesium.ScreenSpaceEventType.LEFT_CLICK);*/
    });
}



