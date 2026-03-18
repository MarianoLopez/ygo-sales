import { CartProvider } from './context/CartContext'
import { CartDrawer } from './components/CartDrawer'
import { HomePage } from './pages/HomePage'

function App() {
  return (
    <CartProvider>
      <HomePage />
      <CartDrawer />
    </CartProvider>
  )
}

export default App
