/// <reference types="vite/client" />

import { ModalFuncProps } from 'ant-design-vue'

declare global {
  interface Window {
    $confirm?: (config: ModalFuncProps) => any
  }
}
