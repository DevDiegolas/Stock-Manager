import { Routes, Route, Navigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ProtectedRoute } from './ProtectedRoute'
import { MainLayout } from '../components/layout/MainLayout'
import { RouteTransition } from '../components/ui/RouteTransition'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Products from '../pages/Products'
import ProductForm from '../pages/ProductForm'
import ProductDetail from '../pages/ProductDetail'
import History from '../pages/History'
import Catalog from '../pages/Catalog'
import PublicCatalog from '../pages/PublicCatalog'

export function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<RouteTransition><Login /></RouteTransition>} />
        <Route path="/register" element={<RouteTransition><Register /></RouteTransition>} />
        <Route path="/c/:slug" element={<RouteTransition><PublicCatalog /></RouteTransition>} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="history" element={<History />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
