/**
 * Created by yz on 2017/2/7.
 */
readCzml([{
    "id" : "document",
    "name" : "movePoint",
    "version" : "1.0",
    "clock": {
        "interval": "2017-06-02T16:00:00Z/2017-06-02T16:05:00Z",
        "currentTime": "2017-06-02T16:00:00Z",
        "multiplier": 3
    }
}, {
    "id" : "point",
    "availability" :"2017-06-02T16:00:00Z/2017-06-02T16:05:00Z",
    "path" : {
        "material" : {
            "polylineOutline" : {
                "color" : {
                    "rgba" : [255,255,255,50]
                },
                "outlineColor" : {
                    "rgba" :  [255,255,255,50]
                },
                "outlineWidth" : 3
            }
        },
        "width" : 3,

        "leadTime" : 1,

        "trailTime" : 1000,
        "resolution" : 5
    },
    "position" : {
        "epoch" : "2017-06-02T16:00:00Z",
        "cartographicDegrees" : [
            0,   -70, 20, 150000,
            100, -80, 44, 150000,
            200, -90, 18, 150000,
            300, -98, 52, 150000
        ]
    },
    "point" : {
        "color" : {
            "rgba" : [123, 13, 250, 128]
        },
        "outlineColor" : {
            "rgba" : [255, 0, 0, 128]
        },
        "outlineWidth" : 3,
        "pixelSize" : 8
    }
}])
