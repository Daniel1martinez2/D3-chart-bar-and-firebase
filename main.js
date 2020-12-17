

const svg = d3.select('.canvas')
.append('svg')
    .attr('width', 600)
    .attr('height',600); 
//create margin
const margin = {
top:20,
right:20,
bottom:100,
left:100 
}
const graphWidth = 600 -margin.left -margin.right; 
const graphHeight = 600 -margin.top-margin.bottom; 
const graph = svg.append('g')
.attr('width', graphWidth) 
.attr('height',graphHeight)
.attr('transform',`translate(${margin.left},${margin.top})`);
//axes
const xAxisGroup = graph.append('g')
.attr('transform', `translate(0,${graphHeight})`);
const yAxisGroup = graph.append('g'); 
//
//scales
//linear scale
const y = d3.scaleLinear()
.range([graphHeight,0]); 
//band scale
const x = d3.scaleBand()
.range([0,graphWidth])
.paddingInner(0.2)
.paddingOuter(0.2);  
//create the axes
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y)
.ticks(5)
.tickFormat(d => d + ' orders');
//update x axis text
xAxisGroup.selectAll('text') 
.attr('transform','rotate(-40)')
.attr('text-anchor', 'end')
.attr('fill', '#FF0080')
.style('font-family','monospace'); 
//update function 
const update = (data)=>{

//minimum
const min = d3.min(data, d=>d.orders); 
// maximum
const max = d3.max(data, d=>d.orders); 

//updating scale domains
y.domain([0,max]);     
x.domain(data.map(item=>item.name));

 
//join data to rect, Dominio y luego rango
const rects = graph.selectAll('rect')
    .data(data); 

//remove exit selection
rects.exit().remove(); 
//update current shapes in DOM
rects.attr('width',x.bandwidth)
    .attr('height',d=> graphHeight- y(d.orders))
    .attr('fill','#FF0080')
    .attr('x',(d,i,n)=>x(d.name))
    .attr('y',d=>y(d.orders)); 

//append enter selection
rects.enter()
    .append('rect')
    .attr('width',x.bandwidth)
    .attr('height',d=> graphHeight-y(d.orders))
    .attr('fill','#FF0080')
    .attr('x',(d,i,n)=>x(d.name))
    .attr('y',d=>y(d.orders)); 

//call axis
xAxisGroup.call(xAxis);
yAxisGroup.call(yAxis); 


}
//set data file to work width
db.collection('dishes').get().then(res=>{
    let  data  = [];
    res.docs.forEach(doc=>{
        data.push(doc.data()); 
    }); 

    //calling the function
    update(data); 

    d3.interval(()=>{
        //data.pop(); 
        //update(data); 
    },3000); 

}); 



