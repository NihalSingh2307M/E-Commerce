import { useRef, useLayoutEffect } from 'react'
import { Routes, Route } from 'react-router'
import { gsap } from 'gsap'
import Home         from './pages/Home'
import Collection   from './pages/Collection'
import About        from './pages/About'
import Contact      from './pages/Contact'
import Product      from './pages/Product'
import Cart         from './pages/Cart'
import Login        from './pages/Login'
import PlaceOrder   from './pages/PlaceOrder'
import Order        from './pages/Order'
import Navbar       from './components/Navbar'
import Footer       from './components/Footer'
import Search       from './components/Search'
import ScrollTop    from './components/ScrollTop'
import PageTransition  from './components/PageTransition'
import PageLoader      from './components/PageLoader'
import ScrollProgress  from './components/ScrollProgress'
import Chatbot         from './components/Chatbot'
import { ToastContainer } from 'react-toastify'
import Verify from './pages/Verify'

const App = () => {
  const loaderRef = useRef(null)
  const uiRef     = useRef(null)

  useLayoutEffect(() => {
    // Reinforce the CSS opacity:0 from index.html via GSAP so GSAP
    // owns the property from the start (no CSS/GSAP conflict later).
    gsap.set(uiRef.current, { opacity: 0 })
  }, [])

  const handleLoaderComplete = () => {
    // Reveal the UI shell — fires while loader is still fading out on top
    gsap.to(uiRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' })

    // Tell Hero + Navbar they can start their own entry animations
    window.__appReady = true
    window.dispatchEvent(new CustomEvent('app:ready'))
  }

  return (
    <>
      {/* Loader overlay — always mounted, never conditionally removed */}
      <PageLoader loaderRef={loaderRef} onComplete={handleLoaderComplete} />

      {/* id="ui-shell" → CSS in index.html hides it before JS even runs */}
      <div
        id="ui-shell"
        ref={uiRef}
        className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-[#F9F6F0] min-h-screen"
      >
        <ScrollProgress />
        <ToastContainer
          toastClassName="jost text-sm"
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
        />
        <Navbar />
        <Search />
        <ScrollTop />
        <PageTransition>
          <Routes>
            <Route path='/'                   element={<Home />}       />
            <Route path='/home'               element={<Home />}       />
            <Route path='/collection'         element={<Collection />} />
            <Route path='/about'              element={<About />}      />
            <Route path='/contact'            element={<Contact />}    />
            <Route path='/product/:productId' element={<Product />}    />
            <Route path='/cart'               element={<Cart />}       />
            <Route path='/login'              element={<Login />}      />
            <Route path='/place-order'        element={<PlaceOrder />} />
            <Route path='/orders'             element={<Order />}      />
            <Route path='/verify'             element={<Verify />}     />
          </Routes>
        </PageTransition>
        <Footer />
      </div>

      {/* Chatbot — fixed positioned, outside layout flow */}
      <Chatbot />
    </>
  )
}

export default App