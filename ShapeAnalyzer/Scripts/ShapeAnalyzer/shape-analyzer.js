(function() {
  var computeCircleMetrics, createCanvasElement, getColExtent, getFirstFromLeft, getFirstFromTop, getImageData, getRowExtent, pixelIsFilled, randomInRange;

  this.analyzeShape = function(shapeType, shapeUrl, postProcess) {
    var shape;
    shape = new Image();
    shape.onload = function() {
      var circleMetrics, computeTime, imageData, start;
      imageData = getImageData(shape);
      if (shapeType === 'circle') {
        start = (new Date).getTime();
        circleMetrics = computeCircleMetrics(imageData);
        computeTime = (new Date).getTime() - start;
        if (postProcess) {
          return postProcess(circleMetrics, computeTime);
        }
      }
    };
    return shape.src = shapeUrl;
  };

  getImageData = function(image) {
    var canvas, context;
    canvas = createCanvasElement(image.width, image.height)[0];
    context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height);
  };

  createCanvasElement = function(width, height) {
    var id;
    id = "c" + randomInRange(1, 1000000);
    return $("<canvas id=" + id + " width=" + width + " height=" + height + "></canvas>");
  };

  computeCircleMetrics = function(imageData) {
    var centerX, centerY, fce, ffl, fft, fre;
    fft = getFirstFromTop(imageData);
    fre = getRowExtent(imageData, fft.row, fft.col);
    centerX = fft.col + ((fre - fft.col) / 2);
    ffl = getFirstFromLeft(imageData);
    fce = getColExtent(imageData, ffl.col, ffl.row);
    centerY = ffl.row + ((fce - ffl.row) / 2);
    return {
      centerX: centerX,
      centerY: centerY
    };
  };

  getFirstFromTop = function(imageData) {
    var col, row, _i, _j, _ref, _ref1;
    for (row = _i = 0, _ref = imageData.height - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; row = 0 <= _ref ? ++_i : --_i) {
      for (col = _j = 0, _ref1 = imageData.width - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; col = 0 <= _ref1 ? ++_j : --_j) {
        if (pixelIsFilled(imageData, col, row)) {
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
        if (pixelIsFilled(imageData, col, row)) {
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
      if (!(pixelIsFilled(imageData, col, row))) {
        return col - 1;
      }
    }
  };

  getColExtent = function(imageData, col, firstRow) {
    var row, _i, _ref;
    for (row = _i = firstRow, _ref = imageData.height - 1; firstRow <= _ref ? _i <= _ref : _i >= _ref; row = firstRow <= _ref ? ++_i : --_i) {
      if (!(pixelIsFilled(imageData, col, row))) {
        return row - 1;
      }
    }
  };

  pixelIsFilled = function(imageData, x, y) {
    var a, b, g, ix, r;
    ix = ((y * imageData.width) + x) * 4;
    r = imageData.data[ix];
    g = imageData.data[ix + 1];
    b = imageData.data[ix + 2];
    a = imageData.data[ix + 3];
    return ((r + g + b) === 0) && (a === 255);
  };

  randomInRange = function(low, high) {
    return Math.floor((Math.random() * high) + low);
  };

}).call(this);
