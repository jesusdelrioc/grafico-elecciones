<template>
<div class="mapa">
  <div class="text-participacion" style=" display: flex; flex-flow: wrap; justify-content: space-around; padding: 1em">
    <span class="scruted">Escrutado {{escrutado}} %</span>
  </div>
  <div class="mapa">
    <div :id="'map_' + this.type" :class="type">
      <div :id="'tooltip_mapa_' + type" style="display: none; position: absolute;  z-index: 100;  background: #fff; color: black; width: auto;  min-width: 100px; box-shadow: 2px 2px 6px rgba(40, 40, 40, 0.5); left: 0px;">
        <p :id="'tooltip_mapa_data_' + type" style="margin: 0px; padding: 10px;font-size: 10px;background-color: white;opacity: .8;color: black; font-family: 'Oxygen';text-align: center;"></p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import provincias from './json/provincias.json'
export default {
  name: 'Mapa',
  props: ['dataset', 'type'],
  data () {
    return {
      'provincias': this.dataset[this.type]['actuales']['provincias'],
      'participacion': this.dataset['congreso']['actuales']['total'].porc_total_votantes,
      'escrutado': this.dataset['congreso']['actuales']['total'].porc_censo_escrutado,
      width23: '',
      heigh23: '',
      item: provincias
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
    handleResize () {
      this.width23 = window.innerWidth
      this.height23 = window.innerHeight
    }
  },
  mounted () {
    var d3 = this.$d3
    let width = 400
    
    if(window.innerWidth>500&&window.innerWidth<900){
      var height = 313
    }else{
      var height = 400
    }

    let svg = d3
      .select('#map_' + this.type)
      .append('svg')
      .attr('width', (this.width23>900)? width: 304)
      .attr('height', height)

    // Creamos la proyección  (ver Proyecciones abajo)
    var projection = d3.geoMercator()
      .scale((this.width23>900)? 1500:1200)
      .center([0, 40])
      .translate([((this.width23>900)? width: 304) / 1.5, height / 2.5])
    // Creamos el path añadiendo la proyección
    var path = d3.geoPath(projection)

    // Obtenemos las provincias de España en formato geojson
      var provincias = this.provincias
    
      let tooltipMapa = d3
        .select('#tooltip_mapa_' + this.type)

      let tooltipMapaData = d3
        .select('#tooltip_mapa_data_' + this.type)

      svg.append('rect')
        .attr('width', (this.width23>900)? 200:130)
        .attr('height', (this.width23>900)? 120:90)
        .attr('stroke', '#cc0000')
        .attr('stroke-width', '1')
        .attr('fill', '#ffffff')
        .attr('transform', (this.width23>900)?'translate(' + width / 1.8 + ',' + height / 1.35 + ')':'translate(' + '304' / 1.8 + ',' + height / 1.5 + ')')
        .style('opacity', '.4')

      var group = svg.selectAll('g') // Creamos un grupo para cada provincia
        .data(this.item.features)
        .enter()
        .append('g')
        .append('path')
        .style('opacity', '.8')
        .attr('fill', (d) => {
          let colorCandidatura = provincias[d.properties.cod_prov][0].color_candidatura
          return colorCandidatura
        })
        .attr('title', (d) => {
          return d.properties.name
        })
        .attr('transform', (d) => {
          if (d.properties.cod_prov == 35 || d.properties.cod_prov == 38) {
            return (this.width23>900)?'translate(460,-190)':'translate(360,-150)'
          }
        })
        .attr('d', path)
        .attr('stroke', (d) => {
          if (d.properties.name === 'Ceuta' || d.properties.name === 'Melilla') {
            return provincias[d.properties.cod_prov][0].color_candidatura
          } else {
            return '#ffffff'
          }
        })
        .attr('stroke-width', (d) => {
          if (d.properties.name === 'Ceuta' || d.properties.name === 'Melilla') {
            return '3.5'
          }
          return '0.3'
        })
        .on('mouseover', function (d) {
          let selectedProv = provincias[d.properties.cod_prov]
          tooltipMapa.style('cursor', 'pointer')
            .attr('fill', '#ffffff')
            .style('display', 'block')
          let html = `<table>`
          html += `<tr><td colspan="3" style='margin-bottom:1px;font-size:14px;font-weight:bolder;font-family: "Bitter"'>${d.properties.name}</td></tr>`
          for (let i in provincias[d.properties.cod_prov]) {
            if (+selectedProv[i].porc_votos_candidatura > 1) {
              let siglasCandidatura = selectedProv[i].siglas_candidatura
              if (selectedProv[i].siglas_candidatura.startsWith('ERC-SOBIRANISTES')) {
                siglasCandidatura = 'ERC'
              }
              if (selectedProv[i].siglas_candidatura.startsWith('PODEMOS')) {
                siglasCandidatura = 'UP'
              }
              if (selectedProv[i].siglas_candidatura.startsWith('ECP-GUANYEM EL CANVI')) {
                siglasCandidatura = 'GUANYEM'
              }
              let diputadosCandidatura = selectedProv[i].diputados_electos_candidatura
              let porcVotosCandidatura = selectedProv[i].porc_votos_candidatura

              html +=
              `<tr style="text-align: left">` +
              `<td style='margin-bottom:1px;font-size:14px;font-weight:bolder;font-family: "Bitter"; min-width: 50px'>${siglasCandidatura} </td>` +
              `<td style='font-size:14px;font-family: "Oxygen"; min-width: 50px'>${porcVotosCandidatura}% </td>` +
              `<td style='font-size:14px;font-family: "Oxygen"'>${diputadosCandidatura}</td>` +
              `</tr>`
            }
          }
          //
          html += `</table>`
           
          tooltipMapaData.html(html)

          d3.select(this).style('opacity', '.4')
        })
        .on('mousemove', function(){
        if(window.innerWidth > 500){
          tooltipMapa.style('left', `${d3.event.pageX + 10}px`)
          .style('top', `${d3.event.pageY + 10}px`)
        }else{
          tooltipMapa.style('left', `30px`)
        .style('top',`${d3.event.pageY + 10}px`)
        }
        })
          
        .on('mouseout', function (d) {
          tooltipMapa.style('cursor', 'none')
            .style('display', 'none')
          d3.select(this).style('opacity', '.8')
        })
    // })
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
  .scruted, .participacion {
  font-family: 'Oxygen';
  font-size: 14px;
  color: #474747
}
@media (max-width: 900px){
  .text-participacion,.scruted{
    display: none!important;
  }
}
</style>