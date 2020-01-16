<template>
  <div class="tabla">
    <div class="text-participacion" style=" display: flex; flex-flow: wrap; justify-content: space-around; padding: 1em">
      <span class="scruted">Escrutado {{escrutado}} %</span>
  </div>
    <table class="tabla" style="margin:20px auto;border-collapse: collapse">
      <thead>
      <tr v-if="this.width23 > 500" style="font-family: Bitter; font-weight: bolder; font-size: 10px; text-transform: uppercase">
        <th colspan="2"></th>
        <th class="votos" colspan="2">% de votos</th>
        <th class="votos" colspan="2">Nº de votos</th>
      </tr>
      <tr v-if="this.width23 < 500"  style="font-family: Bitter; font-weight: bolder; font-size: 10px; text-transform: uppercase">
        <th colspan="2"></th>
        <th style="padding-botom:2px" colspan="1">% de votos</th>
        <th colspan="1">Nº de votos</th>
      </tr>
      <tr style="font-family: 'Oxygen'; color: #00a632; font-size: 12px;">
        <th colspan="2"></th>
        <th>10-N</th>
        <th class="anteriores">28-A</th>
        <th>10-N</th>
        <th class="anteriores">28-A</th>
      </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>

</template>

<script>
export default {
  name: 'TablaCongreso',
  props: ['dataset', 'type', 'unit'],
  data () {
    return {
      width23: '',
      heigh23: '',
      'escrutado': this.dataset['congreso']['actuales']['total'].porc_censo_escrutado,
      'participacion': this.dataset['congreso']['actuales']['total'].porc_total_votantes,
      'congreso': {
        'actuales': this.dataset['congreso']['actuales']['total'].candidaturas.filter(candidatura => candidatura.diputados_electos_candidatura > 5)
          .map(
            candidatura => {
              if (candidatura.siglas_candidatura === 'ECP-GUANYEM EL CANVI') {
                candidatura.siglas_candidatura = 'GUANYEM'
              }
              return candidatura
            }
          ),
        'anteriores': this.dataset['congreso']['anteriores'].candidaturas.map(
          candidatura => {
            if (candidatura.siglas_candidatura === "C's") {
              candidatura.siglas_candidatura = 'Cs'
            }
            if (candidatura.siglas_candidatura === 'PODEMOS-IU-EQUO') {
              candidatura.siglas_candidatura = 'UP'
            }
            if (candidatura.siglas_candidatura === 'ERC-CATSÍ') {
              candidatura.siglas_candidatura = 'ERC'
            }
            return candidatura
          }
        )
      }
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
    },
    numberFormat (number) {
      if (typeof number === 'number') {
        return new Intl.NumberFormat('es-ES').format(number)
      } else return number
    },
    partyData (id, year) {
      let data = this.congreso[year].filter(candidatura => candidatura['siglas_candidatura'] === id)[0]
      if (typeof data !== 'undefined') {
        return data
      } else {
        return {
          cod_candidatura: '',
          color_candidatura: '',
          diputados_electos_candidatura: '--',
          porc_votos_candidatura: '--',
          siglas_candidatura: '',
          votos_candidatura: '--'
        }
      }
    },
    liStyle (img) {
      return require('@/assets/' + img + '.svg')
    }
  },
  mounted () {
    let partiesIds = []
    let partiesTableData = []

    for (let i in this.congreso['actuales']) {
      partiesIds.push(this.congreso['actuales'][i]['siglas_candidatura'])
    }

    // console.log(partiesIds)

    for (let j in partiesIds) {
      partiesTableData.push({
        'actuales': this.partyData(partiesIds[j], 'actuales'),
        'anteriores': this.partyData(partiesIds[j], 'anteriores'),
        'sube': (+this.partyData(partiesIds[j], 'actuales').porc_votos_candidatura > +this.partyData(partiesIds[j], 'anteriores').porc_votos_candidatura) ? 'sube' : 'baja',
        'nada': (+this.partyData(partiesIds[j], 'anteriores').porc_votos_candidatura == '--') ? ' ' : 'nada',

      })
    }

    let d3 = this.$d3
    let table = d3
      .select('tbody')

    let gg = table
      .selectAll('tr')
      .data(partiesTableData)
      .enter()

    let tr = gg
      .append('tr')
      .attr('style', 'border-bottom: 1px solid #c0c0c0')

    tr.append('td')
      .attr('style', d => {
        if (this.width23 < 700) {
          return 'padding:3px 14px'
        } else {
          return 'padding:9px 14px'
        }
      })
      .append('img')
      .attr('height', '15px')
      .attr('width', '15px')
      .attr('src', d => {
        if (d['anteriores'].porc_votos_candidatura == '--') {
          return this.liStyle(d['nada'])
        } else {
          return this.liStyle(d['sube'])
        }
      })

    tr.append('td')
      .attr('style', d => {
        if (this.width23 < 700) {
          return 'padding:3px 14px'
        } else {
          return 'padding:9px 14px'
        }
      })
      .append('span')
      .attr('style', 'font-family: Bitter; font-size: 12px; font-weight: bolder; float:left; white-space: nowrap ')
      .text(d => d['actuales'].siglas_candidatura)

    tr.append('td')
      .attr('style', d => {
        if (this.width23 < 700) {
          return 'padding:3px 14px'
        } else {
          return 'padding:9px 14px'
        }
      })
      .append('span')
      .attr('style', 'font-family: Oxygen; font-size: 12px;font-weight: bolder;')
      .text(d => {
        if (d['actuales'].porc_votos_candidatura !== '--') {
          return d['actuales'].porc_votos_candidatura + '%'
        }
      })

    if (this.width23 > 500) {
      tr.append('td')
        .attr('style', d => {
          if (this.width23 < 700) {
            return 'padding:3px 14px'
          } else {
            return 'padding:9px 14px'
          }
        })
        .append('span')
        .attr('style', 'font-family: Oxygen; font-size: 12px;')
        .text(d => {
          if (d['anteriores'].porc_votos_candidatura !== '--') {
            return d['anteriores'].porc_votos_candidatura + '%'
          }
          return '--'
      })
    }

    tr.append('td')
      .attr('style', d => {
        if (this.width23 < 700) {
          return 'padding:4px 14px'
        } else {
          return 'padding:9px 14px'
        }
      })
      .append('span')
      .attr('style', 'font-family: Oxygen; font-size: 12px;font-weight: bolder;')
      .text(d => this.numberFormat(d['actuales'].votos_candidatura))

    if (this.width23 > 500) {
      tr.append('td')
        .attr('style', d => {
          if (this.width23 < 700) {
            return 'padding:3px 14px'
          } else {
            return 'padding:9px 14px'
          }
        })
        .append('span')
        .attr('style', 'font-family: Oxygen; font-size: 12px;')
        .text(d => this.numberFormat(d['anteriores'].votos_candidatura))
    }
  },
  computed: {

  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
span {
  font-family: 'Oxygen', serif;
}
  .congreso-tabla {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .scruted, .participacion {
  font-family: 'Oxygen';
  font-size: 14px;
  color: #474747
}
tbody td{
  padding: 15px!important;
}
@media (max-width: 900px){
  .text-participacion,.scruted{
    display: none!important;
  }
  table{
    width: 90%;
  }
}
@media  (max-width: 500px){
  .anteriores{
   display: none;
  }
}
.votos{
  padding-bottom: 3px;
}
</style>
