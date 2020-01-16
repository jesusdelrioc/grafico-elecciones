<template>
  <div id='app'>
     <h2 v-if="this.width23 > 900" style="font-family:bitter;font-size: 20px;align-items: center; margin: 0px;padding: 5px;">ELECCIONES GENERALES 10-N</h2>
     <h2 v-if="this.width23 < 499" style="font-family:bitter;font-size: 20px;align-items: center; margin: 0px;padding: 5px;">ELECCIONES 10-N</h2>
    <vue-tabs active-tab-color='#00a632' active-text-color='white' type='pills' centered @tab-change="handleTabChange">
      <v-tab title='CONGRESO' id='congreso'>
        <div v-if="this.width23 > 900" class='congreso-todo'>
          <div class='congreso-arco'>
            <ArcoCongreso :dataset="dataset.data" :type="'congreso'" :style="opacity" />
          </div>
          <div class="congreso-mapa" v-if="$route.path === '/arco_mapa'">
            <Mapa :dataset="dataset.data" :type="'congreso'" :style="opacity" />
          </div>
          <div class="congreso-tabla" v-if="$route.path === '/arco_tabla'">
            <TablaCongreso :dataset="dataset.data" :type="'congreso'" :style="opacity" />
          </div>

          <div class='reload'>
            <a href='#' @click="getData">
              <img src='./assets/Refresh_icon.svg' />
            </a>
          </div>
        </div>
        <div class="tabs" v-if="this.width23 < 900">
          <input type="radio" name="tabs" id="tabone" checked="checked" />
          <label for="tabone"><h1 style="font-size:13px;margin:0;">ESCAÑOS</h1></label>
          <div class="tab">
            <ArcoCongreso :dataset="dataset.data" :type="'congreso'" />
          </div>
          <input type="radio" name="tabs" id="tabtwo" checked="checked" v-if="$route.path === '/arco_mapa'"/>
          <label for="tabtwo" v-if="$route.path === '/arco_mapa'"><h1 style="font-size:13px;margin:0;">MAPA</h1></label>
          <div class="tab" v-if="$route.path === '/arco_mapa'">
            <Mapa :dataset="dataset.data" :type="'congreso'" />
          </div>
          <input type="radio" name="tabs" id="tabtwo" v-if="$route.path === '/arco_tabla'"/>
          <label for="tabtwo" v-if="$route.path === '/arco_tabla'"><h1 style="font-size:13px;margin:0">VOTOS</h1></label>
          <div class="tab congreso-tabla" v-if="$route.path === '/arco_tabla'">
            <TablaCongreso :dataset="dataset.data" :type="'congreso'" :style="opacity" />
          </div>
          <div class="reload1">
            <a href="#" @click="getData">
              <img src="./assets/Refresh_icon.svg" />
            </a>
          </div>
          <div class="text" style="flex-flow: wrap; justify-content: space-around; padding: 11px; font-family:Oxygen">
            <span class="scruted" style="font-size:13px">Escrutado {{this.dataset.data.congreso['actuales'].total.porc_censo_escrutado}} %</span>
            <span class="participacion" style="font-size:13px">Participación {{this.dataset.data.congreso['actuales'].total.porc_total_votantes}} %</span>
          </div>
        </div>
      </v-tab>
      <v-tab title="SENADO" id="senado">
        <div class="senado-todo">
          <div class="senado-arco">
            <ArcoSenado  :dataset="dataset.data" :type="'senado'" :style="opacity" />
          </div>
        </div>
      </v-tab>
    </vue-tabs>
  </div>
</template>

<script>
import ArcoCongreso from './components/ArcoCongreso'
import ArcoSenado from './components/ArcoSenado'
import Mapa from './components/Mapa'
import TablaCongreso from './components/TablaCongreso'
import { VueTabs, VTab } from 'vue-nav-tabs'
export default {
  name: 'App',
  components: {
    TablaCongreso,
    ArcoCongreso,
    ArcoSenado,
    Mapa,
    VueTabs,
    VTab
  },
  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  props: {
    dataset: {
      'data': {}
    },
    activeTabColor: String,
    activeTextColor: String,

    /**
     * Tab title position: center | bottom | top
     */
    textPosition: {
      type: String,
      default: 'center'
    },
    /**
     * Tab type: tabs | pills
     */
    type: {
      type: String,
      default: 'tabs'
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    /**
     * Centers the tabs and makes the container div full width
     */
    centered: Boolean,
    value: [String, Number, Object]
  },
  methods: {
    handleResize () {
      this.width23 = window.innerWidth
      this.height23 = window.innerHeight
      console.log(this.width23)
    },
    handleTabChange (tabIndex, newTab, oldTab) {
      console.log(tabIndex, newTab.title, oldTab.title)
    },
    getData (type = 'all') {
      this.opacity = 'opacity: 0.5;'
      let url = 'https://2019.elecciones.vozpopuli.com/api/v1/all/'
      if (type === 'all') {
        url = 'https://2019.elecciones.vozpopuli.com/api/v1/all/'
      }
      this.$http.get(url).then(response => {
        this.dataset = response.data
        setTimeout(() => (this.opacity = 'opacity: 1;') , 200)
      })
    }
  },
  beforeMount () {
    this.getData()
  },
  data () {
    return {
      width23: '',
      heigh23: '',
      'opacity': 'opacity: 1;'
    }
  },
  watch: {

  }
}
</script>

<style>

#congreso #senado {
  font-family: Oxygen;
}
.tabs__link:not(.active_tab){
  opacity: 0.2;
  color: white;
  background: #00a632;
}
.tabs__link {
  background: #00a632;
  color: white!important;
  font-weight: bolder;
  font-family: "Bitter", Helvetica, Arial, sans-serif;
}
.vue-tabs a[role=tab]:hover{
  background: #00a632!important;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#app {
  max-width: 1000px;
  height: auto;
}
.menu {
  display: flex;
}
.seleccion {
  width: 50%;
  box-shadow: 0px 0px 5px #3333333b;
  background: #000000;
}
.seleccion h1 {
  margin: 10px;
  font-size: 20px;
  color: white;
}
.congreso-todo,
.senado-todo {
  width: 100%;
  display: flex;
}
.congreso-arco {
  width: 50%;
  text-align: -webkit-center;
}
.congreso-tabla{
margin:0 auto;
}
.congreso-mapa,
.senado-mapa {
  width: 50%;
}
vue-tabs {
  cursor: pointer;
}
div.reload {
  position: relative;
  margin: 12px;
  display: inline-block;
  float: right;
}
.reload a img {
  width: 24px;
  height: 24px;
}
.reload a img:hover {
  transform: rotate(90deg);
}
div.reload1 {
  position: relative;
  display: inline-block;
  float: right;
}
.reload1 a img {
  width: 24px;
  height: 42px;
  display: table-cell;
  /* height: 400px; */
  vertical-align: middle;
}
.reload1 a img:hover {
  transform: rotate(90deg);
}
li#t-arco,
li#t-mapa {
  width: 0%;
  display: inline-table;
  padding-top: 10px;
}
#congreso-responsive .nav-tabs-navigation {
  text-align: -webkit-right;
}
@media (max-width: 900px) {
  .congreso-arco,
  .congreso-mapa,
  .senado-arco {
    width: 100%;
  }
}
.tabs {
  display: flex;
  flex-wrap: wrap;
}
.tabs label {
  display: block;
  padding: 8px 16px;
  margin:3px;
  cursor: pointer;
  background: #b2b2b2;
  font-weight: bold;
  transition: background ease 0.2s;
  color: white;
  align-items: center;
  display: flex;
  font-family: "Oxygen";
  border-radius: 2px;
}
.tabs .tab {
  order: 1;
  flex-grow: 1;
  width: 100%;
  display: none;
  background: #fff;
}
.tabs input[type="radio"] {
  display: none;
}
.tabs input[type="radio"]:checked + label {
  background: #474747;
}
.tabs input[type="radio"]:checked + label + .tab {
  display: block;
}
.resultados{
    border-bottom: 1px solid black;
  }
  .tabs h1{
    font-size: 15px;
    font-family: 'Oxygen';
  }
  @media (max-width: 900px){
.vue-tabs .nav-justified > li, .vue-tabs .nav-tabs.nav-justified > li {
    display: table-cell!important;
    width: 1%;
}}
.vue-tabs{
background: white;
}
html{
  background: #fafafa;
}
</style>
