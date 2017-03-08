/**
 * Created by yz on 2017/2/6.
 */
// minimal heatmap instance configuration
var heatmapInstance = h337.create({
    container: document.querySelector('.test'),//热图将适应dom节点的大小
    maxOpacity: .5
});

// 一些随机的数据（屏幕坐标）
var points = [];
var max = 0;
var width = 500;
var height = 400;
var len = 300;

while (len--) {
    var val = Math.floor(Math.random()*100);
    // now also with custom radius
    var radius = Math.floor(Math.random()*70);

    max = Math.max(max, val);
    var point = {
        x: Math.floor(Math.random()*width),
        y: Math.floor(Math.random()*height),
        value: val,
        // radius configuration on point basis
        radius: radius
    };
    points.push(point);
}
// heatmap data format
var data = {
    max: max,
    data: points
};
// if you have a set of datapoints always use setData instead of addData
// for data initialization
heatmapInstance.setData(data);