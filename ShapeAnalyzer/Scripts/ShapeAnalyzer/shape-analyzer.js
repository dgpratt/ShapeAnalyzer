(function() {
  var analyzeCircle, computeCircleMetrics, createCanvasElement, getColExtent, getFirstFromLeft, getFirstFromTop, getRowExtent, pixelIsEmpty, randomInRange;

  this.analyzeShape = function(shapeType, shapeUrl, postProcess) {
    var shape;
    shape = new Image();
    shape.onload = function() {
      var canvas, circleMetrics, context;
      canvas = createCanvasElement(shape.width, shape.height)[0];
      context = canvas.getContext('2d');
      context.drawImage(shape, 0, 0);
      circleMetrics = analyzeCircle(canvas);
      if (postProcess) {
        return postProcess(circleMetrics);
      }
    };
    return shape.src = shapeUrl;
  };

  createCanvasElement = function(width, height) {
    var id;
    id = "c" + randomInRange(1, 1000000);
    return $("<canvas id=" + id + " width=" + width + " height=" + height + "></canvas>");
  };

  analyzeCircle = function(canvas) {
    var context, imageData;
    context = canvas.getContext('2d');
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    return computeCircleMetrics(imageData);
  };

  computeCircleMetrics = function(imageData) {
    var centerX, centerY, fce, ffl, fft, fre, radiusX, radiusY;
    fft = getFirstFromTop(imageData);
    fre = getRowExtent(imageData, fft.row, fft.col);
    centerX = fft.col + ((fre - fft.col) / 2);
    ffl = getFirstFromLeft(imageData);
    fce = getColExtent(imageData, ffl.col, ffl.row);
    centerY = ffl.row + ((fce - ffl.row) / 2);
    radiusY = centerY - fft.row;
    radiusX = centerX - ffl.col;
    return {
      centerX: centerX,
      centerY: centerY,
      radiusX: radiusX,
      radiusY: radiusY
    };
  };

  getFirstFromTop = function(imageData) {
    var col, row, _i, _j, _ref, _ref1;
    for (row = _i = 0, _ref = imageData.height - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; row = 0 <= _ref ? ++_i : --_i) {
      for (col = _j = 0, _ref1 = imageData.width - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; col = 0 <= _ref1 ? ++_j : --_j) {
        if (pixelIsEmpty(imageData, col, row)) {
          return {
            row: row,
            col: col
          };
        }
      }
    }
  };

  getFirstFromLeft = function(imageData) {
    var col, row, _i, _j, _ref, _ref1;
    for (col = _i = 0, _ref = imageData.width - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; col = 0 <= _ref ? ++_i : --_i) {
      for (row = _j = 0, _ref1 = imageData.height - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; row = 0 <= _ref1 ? ++_j : --_j) {
        if (pixelIsEmpty(imageData, col, row)) {
          return {
            row: row,
            col: col
          };
        }
      }
    }
  };

  getRowExtent = function(imageData, row, firstCol) {
    var col, _i, _ref;
    for (col = _i = firstCol, _ref = imageData.width - 1; firstCol <= _ref ? _i <= _ref : _i >= _ref; col = firstCol <= _ref ? ++_i : --_i) {
      if (!(pixelIsEmpty(imageData, col, row))) {
        return col;
      }
    }
  };

  getColExtent = function(imageData, col, firstRow) {
    var row, _i, _ref;
    for (row = _i = firstRow, _ref = imageData.height - 1; firstRow <= _ref ? _i <= _ref : _i >= _ref; row = firstRow <= _ref ? ++_i : --_i) {
      if (!(pixelIsEmpty(imageData, col, row))) {
        return row;
      }
    }
  };

  pixelIsEmpty = function(imageData, x, y) {
    var b, g, ix, r;
    ix = ((y * imageData.width) + x) * 4;
    r = imageData.data[ix];
    g = imageData.data[ix + 1];
    b = imageData.data[ix + 2];
    return (r + g + b) === 0;
  };

  randomInRange = function(low, high) {
    return Math.floor((Math.random() * high) + low);
  };

}).call(this);
