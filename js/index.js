"use strict";

var bicycledata = [];

function after() {
   var div = d3.select(".render").append("div").attr("class", "tooltip").style("opacity", 0);
   var w = 800;
   var h = 500;
   var padding = 20;
   var yScale2 = d3.scaleLinear().domain([1, 36]).range([padding * 2, h - padding * 3 + (h - padding * 3) / 35]);

   var xScale2 = d3.scaleLinear().domain([d3.max(bicycledata, function (d) {
      return d.Seconds - 2210;
   }) + 30, 0]).range([padding * 5 - 30, w - padding * 5]);
   var xAxis = d3.axisBottom().scale(xScale2).ticks(5);
   var yAxis = d3.axisLeft().scale(yScale2).ticks(6);
   var svg = d3.select('.render').append('svg').attr('width', w).attr('height', h);

   svg.selectAll('circle').data(bicycledata).enter().append('circle').attr('cx', function (d) {
      return xScale2(d.Seconds - 2210);
   }).attr('cy', function (d) {
      return yScale2(d.Place);
   }).attr('r', 4).attr('fill', function (d) {
      if (d.Doping !== '') {
         return '#e0115f';
      } else {
         return 'grey';
      }
   }).on("mouseover", function (d) {
      d3.select(this).style('stroke', 'black');
      div.transition().duration(200).style("opacity", .9);
      div.html(d.Name + ': ' + d.Nationality + '<br/>Year: ' + d.Year + ', Time: ' + d.Time + '<br/><br/>' + (d.Doping != '' ? d.Doping : 'No doping')).style("left", (window.innerWidth > w ? window.innerWidth : w) / 2 - 290 + "px").style("top", "130px");
   }).on("mouseout", function (d) {
      d3.select(this).style('stroke', 'none');
      div.transition().duration(500).style("opacity", 0);
   });

   svg.selectAll('text').data(bicycledata).enter().append('text').text(function (d) {
      return d.Name;
   }).attr('x', function (d) {
      return xScale2(d.Seconds - 2210);
   }).attr('y', function (d) {
      return yScale2(d.Place);
   }).attr('transform', 'translate(8,4)').style('font-size', '12px').style('font-weight', 'bold').style('font-family', 'Fira Sans Extra Condensed, sans-serif');

   svg.append('g').call(d3.axisLeft().scale(yScale2).ticks(8)).attr('class', 'axis').attr('transform', 'translate(70,0)');

   svg.append('g').call(xAxis).attr('class', 'axis').attr('transform', 'translate(0, ' + (h - padding * 3 + (h - padding * 3) / 35) + ')');
   svg.append('text').text('Doping in Professional Bicycle Racing').attr('transform', 'translate(210,35)').style('font-size', '25px').style('font-weight', 'bold').style('font-family', 'Fira Sans Extra Condensed, sans-serif');

   svg.append('text').text("35 Fastest times up Alpe d'Huez").attr('transform', 'translate(270,55)').attr('class', 'forup');

   svg.append('text').text("Normalized to 13.8km distance").attr('transform', 'translate(295,70)').attr('class', 'for');
   svg.append('text').text("Ranking").attr('transform', 'translate(85,85)rotate(270)').attr('class', 'for');

   svg.append('text').text("Seconds Behind Fastest Time").attr('transform', 'translate(320,487)').attr('class', 'for');
}

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function (error, objectdata) {
   bicycledata = objectdata;
   after();
});