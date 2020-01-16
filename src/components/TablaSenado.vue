<template>
  <div class="tabla">
  </div>

</template>

<script>
export default {
  name: 'TablaSenado',
  props: ['dataset', 'type', 'unit'],
  data () {
    return {
      'senado': this.dataset['senado']['actuales']['total'].candidaturas.filter(
        candidatura => {
          return +candidatura.senadores_electos > 0
        }
      ),
      'bigParties': this.dataset['senado']['actuales']['total'].candidaturas.filter(
        candidatura => {
          return +candidatura.senadores_electos >= 4
        }
      ),
      'littleParties': this.dataset['senado']['actuales']['total'].candidaturas.filter(candidatura => {
        return +candidatura.senadores_electos < 4 && candidatura.siglas_candidatura !== 'ECP-GUANYEM EL CANVI'
      })
    }
  },
  mounted () {
    let d3 = this.$d3
     let table = d3
      .select('.tabla')
      .append('table')
      .attr('class', 'table1' + 'senado')


    let gg = table
      .selectAll('tr')
      .data(this.senado)
      .enter()

      let tr = gg
      .append('tr')

    tr.append('td')
      .append('span')
      .style('color', (d) => d.color_candidatura)
      .text((d) => d.siglas_candidatura)

    tr.append('td')
      .text((d) => +d.senadores_electos)
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
span {
  font-family: 'Oxygen', serif;
}
  table {
    border-collapse: collapse;
    border: 1px solid black;
    margin: 50px;
  }

</style>
