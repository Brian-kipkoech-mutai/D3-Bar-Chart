import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

const BarComponent = () => {
  const w = 800;
  const h = 500;
  const padding = 50;
  const svgRef = useRef();
  const [dataset, setData] = useState(null);
  const [message,setmessage]=useState(null);
  

   

  useEffect(() => {
    const dataFetch = async () => {
      try {
        setmessage('fetching data... , pleas wait')
        const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setData(data.data);
        console.log('data.data',data.data);
      } 

      catch (error) {
        console.error('error fetching data', error);
        setmessage('failed to fetch  data! . please check your network connection and try reloading  the page ')
      }
    };

    dataFetch();
  }, []); // Run this only once, when the component mounts

  useEffect(() => {
    if (dataset) {
      const yScale = d3.scaleLinear().domain([0, d3.max(dataset, (d) => d[1])]).range([h - padding, padding]);

      const xscaleData=d3.scaleTime()
      .domain([d3.min(dataset,d=> new Date(d[0])),d3.max(dataset,d=>new Date(d[0]))])
      .range([padding,w-padding]);

      const colorScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, (d) => d[1])])
  .range(['green', 'darkred']);
       
      const ParseDate=d3.timeParse('%Y-%m-%d')
      const xScale = d3
        .scaleBand()
        .domain( dataset.map((d)=>ParseDate(d[0])))
        .range([padding, w - padding])
        

      const svg = d3.select(svgRef.current)
                    .attr('viewBox', `0 0 ${w} ${h}`);
      console.log('svggg',svgRef.current);

      const guotersOfTheYear={
        Jan:'QI',
        Apr:'Q2',
        Jul:'Q3',
        Oct:'Q4'
      }

      svg
        .selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class','bar')
        .attr('x', (d) => xscaleData(  new Date(d[0])))
        .attr('y', (d) => yScale(d[1]))
        .attr('height', (d) => h - padding - yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .attr('fill', d=>colorScale(d[1]))
        .attr('data-date', d => d[0])  // Adding data-date attribute
        .attr('data-gdp', d => d[1])
        .on('mouseover', (event, d) => {
             const rawDate=d[0]
            const date =  new Date(d[0]).toString();
            const splited = date.split(' ');
            const year = splited[3];
            const Quoter = guotersOfTheYear[splited[1]];
          
            
  
            // Show the tooltip immediately
            d3.select('#tooltip')
              .style('opacity', 1)
              .attr('data-date',rawDate)
              .html(`${year} ${Quoter}<br>$  ${d[1].toLocaleString('en-US')}  Billion`)
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 50 + 'px');
          })
          .on('mouseleave', () => {
            // Hide the tooltip on mouseout
            
              d3.select('#tooltip').style('opacity', 0);
             
          });
           
            const xAxis=d3.axisBottom(xscaleData)
            svg.append('g')
                .attr('transform',`translate(0,${h-padding})`)
                .attr('id','x-axis')
                .call(xAxis)
              const yAxis=d3.axisLeft(yScale)
            svg.append('g')
                   .attr('transform', `translate(${padding}, 0)`)
                   .attr('id','y-axis')
                   

                .call(yAxis)
         

    }
    
  }, [dataset]);

  return (
      <div className="ui">
         <div className="mainbox" >
        <div className="title"id='title' >United States GDP</div>
        
        <div id="tooltip"></div>
        {dataset?<svg ref={svgRef}></svg>:message}
       </div>
      </div>
       
       
     
  );
};

export default BarComponent;
