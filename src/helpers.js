import moment from "moment";

const helpers = {
  getRandomInt(min, max) {
    var rand = Math.floor(Math.random() * (max - min + 1)) + 1;
    return rand;
  },

  getRandomArr(len, min, max) {
    var arr = [];
    for (var i = 0; i < len; i++) {
      //console.log(i);
      arr.push(helpers.getRandomInt(min, max));
    }
    return arr;
  },

  getDatasetFromRows(data_array, timefield, field, sensitivity) {
    let arr = [];

    for(let e of data_array) {
      if (arr.length === 0) {
        arr.push({
          x: moment(e[timefield]),
          y: parseFloat(e[field])
        });
      } else {
        let lastdata = arr[arr.length-1];
        let fieldval = parseFloat(e[field]);
        if(Math.abs(lastdata.y - fieldval) >= sensitivity) {
          arr.push({
            x: moment(e[timefield]),
            y: fieldval
          });
        }
      }
    }
    //console.log(arr)
    return arr;
  }
};

export default helpers;
