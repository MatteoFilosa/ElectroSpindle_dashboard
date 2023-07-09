//************************************************************
// Data notice the structure
//************************************************************
var data = [
	[{ 'x': 1, 'y': 6 }, { 'x': 2, 'y': 5 }, { 'x': 3, 'y': 18 }, { 'x': 4, 'y': 10 }, { 'x': 5, 'y': 2 }, { 'x': 6, 'y': 24 }, { 'x': 7, 'y': 13 }, { 'x': 8, 'y': 3 }],
	[{ 'x': 1, 'y': 7 }, { 'x': 2, 'y': 5 }, { 'x': 3, 'y': 9 }, { 'x': 4, 'y': 5 }, { 'x': 5, 'y': 1 }, { 'x': 6, 'y': 11 }, { 'x': 7, 'y': 8 }, { 'x': 8, 'y': 6 }],
	[{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 3 }, { 'x': 3, 'y': 1 }, { 'x': 4, 'y': 3 }, { 'x': 5, 'y': 0 }, { 'x': 6, 'y': 5 }, { 'x': 7, 'y': 3 }, { 'x': 8, 'y': 3 }],
	[{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 0 }, { 'x': 3, 'y': 2 }, { 'x': 4, 'y': 2 }, { 'x': 5, 'y': 1 }, { 'x': 6, 'y': 2 }, { 'x': 7, 'y': 5 }, { 'x': 8, 'y': 1 }],
	[{ 'x': 1, 'y': 0 }, { 'x': 2, 'y': 0 }, { 'x': 3, 'y': 0 }, { 'x': 4, 'y': 0 }, { 'x': 5, 'y': 1 }, { 'x': 6, 'y': 1 }, { 'x': 7, 'y': 0 }, { 'x': 8, 'y': 1 }]
];

var colors = [
	'steelblue',
	'green',
	'red',
	'purple',
	'black'
];

//************************************************************
// Create Margins and Axis and hook our zoom function
//************************************************************
const margin = { top: 20, right: 30, bottom: 30, left: 50 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const xScale = d3.scaleLinear()
	.domain([0, 12])
	.range([0, width]);

const yScale = d3.scaleLinear()
	.domain([0, 30])
	.range([height, 0]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

const zoom = d3.zoom()
	.extent([[0, 0], [width, height]])
	.scaleExtent([1, 10])
	.on("zoom", zoomed);

const svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height + margin.top + margin.bottom)
	.call(zoom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var clip = svg.append("defs").append("SVG:clipPath")
	.attr("id", "clip")
	.append("SVG:rect")
	.attr("width", width)
	.attr("height", height)
	.attr("x", 0)
	.attr("y", 0);


svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);

svg.append("g")
	.attr("class", "y axis")
	.call(yAxis);

svg.append("g")
	.attr("class", "y axis")
	.append("text")
	.attr("class", "axis-label")
	.attr("transform", "rotate(-90)")
	.attr("y", -margin.left + 10)
	.attr("x", -height / 2)
	.text('Test');

const line = d3.line()
	.x(function (d) { return xScale(d.x); })
	.y(function (d) { return yScale(d.y); });

svg.selectAll('.line')
	.data(data)
	.enter()
	.append("path")
	.attr("class", "line")
	.attr('stroke', function (d, i) {
		return colors[i % colors.length];
	})
	.attr("d", line)
	.attr("clip-path", "url(#clip)")

const points = svg.selectAll('.dots')
	.data(data)
	.enter()
	.append("g")
	.attr("class", "dots")
	.attr("clip-path", "url(#clip)")

points.selectAll('.dot')
	.data(function (d, index) {
		return d.map(function (point) {
			return { 'index': index, 'point': point };
		});
	})
	.enter()
	.append('circle')
	.attr('class', 'dot')
	.attr("r", 2.5)
	.attr('fill', function (d, i) {
		return colors[d.index % colors.length];
	})
	.attr("transform", function (d) {
		return "translate(" + xScale(d.point.x) + "," + yScale(d.point.y) + ")";
	});


function zoomed(event) {
	const { transform } = event;

	const newXScale = transform.rescaleX(xScale);
	const newYScale = transform.rescaleY(yScale);

	xAxis.scale(newXScale);
	yAxis.scale(newYScale);

	svg.select(".x.axis").call(xAxis);
	svg.select(".y.axis").call(yAxis);

	var lines = svg.selectAll('.line')

	lines.attr("d", function (d) {
		// Calcola i nuovi valori delle coordinate x e y della linea utilizzando le scale
		var scaledLine = d3.line()
			.x(function (d) { return newXScale(d.x); })
			.y(function (d) { return newYScale(d.y); });

		return scaledLine(d);
	});
	

	points.selectAll('circle').attr("transform", function (d) {
		return "translate(" + newXScale(d.point.x) + "," + newYScale(d.point.y) + ")";
	});
}

