@analyzeShape = (shapeType, shapeUrl, postProcess) ->
	shape = new Image()
	shape.onload = ->
		[canvas] = createCanvasElement shape.width, shape.height
		context = canvas.getContext '2d'
		context.drawImage shape, 0, 0

		circleMetrics = analyzeCircle canvas
		postProcess circleMetrics if (postProcess)

	shape.src = shapeUrl

createCanvasElement = (width, height) ->
	id = "c" + randomInRange 1, 1000000
	$("<canvas id=#{ id } width=#{ width } height=#{ height }></canvas>")

analyzeCircle = (canvas) ->
	context = canvas.getContext '2d'
	imageData = context.getImageData 0, 0, canvas.width, canvas.height
	computeCircleMetrics imageData

computeCircleMetrics = (imageData) ->
	fft = getFirstFromTop imageData
	fre = getRowExtent imageData, fft.row, fft.col
	centerX = fft.col + ((fre - fft.col) / 2)

	ffl = getFirstFromLeft imageData
	fce = getColExtent imageData, ffl.col, ffl.row
	centerY = ffl.row + ((fce - ffl.row) / 2)

	radiusY = centerY - fft.row
	radiusX = centerX - ffl.col

	return { centerX, centerY, radiusX, radiusY }

getFirstFromTop = (imageData) ->
	# rows
	for row in [0..imageData.height - 1]
		#cols
		for col in [0..imageData.width - 1]
			return { row: row, col: col } if pixelIsEmpty imageData, col, row

getFirstFromLeft = (imageData) ->
	#cols
	for col in [0..imageData.width - 1]
		# rows
		for row in [0..imageData.height - 1]
			return { row: row, col: col } if pixelIsEmpty imageData, col, row

getRowExtent = (imageData, row, firstCol) ->
	#cols
	for col in [firstCol..imageData.width - 1]
		return col if not (pixelIsEmpty imageData, col, row)

getColExtent = (imageData, col, firstRow) ->
	# rows
	for row in [firstRow..imageData.height - 1]
		return row if not (pixelIsEmpty imageData, col, row)

pixelIsEmpty = (imageData, x, y) ->
	ix = ((y * imageData.width) + x) * 4
	r = imageData.data[ix]
	g = imageData.data[ix+1]
	b = imageData.data[ix+2]
	return ((r+g+b) == 0)

randomInRange = (low, high) ->
	Math.floor((Math.random()*high)+low)
