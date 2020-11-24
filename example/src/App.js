import React from 'react'

import { DFormViewer } from 'gdc-dform-viewer'
import 'gdc-dform-viewer/dist/index.css'

const App = () => {
  return <DFormViewer form={{sections: [{fields: []}]}} />
}

export default App
