import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import PropertyDetailsForm from './pages/PropertyDetailsForm'
import PropertyResults from './pages/PropertyResults'
import ValuationsList from './pages/ValuationsList'
import ValuationDetail from './pages/ValuationDetail'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/property-details" element={<PropertyDetailsForm />} />
        <Route path="/results" element={<PropertyResults />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/valuations" element={<ValuationsList />} />
          <Route path="/valuations/:id" element={<ValuationDetail />} />
        </Route>
      </Route>
    </Routes>
  )
}
