export const PhPivotDefs = {
    sampleData: [
        { "col": "Pivot Table" },
        { "col": "Pivot Value" },
        { "col": "Frequency Table" },
        { "col": "Various Statistics" },
    ],
    settingData: {
        "Pivot Table": [
            { "data": "列: year" },
            { "data": "行: country" },
            { "data": "聚合: sum of qty" }
        ],
        "Pivot Value": [
            { "data": "列: metric" },
            { "data": "行: id" },
            { "data": "聚合: first of value" }
        ],
        "Frequency Table": [
            { "data": "列: year" },
            { "data": "行: count" },
            { "data": "聚合: count of records"}
        ],
        "Various Statistics": [
            { "data": "列: year" },
            { "data": "行: count" },
            { "data": "聚合: sum of records"},
            { "data": "Other: average of qty"}
        ]
    },
    condData: {
        "Pivot Table": [
            { "id": 1, "country": "US", "year": "2016", "qty": 7 },
            { "id": 2, "country": "US", "year": "2017", "qty": 12 },
            { "id": 3, "country": "US", "year": "2017", "qty": 23 },
            { "id": 4, "country": "FR", "year": "2017", "qty": 8 },
        ],
        "Pivot Value": [
            { "id": 1, "metric": "weight", "values": 2 },
            { "id": 1, "metric": "height", "values": 4 },
            { "id": 2, "metric": "weight", "values": 3 },
            { "id": 2, "metric": "height", "values": 5 },
        ],
        "Frequency Table": [
            { "id": 1, "country": "US", "year": "2016", "qty": 7 },
            { "id": 2, "country": "US", "year": "2017", "qty": 12 },
            { "id": 3, "country": "US", "year": "2017", "qty": 23 },
            { "id": 4, "country": "FR", "year": "2017", "qty": 8 },
        ],
        "Various Statistics": [
            { "id": 1, "country": "US", "year": "2016", "qty": 7 },
            { "id": 2, "country": "US", "year": "2017", "qty": 12 },
            { "id": 3, "country": "US", "year": "2017", "qty": 23 },
            { "id": 4, "country": "FR", "year": "2017", "qty": 8 },
        ],
    },
    pivotData: {
        "Pivot Table": [
            { "country": "US", "2016": 7, "2017": 3 },
            { "country": "FR", "2016": null, "2017": 8 },
        ],
        "Pivot Value": [
            { "id": 1, "weight": 2, "height": 4 },
            { "id": 2, "weight": 3, "height": 5 },
        ],
        "Frequency Table": [
            { "country": "US", "2016": 1, "2017": 2 },
            { "country": "FR", "2016": null, "2017": 1 },
        ],
        "Various Statistics": [
            { "country": "US", "2016": 7, "2017": 35, "avg(qty)": 21 },
            { "country": "FR", "2016": null, "2017": 8, "avg(qty)": 8 },
        ],
    },
    pivotTypes: [
        {
            desc: "全部",
            cal: "all"
        },
        {
            desc: "最频繁的",
            cal: "topnLimt"
        },
        {
            desc: "出现次数多余",
            cal: "minOccLimit"
        },
        {
            desc: "explicitValues",
            cal: "explicitValues"
        },
    ],
    aggregationMethods: [
        {
            "desc": "avg",
            "cal": "avg"
        },
        {
            "desc": "concat",
            "cal": "concat"
        },
        {
            "desc": "count",
            "cal": "count"
        },
        {
            "desc": "first",
            "cal": "first"
        },
        {
            "desc": "last",
            "cal": "last"
        },
        {
            "desc": "max",
            "cal": "max"
        },
        {
            "desc": "min",
            "cal": "min"
        },
        {
            "desc": "stddev",
            "cal": "stddev"
        },
        {
            "desc": "sum",
            "cal": "sum"
        },
    ]
}
