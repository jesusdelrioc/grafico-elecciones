<template>
<div>

<arco/>
<senado/>
</div>
</template>
<script>
import Arco from './ArcoCongreso'
import Senado from './Asientos'
export default {
  name: 'Todo',
  components: {Arco, Senado}
}
</script>
