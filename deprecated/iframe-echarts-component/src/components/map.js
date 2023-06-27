// 获取地图
export const getGeoJson = async (type, name) => {
    let result
    if (type === 'country') {
        result = await fetch('https://hb-platform.s3.cn-northwest-1.amazonaws.com.cn/2020-11-11/etl/blueprints/map/china.json').then(res => res.json())
    }
    if (type === 'provice') {
        result = fetch('https://hb-platform.s3.cn-northwest-1.amazonaws.com.cn/2020-11-11/etl/blueprints/map/province/' + encodeURIComponent(`${name}.json`)).then(res => res.json())
    }
    return result
}
//全国数据
export const getChinaData = async () => {
    let queryParam = buildQueryString('country')
    let params = {"query":"select `标准省份名称` as provice, sum(sales) as sales from phmax.data_wide where date='202001' and provice !='null' group by provice","schema":["provice","sales"]}
    let result = await queryData(params)
    let partData = []
    result.forEach((item) => {
        partData.push({
            name: item.provice,
            value: item.sales
        })
    })
    return partData
}
//省份数据
export const getProvinceData = async (name) => {
    let provinceName = name.split('-')[1]
    let queryParam = buildQueryString('provice' )
    let params = {"query":"select `标准城市名称` as city, sum(sales) as sales from phmax.data_wide where date='202001' and `标准省份名称`= '" + provinceName + "' group by city","schema":["city","sales"]}
    let result = await queryData(params)
    let partData = []
    result.forEach((item) => {
        partData.push({
            name: item.city,
            value: item.sales
        })
    })
    return partData
}
//城市数据
export const getCityData = () => {
    // 判断是市，直辖市，获取相应数据
    return []	
}

function getCookie(name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return (arr[2]);
    else
        return null;
}

async function queryData(data) {
    const url = "https://api.hubadata.com/hbchproxyquery"
    const accessToken = getCookie("access_token") || "e20cf44e818d6d07b04bb93745ae9f4b0bbb5477926ef8005008c845cbe68493"
    let body = data
    let options = {
        method: "POST",
        headers: {
            "Authorization": accessToken,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            "accept": "application/json"
        },
        body: JSON.stringify(body)
    }
    let result = await fetch(url, options).then(res => res.json())
    return result
}

function buildQueryString(selectName) {
    let selName, asName, database, filter, sort, group, schema
    if(selectName == 'country') {
        selName = '标准省份名称'
        asName = 'provice'
        database = 'phmax.data_wide'
        filter={
            equal: {
                date: "202001"
            },
            notEqual: {
                provice: "null"
            },
            like: {}
        }
        sort = {}
        group = asName
        schema = ["provice","sales"]
    } else if(selectName == 'provice') {
        selName = '标准城市名称'
        asName = 'city'
        database = 'phmax.data_wide'
        filter={
            equal: {
                date: "202001",
                "`标准省份名称`": "吉林省"
            }
        }
        group = asName
        schema = ["city","sales"]
    }
    let sql_str = "select `"
    sql_str = sql_str + selName + "` as " + asName + ", sum(sales) as sales from " + database

    // filter
    for(const objKey in filter) {
        let firstFilterObj = Object.keys(filter)[0]
        let filterParam = " where "
        if(objKey != firstFilterObj) {
            filterParam = " and "
        }
        let judgeParam = ""
        if(objKey == 'equal') {
            judgeParam = ' = '
        } else if(objKey == 'notEqual') {
            judgeParam = ' != '
        }
        //判断对象不为空
        if(Object.keys(filter[objKey]).length != 0) {
            let firstFilter = Object.keys(filter[objKey])[0]
            for (const key in filter[objKey]) {
                if(key != firstFilter) {
                    filterParam = " and "
                }
                sql_str = sql_str + filterParam + key + judgeParam + "'" + filter[objKey][key] + "'"
            }
        }
    }
    
    // sorts
    for (const key in sort) {
        sql_str = sql_str + " ORDER BY " + key
        if (sort[key] < 0) {
            sql_str = sql_str + " desc "
        }
    }

    //group
    if(group && group != '') {
        sql_str = sql_str + ' group by ' + group
    }
    console.log(sql_str)

    // pages
    // sql_str = sql_str + " LIMIT " + ele.datasource.batch_size
    // sql_str = sql_str + " OFFSET " + (isAppend ? ele.datasource.data.length : 0).toString()
    // return sql_str
}