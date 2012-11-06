@analyzeShape = (shapeType, shapeUrl, postProcess) ->
	shape = new Image()
	shape.onload = ->
		imageData = getImageData shape

		if (shapeType == 'circle')
			start = (new Date).getTime();
			circleMetrics = computeCircleMetrics imageData
			computeTime = (new Date).getTime() - start
			postProcess circleMetrics, computeTime if (postProcess)

	shape.src = shapeUrl

# Given an Image object, returns an array of bytes containing pixel information
# from the image. See http://www.w3schools.com/tags/canvas_getimagedata.asp for
# detailed information about the format of the array.
getImageData = (image) ->
	[canvas] = createCanvasElement image.width, image.height
	context = canvas.getContext '2d'
	context.drawImage image, 0, 0
	context.getImageData 0, 0, canvas.width, canvas.height

# Constructs an unattached canvas element of the requested width/height.
createCanvasElement = (width, height) ->
	id = "c" + randomInRange 1, 1000000
	$("<canvas id=#{ id } width=#{ width } height=#{ height }></canvas>")

# Given an image of a circle (as an array of pixel data), computes and
# returns the (x,y) coordinates of the center of the circle.
computeCircleMetrics = (imageData) ->
	# Determine the X-coordinate of the circle center:
	# Get the bounds of the first row of pixels in the circle
	# and compute its center.
	fft = getFirstFromTop imageData
	fre = getRowExtent imageData, fft.row, fft.col
	centerX = Math.ceil (fft.col + ((fre - fft.col) / 2))

	# Determine the Y-coordinate of the circle center:
	# Determine the lower bound of the center-most column.
	# The circle center is halfway down.
	cce = getColExtent imageData, centerX, fft.row
	centerY = Math.ceil (fft.row + ((cce - fft.row) / 2))

	return { centerX, centerY }

# Returns the coordinates of the first filled (black) pixel in the image
# by scanning by rows, then columns.
getFirstFromTop = (imageData) ->
	# rows
	for row in [0..imageData.height - 1]
		# cols
		for col in [0..imageData.width - 1]
			return { row, col } if pixelIsFilled imageData, col, row

# Returns the coordinates of the first filled (black) pixel in the image
# by scanning by columns, then rows.
getFirstFromLeft = (imageData) ->
	# cols
	for col in [0..imageData.width - 1]
		# rows
		for row in [0..imageData.height - 1]
			return { row, col } if pixelIsFilled imageData, col, row

# Assuming firstCol is the index of the first filled pixel in row, returns
# the column index of the last filled pixel in row.
getRowExtent = (imageData, row, firstCol) ->
	# cols
	for col in [firstCol..imageData.width - 1]
		return col - 1 if not (pixelIsFilled imageData, col, row)
	# Getting to this point means we've searched to the end of the
	# row and found all filled pixels. Return the last.
	imageData.width - 1

# Assuming firstRow is the index of the first filled pixel in col, returns
# the row index of the last filled pixel in col.
getColExtent = (imageData, col, firstRow) ->
	# rows
	for row in [firstRow..imageData.height - 1]
		return row - 1 if not (pixelIsFilled imageData, col, row)
	# Getting to this point means we've searched to the end of the
	# column and found all filled pixels. Return the last.
	imageData.height - 1

# Returns true if the pixel at coordinates (x,y) is black.
pixelIsFilled = (imageData, x, y) ->
	ix = ((y * imageData.width) + x) * 4
	r = imageData.data[ix]
	g = imageData.data[ix+1]
	b = imageData.data[ix+2]
	a = imageData.data[ix+3]
	return ((r+g+b) == 0) && (a == 255)

randomInRange = (low, high) ->
	Math.floor((Math.random()*high)+low)