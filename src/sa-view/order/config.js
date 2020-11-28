export const getStatusText = (status) => {
  let statusText = ''
  switch (status) {
    case 1:
      statusText = '等待接单'
      break;
    case 2:
      statusText = '失效订单'
      break;
    case 3:
      statusText = '用户确认报价'
      break;
    case 4:
      statusText = '酒店确认完成'
      break;
    case 5:
      statusText = '用户已上传消费单'
      break;
    case 6:
      statusText = '订单已完成'
      break;
    case 7:
      statusText = '酒店拒绝消费单'
      break;
    case 8:
      statusText = '订单已过期'
      break;
    case 9:
      statusText = '后台确认完成'
      break;
  }
  return statusText
}
const getPickerData = data => {
  return data.map(item => ({
    name: item.name,
    value: item.name,
  }))
}
const getCommon = (data, value) => {
  if (value) { // 优先匹配value，其次再匹配name
    let item = data.filter(item => item.value.toString() == value.toString())[0]
    if (item) {
      return item ? item.name : item
    } else {
      let item = data.filter(item => item.name == value)[0]
      return item ? item.value : item
    }
  }
  return getPickerData(data)
}
export const rnzs = value => { // 容纳桌数
  let data = [{
    name: '10桌以下',
    value: [0, 10],
  }, {
    name: '10-20桌',
    value: [10, 20],
  }, {
    name: '20-30桌',
    value: [20, 30],
  }, {
    name: '30-40桌',
    value: [30, 40],
  }, {
    name: '40桌以上',
    value: [40, 0],
  }]
  return getCommon(data, value)
}

export const rs = value => { // 参会人数
  let data = [{
    name: '10~50人',
    value: [10, 50]
  }, {
    name: '51~100人',
    value: [50, 100]
  }, {
    name: '101~150人',
    value: [101, 150]
  }, {
    name: '151~300人',
    value: [151, 300]
  }, {
    name: '301~500人',
    value: [301, 500]
  }, {
    name: '501~1000人',
    value: [501, 1000]
  }, {
    name: '1000人以上',
    value: [1000, 0]
  }]
  return getCommon(data, value)
}