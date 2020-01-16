<template>
  <div class="asientos">
    <div :id="'seats_' + type" :class="type">
      <div :id="'tooltip_seats_' + type">
        <p :id="'tooltip_seats_data_' + type"></p>
      </div>
    </div>
    <div :id="'partidos_' + type" style=" margin-top: 50px;"></div>
  </div>
</template>

<script>
export default {
  name: 'Asientos',
  props: ['dataset', 'type'],
  data () {
    var pack = []
    var candidates = this.dataset[this.type]['2019']['total'].candidaturas
    for (let i in candidates) {
      let pack2 = []
      let electos = +candidates[i]['senadores_electos']
      for (let j = 0; j < electos; j++) {
        if (electos > 0) {
          pack2.push(candidates[i].color_candidatura)
        } else {
          pack2.push('#000000')
        }
      }
      pack.push(pack2)
    }
    return {'pack': pack.flat()}
  },
  mounted () {
    var d3 = this.$d3
    var w = 400,
      h = 400,
      d = Math.min(w, h * 1.5),
      r0 = d * 0.2,
      r1 = d * 0.45,
      cx = w * 0.5,
      cy = d * 0.5,
      dots = 208,
      rows = 8,
      radii = d3.range(rows).map((i) => {
        return { 'a': r0 + i * ((r1 - r0) / rows) }
      }),
      phi = Math.PI,
      totalL = 0

    console.log(this)
    radii.forEach((r) => { totalL += phi * r['a'] })

    console.log(radii)
    var dotL = totalL / dots

    var svg = d3.select('#seats_' + this.type)
      .append('svg')
      .attr('height', h)
      .attr('width', w)
      .append('g')
      .attr('transform', 'translate(' + cx + ',' + cy + ')')

    var dotsTotal = 0

    radii.forEach((r, i) => {
      let dotCnt = i === radii.length - 1 ? dots - dotsTotal : Math.round(phi * r['a'] / totalL * dots),
        arc = Arc(r['a'])
      let gromenauer = d3.range(0, 1.000001, 1 / dotCnt)
      let color = this.pack[dotsTotal - 1]
      svg.append('g')
        .attr('class', 'row')
        .selectAll('circle')
        .data(gromenauer)
        .enter()
        .append('circle')
        .attr('transform', function (t) {
          return 'translate(' + arc(t) + ')'
        })
        .attr('fill', color)
        .attr('class', (d, i) => {
          return i
        })
        .attr('r', Math.min(dotL * 0.5 - 1, (r1 - r0) / rows * 0.5 - 1))

      dotsTotal += dotCnt
      console.log({'dotsTotal': dotsTotal, 'dotCnt': dotCnt, 'r': r, 'i': i})
    })
    /*    svg.selectAll('.arc').data(radii)
      .enter().append('path')
      .attr('d', function(r) {
        var arc = Arc(r),
          p0 = arc(0),
          p1 = arc(1);
        return 'M'+p0+'A'+[r,r]+' 0 '+(phi > Math.PI ? 1 : 0)+',1 '+p1;
      }); */
    function Arc (r) {
      return function (t) {
        var p = t * phi - Math.PI * 0.5 - phi * 0.5
        return [Math.cos(p) * r, Math.sin(p) * r]
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
  path { stroke: red; fill: none; stroke-width:2; opacity: 0.4}
</style>
