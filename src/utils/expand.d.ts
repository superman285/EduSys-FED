import { ComponentInternalInstance } from 'vue'

export interface ComponentInstanceExpand extends ComponentInternalInstance {
  ctx: any
}
