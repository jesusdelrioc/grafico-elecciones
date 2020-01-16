<template>
<div class="arco">
<div class="text-participacion" style=" display: flex; flex-flow: wrap; justify-content: space-around; padding: 1em">
      <span class="participacion">Participación {{participacion}} %</span>
  </div>
  <div :class="responsive1">
  <div id="chart_congreso" :class="type" style="height: 200px!important;position: relative;">
    <div id="tooltip_chart_congreso" style="border-radius:2px;display: none; position: absolute;  z-index: 100;  background: #fff; color: black; width: auto; box-shadow: 2px 2px 6px rgba(40, 40, 40, 0.5);zzzz;">
      <p id="tooltip_chart_data_congreso" style="margin: 0px;padding: 2px;font-size: 10px;background-color: black;opacity: .7;color: white;text-align: center;"></p>
    </div>
    <div id="tooltip_chart_congreso" style="border-radius:2px;display: none; position: absolute;  z-index: 100;  background: #fff; color: black; width: auto; box-shadow: 2px 2px 6px rgba(40, 40, 40, 0.5);zzzz;">
      <p id="tooltip_chart_data_congreso" style="margin: 0px;padding: 2px;font-size: 10px;background-color: black;opacity: .7;color: white;text-align: center;"></p>
    </div>
  </div>
  <div id="partidos_congreso">
    <p style="font-family: 'Oxygen', serif; font-size: 12px;text-align: left; color: #474747; border-bottom: 1px solid #cbcbcb">Otros:</p>
  </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'ArcoCongreso',
  props: ['dataset', 'type', 'unit'],
  data () {
    return {
      'congreso': this.dataset['congreso'],
      'bigParties': this.dataset['congreso']['actuales']['total'].candidaturas.filter(
        candidatura => {
          return +candidatura.diputados_electos_candidatura >= 15
        }
      ),
      'littleParties': this.dataset['congreso']['actuales']['total'].candidaturas.filter(candidatura => {
        return +candidatura.diputados_electos_candidatura < 15 && candidatura.siglas_candidatura !== 'ECP-GUANYEM EL CANVI'
      }),
    'escrutado': this.dataset['congreso']['actuales']['total'].porc_censo_escrutado,
      'participacion': this.dataset['congreso']['actuales']['total'].porc_total_votantes,
      width23: '',
      heigh23: ''
    }
  },
  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    responsive1(){
      return(window.innerWidth > 500)? 'arco' : 'arco responsive'
    },
    handleResize () {
      this.width23 = window.innerWidth;
      this.height23 = window.innerHeight;
    }
  },
  mounted () {
    let num_text = '350'
    let unit_text = 'diputados'
    let width = 450
    let height = 400
    let thickness = 85
    let thicknessResponsive = 70
    // eslint-disable-next-line no-unused-vars
    let legendRectSize = 18
    // eslint-disable-next-line no-unused-vars
    let legendSpacing = 0

    var d3 = this.$d3

    let radius = Math.min(width, height) / 2
    let radius1 = Math.min(300, height) / 2
    let color = d3.scaleOrdinal

    let svg = d3
      .select('#chart_' + 'congreso')
      .append('svg')
      .attr('class', 'pie1' + 'congreso')
      .attr('height', height)
      .attr('width', d=>{
        if(this.width23>500){
          return 400
        }
      })

    let g = svg
      .append('g')
      .attr('transform', d =>{
        if(this.width23 > 500){
          return 'translate(' + width / 2.25 + ',' + height / 2 + ')'
        }else{
          return 'translate(' + '304' / 2 + ',' + height / 2 + ')'
        }
      })

    let arc = d3
      .arc()
      .innerRadius((this.width23>500)? radius - thickness : radius1 - thicknessResponsive)
      .outerRadius((this.width23>500)? radius : radius1)

    let pie = d3
      .pie()
      // this will create arc data for us given a list of values
      .startAngle(-90 * (Math.PI / 180))
      .endAngle(90 * (Math.PI / 180))
      .padAngle(0.001) // some space between slices
      .value(function (d) {
        return +d.diputados_electos_candidatura
      })
      .sort(null)

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', (this.width23>500)? '19px' : '15px')
      .attr('font-weight', 'bolder')
      .attr('font-family', 'Oxygen')
      .attr('dy', '.35em')
      .attr('transform', d=>{
        if(this.width23>500){
          return 'translate(' + width / 2.25 + ',' + height / 2.3 + ')'
        }else{
          return 'translate(' + 304 / 2 + ',' + height / 2.3 + ')'
        }
      })
      .text(num_text)

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-weight', 'bolder')
      .attr('font-family', 'Bitter')
      .attr('dy', '.35em')
      .attr('transform', d=>{
        if(this.width23>500){
          return 'translate(' + width / 2.25 + ',' + height / 2.1 + ')'
        }else{
          return 'translate(' + 304 / 2 + ',' + height / 2.1 + ')'
        }
      })
      .text(unit_text)

    let tooltip = d3
      .select('#tooltip_chart_' + 'congreso')

    let tooltipData = d3
      .select('#tooltip_chart_data_' + 'congreso')

    let otros = {
      'siglas_candidatura': 'Otros',
      'color_candidatura': '#999999',
      'diputados_electos_candidatura': 0,
      'porc_votos_candidatura': 0
    }
    let totalOtros = 0
    let totalPorcOtros = 0
    var extra = 0
    var extra2 = 0
    for (let i in this.littleParties) {
      totalOtros += this.littleParties[i].diputados_electos_candidatura
      totalPorcOtros += this.littleParties[i].porc_votos_candidatura
      if (this.littleParties[i].siglas_candidatura === 'ECP-GUANYEM EL CANVI') {
        extra = this.littleParties[i].diputados_electos_candidatura
        extra2 = this.littleParties[i].porc_votos_candidatura
      }
    }
    otros.diputados_electos_candidatura = totalOtros
    otros.porc_votos_candidatura = totalPorcOtros

    this.bigParties.push(otros)
    for (let i in this.bigParties) {
      if (this.bigParties[i].siglas_candidatura === 'PODEMOS-IU-EQUO') {
        this.bigParties[i].diputados_electos_candidatura += extra
        this.bigParties[i].porc_votos_candidatura += extra2
      }
      if (this.bigParties[i].siglas_candidatura === 'ERC') {
        this.bigParties[i].color_candidatura = '#ffbc2e'
      }
    }

    let gg = g
      .selectAll('path')
      .data(pie(this.bigParties))
      .enter()
      .append('g')
      .on('mouseover', function (d) {
        tooltip.style('cursor', 'pointer')
          .style('display', 'block')
      })
      .on('mouseout', function (d) {
        tooltip.style('cursor', 'none')
          .style('display', 'none')
      })

      gg
      .append('path')
      .attr('d', arc)
      .attr('stroke-with', '1')
      .attr('stroke', '#ffffff')
      .style('opacity', '.9')
      .attr('fill', 'white')
      .on('mouseover', function (d) {
        let colorCandidatura = d.data.color_candidatura
        let siglasCandidatura = d.data.siglas_candidatura
        if (d.data.siglas_candidatura === 'UP + G') {
          siglasCandidatura = 'UP<br> + <br> GUANYEM'
        }
        let diputadosCandidatura = d.data.diputados_electos_candidatura
        let porcVotosCandidatura = d.data.porc_votos_candidatura
        tooltip.style('cursor', 'pointer')
        .style('display', 'none')
        var html = `<table>`
        html += `<tr><td style='margin-bottom:1px;font-size:14px;font-weight:bolder;font-family: "Bitter"; text-align: center;'><span style=" color: ${colorCandidatura}">${siglasCandidatura}</span></td></tr>`

        html +=
          `<tr style="text-align: center">` +
          `<td style='font-size:14px;font-family: "Oxygen"; min-width: 50px'>${porcVotosCandidatura}% votos</td>` +
          `</tr>`+
          `<tr style="text-align: center">` +
          `<td style='font-size:14px;font-family: "Oxygen"'>${diputadosCandidatura} diputados</td>` +
          `</tr>`
        html += `</table>`
        tooltip.html(html)
      })
      .on('mousemove', function(){
        if(window.innerWidth > 500){
          tooltip.style('left', `${d3.event.pageX - 120 }px`)
        .style('top',`${d3.event.pageY - 100 }px`)
        }else{
          tooltip.style('left', `35%`)
        .style('top',`200px`)
        }
        })
      .on('mouseout', function (d) {
        d3.select('#tooltip_chart_' + 'congreso')
          .style('display', 'block')
      })
      .transition()
      .delay(function(d, i) { return i * 100; })
      .duration(200)
      .attrTween('d', function(d) {
         var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
         return function(t) {
           d.endAngle = i(t)
           return arc(d)
         }
      })
      .attr('fill', (d) => {
        return d.data.color_candidatura
      })
      .attr('title', (d) => {
        return d.data.siglas_candidatura
      })
    let svgtext = gg
      .append('text')
      .attr('transform', function (d) {
        return 'translate(' + arc.centroid(d) + ')'
      })
      .attr('x', '0')
      .attr('y', '0')
      .attr('dy', '.33em')
      .style('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'bolder')
      .style('font-family', 'Oxygen')
      .attr('fill', '#fff')

      .style('cursor', 'default')
      .on('mouseover', function (d) {
        let colorCandidatura = d.data.color_candidatura
        let siglasCandidatura = d.data.siglas_candidatura
        if (d.data.siglas_candidatura === 'UP + G') {
          siglasCandidatura = 'UP<br> + <br> GUANYEM'
        }
        let diputadosCandidatura = d.data.diputados_electos_candidatura
        let porcVotosCandidatura = d.data.porc_votos_candidatura
        tooltip.style('cursor', 'pointer')
        .style('display', 'none')
        var html = `<table>`
        html += `<tr><td style='margin-bottom:1px;font-size:14px;font-weight:bolder;font-family: "Bitter"; text-align: center;'><span style=" color: ${colorCandidatura}">${siglasCandidatura}</span></td></tr>`

        html +=
          `<tr style="text-align: center">` +
          `<td style='font-size:14px;font-family: "Oxygen"; min-width: 50px'>${porcVotosCandidatura}% votos</td>` +
          `</tr>`+
          `<tr style="text-align: center">` +
          `<td style='font-size:14px;font-family: "Oxygen"'>${diputadosCandidatura} diputados</td>` +
          `</tr>`
        html += `</table>`
        tooltip.html(html)
      })
      .on('mousemove', function(){
        if(window.innerWidth > 500){
          tooltip.style('left', `${d3.event.pageX - 120 }px`)
        .style('top',`${d3.event.pageY - 100 }px`)
        }else{
          tooltip.style('left', `35%`)
        .style('top',`200px`)
        }
        })

      .text(function (d) {
        if (d.data.siglas_candidatura === 'PODEMOS-IU-EQUO') {
          d.data.siglas_candidatura = 'UP'
        }
        if (d.data.siglas_candidatura === 'ERC-SOBIRANISTES') {
          d.data.siglas_candidatura = 'ERC'
        }
        return `${d.data.siglas_candidatura} ${d.data.diputados_electos_candidatura}`
      })
    svg.append('text').text('10-N').attr('font-family', 'Oxygen').attr('fill', 'grey').attr('x', 25).attr('y', height - 180)
    svg.append('text').text('28-A').attr('font-family', 'Oxygen').attr('font-size', '12px').attr('fill', 'grey').attr('x', 105).attr('y', height - 180)

    let div = d3
      .select('#partidos_' + 'congreso')
      .append('ul')
      .attr('class', 'partidosResponsive')
      .style('list-style', 'none')
      .style('flex-wrap', 'wrap')
      .style('display', 'flex')
      .style('justify-content', 'start')
      .style('padding-inline-start', '0px')
      .style('margin', d =>{
        if(this.width23 > 500|| this.width23 < 900){
          return '0px 0px 10px'
        }
      })

    let legend = div
      .selectAll('.legend')
      .data(this['littleParties'])
      .enter()
      .filter(function (d) {
        return d.diputados_electos_candidatura >= 1
      })
      .append('li')
      .attr('class', 'legend')
      .style('display', 'flex')
      .style('flex-direction', 'row')
      .style('justify-content', 'flex-start')
      .style('align-content', 'flex-start')
      .style('align-items', 'baseline')
      .style('width', d=>{
        if(this.width23 > 500){
          return '33%'
        }
      })
      .style('margin', d=>{
        if(this.width23 < 500){
          return '0 auto'
        }
      })

    legend.append('span')
      .style('width', '0')
      .style('display', 'inline')
      .style('border-left', (this.width23 > 500) ? '20px solid transparent' : '15px solid transparent')
      .style('border-bottom', '10px solid')
      .style('border-bottom-color', (d, i) => {
        return d.color_candidatura
      })

    legend.append('span')
      .text(function (d, i) {
        if (d.siglas_candidatura === 'ERC-SOBIRANISTES') {
          return 'ERC'
        }
        if (d.siglas_candidatura === 'PODEMOS-IU-EQUO') {
          return 'UP'
        }
        if (d.siglas_candidatura === 'ECP-GUANYEM EL CANVI') {
          return 'GUANYEM'
        }
        return d.siglas_candidatura
      })
      .style('font-size', '10px')
      .style('padding', '0 5px')
      .style('overflow', 'hidden')
      .style('text-overflow', 'ellipsis')
      .style('font-family', 'Bitter')
      .style('font-weight', 'bolder')
      .style('border-top', '8px solid transparent')

    legend.append('span')
      .text(function (d, i) {
        return +d.diputados_electos_candidatura
      })
      .style('font-size', '12px')
      .style('font-family', 'Oxygen')
      .style('font-weight', 'bolder')
      .style('color', 'black')
      .style('border-top', '15px solid transparent')

//  *****  ARCO PEQUEÑO  *****//

    let text2 = ''
    let width2 = 400
    let height2 = 400
    let thickness2 = 35
    let duration2 = 750
    let radius2 = Math.min(width2, height2) / 4
    let radius3 = Math.min(300, height) / 4
    let svg2 = svg
    let g2 = svg2
      .append('g')
      .attr('transform', d=>{
        if(this.width23>500){
          return 'translate(' + width2 / 2 + ',' + height2 / 2 + ')'
        } else{
          return 'translate(' + 304 / 2 + ',' + height2 / 2 + ')'
        }
      })

    let arc2 = d3
      .arc()
      .innerRadius((this.width23 > 500)? radius2 - thickness2 : radius3 - thickness2)
      .outerRadius((this.width23 > 500)? radius2 : radius3)
  
    let gg2 = g2
      .selectAll('path')
      .data(pie(this.congreso['anteriores'].candidaturas.filter(candidatura => +candidatura.diputados_electos_candidatura >= 15)))
      .enter()
      .append('g')
      .style('opacity', '.5')
      .on('mouseover', function (d) {
        tooltip.style('cursor', 'pointer')
          .style('display', 'block')
      })
      .on('mouseout', function (d) {
        tooltip.style('cursor', 'none')
          .style('display', 'none')
      })

    gg2.append('path')
      .attr('d', arc2)
      .attr('stroke-with', '1')
      .attr('stroke', '#ffffff')
      .style('opacity', '.9')
      .attr('fill', 'white')
      .on('mouseover', function (d) {
        let colorCandidatura = d.data.color_candidatura
        let siglasCandidatura = d.data.siglas_candidatura
        if (d.data.siglas_candidatura === 'UP + G') {
          siglasCandidatura = 'UP<br> + <br> GUANYEM'
        }
        let diputadosCandidatura = d.data.diputados_electos_candidatura
        let porcVotosCandidatura = d.data.porc_votos_candidatura
        tooltip.style('cursor', 'pointer')
          .style('fill', 'black')
          .style('display', 'none')
        let html = `<table>`
        html += `<tr><td style='margin-bottom:1px;font-size:14px;font-weight:bolder;font-family: "Bitter"; text-align: center;'><span style=" color: ${colorCandidatura}">${siglasCandidatura}</span></td></tr>`

        html +=
          `<tr style="text-align: center">` +
          `<td style='font-size:14px;font-family: "Oxygen"; min-width: 50px'>${porcVotosCandidatura}% votos</td>` +
          `</tr>`+
          `<tr style="text-align: center">` +
          `<td style='font-size:14px;font-family: "Oxygen"'>${diputadosCandidatura} diputados</td>` +
          `</tr>`
        html += `</table>`
        tooltip.html(html)
      })
       .on('mousemove', function(){
        if(window.innerWidth > 500){
          tooltip.style('left', `${d3.event.pageX - 100 }px`)
        .style('top',`${d3.event.pageY - 90 }px`)
        }else{
          tooltip.style('left', `35%`)
        .style('top',`200px`)
        }
        })
      .transition()
      .delay(function(d, i) { return i * 150; })
      .duration(200)
      .attrTween('d', function(d) {
         var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
         return function(t) {
           d.endAngle = i(t)
           return arc2(d)
         }
      })

      .attr('fill', (d) => {
        return d.data.color_candidatura
      })
      .attr('title', (d) => {
        return d.data.siglas_candidatura
      })
  }
}
</script>
<style scoped>
.scruted, .participacion {
  font-family: 'Oxygen';
  font-size: 14px;
  color: #474747
}
#partidosResponsive{
    margin: 40px 10px 0px!important;
  }
@media (max-width: 900px){
  .text-participacion,.participacion{
    display: none!important;
  }
   #partidos_congreso{
     margin: 40px 10px 0px;
  }
}
@media (min-width: 900px){
  #chart_congreso{
    padding-top: 40px!important;
     margin: 20px 20px 0px;
  }
   #partidos_congreso{
     margin: 50px;
  }
}
</style>