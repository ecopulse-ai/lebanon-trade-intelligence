import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Overview from './views/Overview.jsx'
import HSExplorer from './views/HSExplorer.jsx'
import Partners from './views/Partners.jsx'
import ReExports from './views/ReExports.jsx'
import Methodology from './views/Methodology.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/hs" element={<HSExplorer />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/re-exports" element={<ReExports />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="*" element={<Overview />} />
      </Routes>
    </Layout>
  )
}
