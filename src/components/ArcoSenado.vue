<template>
<div class="dd">
  <div v-if="this.width23 > 900" class="arco" style="display: flex; align-items: center; justify-content: center">
    <div class="senado">
      <div id="chart_senado">
        <p style="font-family: 'Oxygen'; font-size: 14px; color: #474747;">10-N</p>
        <div id="tooltip_chart_senado" style="border-radius:2px;display: none; position: absolute;  z-index: 100;  background: #fff; color: black; width: auto; box-shadow: 2px 2px 6px rgba(40, 40, 40, 0.5); left: 0px;">
          <p id="tooltip_chart_data_senado" style="margin: 0px;padding: 2px;font-size: 10px;background-color: black;opacity: .7;color: white;text-align: center;"></p>
        </div>
      </div>
      <div id="partidos_senado" style=" margin: 50px;">
        <p style="font-family: 'Oxygen', serif; font-size: 12px;text-align: left; color: #474747; border-bottom: 1px solid #cbcbcb">Otros:</p>
      </div>
    </div>
    <div class="senado pequeño">
      <div id="chart_senado_pequeño">
        <p style="font-family: 'Oxygen'; font-size: 14px; color: #474747;">28-A</p>
        <div id="tooltip_chart_pequeño_senado" style="border-radius:2px;display: none; position: absolute;  z-index: 100;  background: #fff; color: black; width: auto; box-shadow: 2px 2px 6px rgba(40, 40, 40, 0.5); left: 0px;">
          <p id="tooltip_chart_pequeño_data_senado" style="margin: 0px;padding: 2px;font-size: 10px;background-color: black;opacity: .7;color: white;text-align: center;"></p>
        </div>
      </div>
      <div id="partidos_senado_pequeño" style=" margin: 50px;">
        <p style="font-family: 'Oxygen', serif; font-size: 12px;text-align: left; color: #474747; border-bottom: 1px solid #cbcbcb">Otros:</p>
      </div>
    </div>
  </div>
  <div v-if="this.width23 < 900" id="popo" class="arco responsive" style="display: flex; align-items: center; justify-content: center">
    <div class="tabs12" >
      <input type="radio" name="tabs12" id="tabone12" checked="checked" />
      <label for="tabone12">10-N</label>
      <div class="tab12">
        <div id="chart_senado"  style="height: 200px!important;position: relative;">
          <div id="tooltip_chart_senado" style="border-radius:2px;display: none; position: absolute;  z-index: 100;  background: #fff; color: black; width: auto; box-shadow: 2px 2px 6px rgba(40, 40, 40, 0.5); left: 0px;">
            <p id="tooltip_chart_data_senado" style="margin: 0px;padding: 2px;font-size: 10px;background-color: black;opacity: .7;color: white;text-align: center;"></p>
          </div>
        </div>
        <div id="partidos_senado" style=" margin:24px 10px 4px;">
          <p style="font-family: 'Oxygen', serif; font-size: 12px;text-align: left; color: #474747; border-bottom: 1px solid #cbcbcb">Otros:</p>
        </div>
      </div>
      <input type="radio" name="tabs12" id="tabtwo12" />
      <label for="tabtwo12">28-A</label>
      <div class="tab12">
        <div id="chart_senado_pequeño" style="height: 200px!important;position: relative;">
          <div id="tooltip_chart_pequeño_senado" style="border-radius:2px;display: none; position: absolute;  z-index: 100;  background: #fff; color: black; width: auto; box-shadow: 2px 2px 6px rgba(40, 40, 40, 0.5); left: 0px;">
            <p id="tooltip_chart_pequeño_data_senado" style="margin: 0px;padding: 2px;font-size: 10px;background-color: black;opacity: .7;color: white;text-align: center;"></p>
          </div>
        </div>
        <div id="partidos_senado_pequeño" style="margin:36px 10px 20px;">
          <p style="font-family: 'Oxygen', serif; font-size: 12px;text-align: left; color: #474747; border-bottom: 1px solid #cbcbcb">Otros:</p>
        </div>
      </div>
    </div>
  </div> 
</div>
</template>

<script>
export default {
  name: 'ArcoSenado',
  props: ['dataset', 'unit'],
  data () {
    return {
      'senado': this.dataset['senado']['actuales']['total'],
      'allParties': this.dataset['senado']['actuales']['total'].candidaturas,
      'bigParties': this.dataset['senado']['actuales']['total'].candidaturas.filter(
        candidatura => {
          return +candidatura.senadores_electos >= 5
        }
      ),
      'littleParties': this.dataset['senado']['actuales']['total'].candidaturas.filter(candidatura => {
        return +candidatura.senadores_electos < 5 && candidatura.siglas_candidatura !== 'ECP-GUANYEM EL CANVI'
      }),
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
  mounted () {
    //* *** ARCO SENADO GRANDE NORMAL ****/
    let numText = '208'
    let unitText = 'senadores'
    let escrutado = 'Total escrutado: ' + this.senado.porc_censo_escrutado

    if(window.innerWidth>900){
      var width = 600
    }else if(window.innerWidth>500&&window.innerWidth<900){
      var width = 450
    }else{
      var width = 304
    }

     if(window.innerWidth>900||window.innerWidth<500){
      var height = 300
    }else if(window.innerWidth>500&&window.innerWidth<900){
      var height = 400
    }
    let thickness= (window.innerWidth>500)? 115:85
    let legendRectSize = 18
    let legendSpacing = 0
    var d3 = this.$d3

    if(window.innerWidth>900){
      var radius = Math.min(width, height) * 0.75
    }else if(window.innerWidth>500&&window.innerWidth<900){
      var radius =Math.min(width, height) /2
    }else{
      var radius = Math.min(width, height) * 0.5
    }
  
    let svg = d3
      .select('#chart_senado')
      .append('svg')
      .attr('class', 'pie1senado')
      .attr('width', width)
      .attr('height', height)

    let g = svg
      .append('g')
       .attr('transform', d=>{
        if(this.width23>900){
          return 'translate(' + width * 0.5 + ',' + height * 0.9 + ')'
        }else if(window.innerWidth>500&&window.innerWidth<900){
          return 'translate(' + width / 2 + ',' + height / 2 + ')'
        }else{
          return 'translate(' + 304 / 2 + ',' + height * 0.7 + ')'
        }
      })

    let arc = d3
      .arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius)

    let pie = d3
      .pie()
      .startAngle(-90 * (Math.PI / 180))
      .endAngle(90 * (Math.PI / 180))
      .padAngle(0.001) // some space between slices
      .value(function (d) {
        return +d.senadores_electos
      })
      .sort(null)

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', (window.innerWidth>900)? '38px' : '25px')
      .attr('font-weight', 'bolder')
      .attr('font-family', 'Bitter')
      .attr('dy', '.35em')
      .attr('transform', d=>{
        if(window.innerWidth>900){
          return 'translate(' + width * 0.5 + ',' + height * 0.81 + ')'
        }else if(window.innerWidth>500&&window.innerWidth<900){
          return 'translate(' + width / 2 + ',' + height / 2.3 + ')'
        }else{
          return 'translate(' + width * 0.5 + ',' + height * 0.61 + ')'
        }
      })
      .text(numText)

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-weight', 'bolder')
      .attr('font-family', 'Bitter')
      .attr('dy', '.35em')
      .attr('transform', 'translate(' + width * 0.5 + ',' + height * 0.88 + ')')
      .attr('transform', d=>{
        if(window.innerWidth>900){
          return 'translate(' + width * 0.5 + ',' + height * 0.88 + ')'
        }else if(window.innerWidth>500&&window.innerWidth<900){
          return 'translate(' + width / 2 + ',' + height / 2.1 + ')'
        }else{
          return 'translate(' + width * 0.5 + ',' + height * 0.68 + ')'
        }
      })
      .text(unitText)

    let tooltip = d3
      .select('#tooltip_chart_' + 'senado')

    let tooltipData = d3
      .select('#tooltip_chart_data_' + 'senado')

    let otros = {
      'siglas_candidatura': 'Otros*',
      'color_candidatura': '#777',
      'senadores_electos': 0
    }
    let totalOtros = 0
    var extra = 0
    for (let i in this.littleParties) {
      totalOtros += +this.littleParties[i].senadores_electos
      if (this.littleParties[i].siglas_candidatura === 'ECP-GUANYEM EL CANVI') {
        extra = +this.littleParties[i].senadores_electos
      }
    }
    otros.senadores_electos = totalOtros

    this.bigParties.push(otros)
    for (let i in this.bigParties) {
      if (this.bigParties[i].siglas_candidatura === 'PODEMOS-IU-EQUO') {
        this.bigParties[i].senadores_electos += extra
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

    gg.append('path')
      .attr('d', arc)
      .attr('stroke-with', '1')
      .attr('stroke', '#ffffff')
      .style('opacity', '.9')
      .attr('fill', (d) => {
        return d.data.color_candidatura
      })
      .attr('title', (d) => {
        return d.data.siglas_candidatura
      })
      .on('mouseover', function (d) {
        let colorCandidatura = d.data.color_candidatura
        let siglasCandidatura = d.data.siglas_candidatura
        if (d.data.siglas_candidatura === 'UP + G') {
          siglasCandidatura = 'UP<br> + <br> GUANYEM'
        }
        let senadoresCandidatura = +d.data.senadores_electos
        tooltip.style('cursor', 'pointer')
          .style('fill', 'black')
          .style('display', 'none')
        let html = `<table>`
        html += `<tr><td style='margin-bottom:1px;font-size:14px;font-weight:bolder;font-family: "Bitter"; text-align: center;'><span style=" color: ${colorCandidatura}">${siglasCandidatura}</span></td></tr>`

        html +=
          `<tr style="text-align: center">` +
          `<td style='padding:5px; font-size:14px;font-family: "Oxygen"'>${senadoresCandidatura} senadores</td>` +
          `</tr>`
        html += `</table>`
        tooltip.html(html)
      })
      .on('mousemove', function(){
        if(window.innerWidth > 500){
          tooltip.style('left', `${d3.event.pageX -120 }px`)
        .style('top',(d3.event.pageY-20)+"px")
        }else{
          tooltip.style('left', `35%`)
        .style('top',`200px`)
        }
        })
      .on('mouseout', function (d) {
        d3.select('#tooltip_chart_' + 'senado')
          .style('display', 'block')
      })

    gg.append('text')
      .attr('transform', function (d) {
        return 'translate(' + arc.centroid(d) + ')'
      })
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'bolder')
      .style('font-family', 'Oxygen')
      .attr('fill', '#fff')
      .text(function (d) {
        if (d.data.siglas_candidatura === 'PODEMOS-IU-EQUO') {
          d.data.siglas_candidatura = 'UP + G'
        }
        if (d.data.siglas_candidatura === 'ERC-SOBIRANISTES') {
          d.data.siglas_candidatura = 'ERC'
        }
        return `${d.data.siglas_candidatura} ${+d.data.senadores_electos}`
      })

    let partidos = d3
      .select('#partidos_senado')

    let listado = partidos.append('ul')
      .attr('class', 'partidos')
      .style('list-style', 'none')
      .style('flex-flow', 'wrap')
      .style('display', 'flex')
      .style('padding-inline-start', '0px')
      .style('justify-content', 'space-evenly')
      .style('margin-top', '0px')

    let legend = listado
      .selectAll('.legend')
      .data(this['littleParties'])
      .enter()
      .filter(function (d) {
        return +d.senadores_electos >= 1
      })
      .append('li')
      .attr('class', 'legend')
      .style('display', 'flex')
      .style('margin', '0 auto')
      .style('flex-flow', 'start')
      .style('align-items', 'baseline')

    legend.append('span')
      .style('width', '0')
      .style('display', 'inline')
      .style('border-left', '20px solid transparent')
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
      .style('border-top', '20px solid transparent')

    legend.append('span')
      .text(function (d, i) {
        return +d.senadores_electos
      })
      .style('font-size', '12px')
      .style('color', 'black')
      .style('font-family', 'Oxygen')
      .style('border-top', '15px solid transparent')

    //* *** FIN ****//
    
    //* ***ARCO PEQUEÑO NORMAL ****//
    if(window.innerWidth>900){
      var width2 = 350
    }else if(window.innerWidth>500&&window.innerWidth<900){
      var width2 = 450
    }else{
      var width2 = 304
    }

     if(window.innerWidth>900||window.innerWidth<500){
      var height2 = 300
    }else if(window.innerWidth>500&&window.innerWidth<900){
      var height2 = 400
    }

    if(window.innerWidth>900||window.innerWidth<500){
      var thickness2 = 85
    }else if(window.innerWidth>500&&window.innerWidth<900){
      var thickness2 = 115
    }

    if(window.innerWidth>900){
      var radius2 = Math.min(width2, height2) * 0.5
    }else if(window.innerWidth>500&&window.innerWidth<900){
      var radius2 =Math.min(width2, height2) /2
    }else{
      var radius2 = Math.min(width2, height2) * 0.5
    }

    let svg2 = d3
      .select('#chart_senado_pequeño')
      .append('svg')
      .attr('class', 'pie2senado')
      .attr('width', width2)
      .attr('height', d=>{
        if(window.innerWidth>900){
          return height2
        }else{
          return height2 * 0.7
        }
      })

    let g2 = svg2
      .append('g')
      .attr('transform', d=>{
        if(this.width23>900){
          return 'translate(' + width2 * 0.5 + ',' + height2 * 0.9 + ')'
        }else if(window.innerWidth>500&&window.innerWidth<900){
          return 'translate(' + width2 / 2 + ',' + height2 / 2 + ')'
        }else{
          return 'translate(' + 304 / 2 + ',' + height2 * 0.7 + ')'
        }
      })

    let arc2 = d3
      .arc()
      .innerRadius(radius2 - thickness2)
      .outerRadius(radius2)

    let pie2 = d3
      .pie()
    // this will create arc data for us given a list of values
      .startAngle(-90 * (Math.PI / 180))
      .endAngle(90 * (Math.PI / 180))
      .padAngle(0.001) // some space between slices
      .value(function (d) {
        return +d.senadores_electos
      })
      .sort(null)
      console.log(radius2)

    svg2.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '25px')
      .attr('font-weight', 'bolder')
      .attr('font-family', 'Bitter')
      .attr('dy', '.35em')
      .attr('transform', d=>{
        if(window.innerWidth>900){
          return 'translate(' + width2 * 0.5 + ',' + height2 * 0.83 + ')'
        }else if(window.innerWidth>500&&window.innerWidth<900){
          return 'translate(' + width2 / 2 + ',' + height2 / 2.3 + ')'
        }else{
          return 'translate(' + width2 * 0.5 + ',' + height2 * 0.61 + ')'
        }
      })
      .text(numText)

    svg2.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-weight', 'bolder')
      .attr('font-family', 'Bitter')
      .attr('dy', '.35em')
      .attr('transform', d=>{
        if(window.innerWidth>900){
          return 'translate(' + width2 * 0.5 + ',' + height2 * 0.89 + ')'
        }else if(window.innerWidth>500&&window.innerWidth<900){
          return 'translate(' + width2 / 2 + ',' + height2 / 2.1 + ')'
        }else{
          return 'translate(' + width2 * 0.5 + ',' + height2 * 0.68 + ')'
        }
      })
      .text(unitText)

    let tooltip2 = d3
      .select('#tooltip_chart_pequeño_' + 'senado')

    let tooltipData2 = d3
      .select('#tooltip_chart_pequeño_data_' + 'senado')

    let gg2 = g2
      .selectAll('path')
      .data(pie(this.bigParties))
      .enter()
      .append('g')
      .on('mouseover', function (d) {
        tooltip2.style('cursor', 'pointer')
          .style('display', 'block')
      })
      .on('mouseout', function (d) {
        tooltip2.style('cursor', 'none')
          .style('display', 'none')
      })

    gg2.append('path')
      .attr('d', arc2)
      .attr('stroke-with', '1.2')
      .attr('stroke', '#fff')
      .style('opacity', '.9')
      .attr('fill', (d) => {
        return d.data.color_candidatura
      })
      .attr('title', (d) => {
        return d.data.siglas_candidatura
      })
      .on('mouseover', function (d) {
        let colorCandidatura = d.data.color_candidatura
        let siglasCandidatura = d.data.siglas_candidatura
        if (d.data.siglas_candidatura === 'UP + G') {
          siglasCandidatura = 'UP<br> + <br> GUANYEM'
        }
        let senadoresCandidatura = +d.data.senadores_electos
        tooltip2.style('cursor', 'pointer')
          .style('fill', 'black')
          .style('display', 'none')
        let html2 = `<table>`
        html2 += `<tr><td style='margin-bottom:1px;font-size:14px;font-weight:bolder;font-family: "Bitter"; text-align: center;'><span style=" color: ${colorCandidatura}">${siglasCandidatura}</span></td></tr>`

        html2 +=
          `<tr style="text-align: center">` +
          `<td style='padding:5px;font-size:14px;font-family: "Oxygen"'>${senadoresCandidatura} senadores</td>` +
          `</tr>`
        html2 += `</table>`
        tooltip2.html(html2)
      })
       .on('mousemove', function(){
        if(window.innerWidth > 500){
          tooltip2.style('left', `${d3.event.pageX -120 }px`)
        .style('top',(d3.event.pageY-20)+"px")
        }else{
          tooltip2.style('left', `35%`)
        .style('top',`200px`)
        }
        })
      .on('mouseout', function (d) {
        d3.select('#tooltip_chart_pequeño' + 'senado')
          .style('display', 'block')
      })

    gg2.append('text')
      .attr('transform', function (d) {
        return 'translate(' + arc2.centroid(d) + ')'
      })
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'bolder')
      .style('font-family', 'Oxygen')
      .attr('fill', '#fff')
      .text(function (d) {
        if (d.data.siglas_candidatura === 'PODEMOS-IU-EQUO') {
          d.data.siglas_candidatura = 'UP + G'
        }
        if (d.data.siglas_candidatura === 'ERC-SOBIRANISTES') {
          d.data.siglas_candidatura = 'ERC'
        }
        return `${d.data.siglas_candidatura} ${+d.data.senadores_electos}`
      })

    let partidos2 = d3
      .select('#partidos_senado_pequeño')

    let listado2 = partidos2.append('ul')
      .attr('class', 'partidos')
      .style('list-style', 'none')
      .style('flex-flow', 'wrap')
      .style('display', 'flex')
      .style('padding-inline-start', '0px')
      .style('justify-content', 'space-evenly')
      .style('margin-top', '0px')

    let legend2 = listado2
      .selectAll('.legend')
      .data(this['littleParties'])
      .enter()
      .filter(function (d) {
        return +d.senadores_electos >= 1
      })
      .append('li')
      .attr('class', 'legend')
      .style('display', 'flex')
      .style('margin', '0 auto')
      .style('flex-flow', 'start')
      .style('align-items', 'baseline')

    legend2.append('span')
      .style('width', '0')
      .style('display', 'inline')
      .style('border-left', '20px solid transparent')
      .style('border-bottom', '10px solid')
      .style('border-bottom-color', (d, i) => {
        return d.color_candidatura
      })

    legend2.append('span')
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
      .style('border-top', '20px solid transparent')

    legend2.append('span')
      .text(function (d, i) {
        return +d.senadores_electos
      })
      .style('font-size', '12px')
      .style('color', 'black')
      .style('font-family', 'Oxygen')
      .style('border-top', '15px solid transparent')

    // ****FIN ARCO PEQUEÑO ****//
  },
  methods: {
    responsive1(){
      return (window.innerWidth > 500) ? 'chart_senado_mediano' : 'chart_senadoResponsive'
    },
    handleResize () {
      this.width23 = window.innerWidth
      this.height23 = window.innerHeight
      console.log(this.width23)
    },
    numberFormat (number) {
      return new Intl.NumberFormat('es-ES').format(number)
    },
    textoInformativo () {
      return '<ul class="info">' +
      '<li style="list-style-type: none;"><h2>Participación</h2></li>' +
      '<li><span style="align-self: flex-start">Mesas totales: </span><b style="align-self: flex-end">' + this.numberFormat(this.senado.num_mesas_totales) + '</b></li>' +
      '<li><span style="align-self: flex-start">Porcentaje de abstención: </span><b style="align-self: flex-end">' + this.numberFormat(this.senado.porc_abstencion) + '%</b></li>' +
      '<li><span style="align-self: flex-start">Porcentaje de censo escrutado: </span><b style="align-self: flex-end">' + this.numberFormat(this.senado.porc_censo_escrutado) + '%</b></li>' +
      '<li><span style="align-self: flex-start">Porcentaje total de votantes: </span><b style="align-self: flex-end">' + this.numberFormat(this.senado.porc_total_votantes) + '%</b></li>' +
      '<li><span style="align-self: flex-start">Porcentaje de votos en blanco: </span><b style="align-self: flex-end">' + this.numberFormat(this.senado.porc_votos_blanco) + '%</b></li>' +
      '<li><span style="align-self: flex-start">Porcentaje de votos nulos: </span><b style="align-self: flex-end">' + this.numberFormat(this.senado.porc_votos_nulos) + '%</b></li>' +
      '<li><span style="align-self: flex-start">Total de votantes: </span><b style="align-self: flex-end">' + this.numberFormat(this.senado.total_votantes) + '</b></li>' +
      '<li><span style="align-self: flex-start">Total votos en blanco: </span><b style="align-self: flex-end">' + this.numberFormat(this.senado.votos_blanco) + '</b></li>' +
      '<li><span style="align-self: flex-start">Total votos nulos: </span><b style="align-self: flex-end">' + this.numberFormat(this.senado.votos_nulos) + '</b></li>' +
      '</ul>'
    }
  }
}
</script>
<style scoped>
div.arco {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
}
  #chart_senado {
    flex-grow: 2;
    align-self: flex-start;
    flex-flow: column;
  }
  #partidos_senado {
    display: flex;
    flex-grow: 1;
    align-self: flex-end;
    margin: 50px;
    flex-flow: column;
  }

  ul.info li{
    display:flex !important;
    flex-direction: row;
    width: max-content;
  }
  ul.info li > b {
    align-self: flex-end;
  }
  .tabs1 {
  display: flex;
  flex-wrap: wrap;
  width: 100%
}
.tabs1 label {
  display: block;
  padding: 8px 16px;
  margin: 3px;
  cursor: pointer;
  background: #b2b2b2;
  font-weight: bold;
  transition: background ease 0.2s;
  color: white;
  align-items: flex-end;
  display: flex;
  font-family: "Oxygen";
}
.tabs1 .tab1 {
  order: 1;
  flex-grow: 1;
  width: 100%;
  display: none;
  background: #fff;
}
.tabs1 input[type="radio"] {
  display: none;
}
.tabs1 input[type="radio"]:checked + label {
  background: #474747;
}
.tabs1 input[type="radio"]:checked + label + .tab1 {
  display: block;
}
  .tabs12 {
  display: flex;
  flex-wrap: wrap;
  width: 100%
}
.tabs12 label {
  display: block;
  padding: 8px 16px;
  margin: 3px;
  cursor: pointer;
  background: #b2b2b2;
  font-weight: bold;
  transition: background ease 0.2s;
  color: white;
  align-items: flex-end;
  display: flex;
  font-family: "Oxygen";
  border-radius: 2px;
}
.tabs12 .tab12 {
  order: 1;
  flex-grow: 1;
  width: 100%;
  display: none;
  background: #fff;
}
.tabs12 input[type="radio"] {
  display: none;
}
.tabs12 input[type="radio"]:checked + label {
  background: #474747;
}
.tabs12 input[type="radio"]:checked + label + .tab12 {
  display: block;
}
</style>