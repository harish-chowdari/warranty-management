import React, { useState, useEffect } from 'react'
import axios from '../../axios'
import { toast } from 'react-hot-toast'

const ViewCart = () => {
  const [cart, setCart] = useState({})
  const [allPurchased, setAllPurchased] = useState([])
  const [activePurchase, setActivePurchase] = useState(null)
  const [purchaseData, setPurchaseData] = useState({ state: '', city: '', area: '', street: '', pincode: '' })
  const [paymentData, setPaymentData] = useState({ cardNumber: '', expiryDate: '', cvv: '' })
  const [showPayment, setShowPayment] = useState(false)
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    if (userId) {
      axios.get(`/cart/${userId}`).then(({ data }) => setCart(data || {}))
      axios.get('/get-every-purchases').then(({ data }) => setAllPurchased(data || []))
    }
  }, [userId])

  const aggregated = {}
  allPurchased.forEach(p => {
    p.products.forEach(({ productId, quantity }) => {
      const id = productId._id || productId
      aggregated[id] = (aggregated[id] || 0) + quantity
    })
  })

  const handleIncreaseQuantity = async (productId, qty, stock) => {
    const remaining = stock - (aggregated[productId] || 0)
    if (qty + 1 > remaining) return toast.error(`Only ${remaining} left`)
    await axios.post(`/add-to-cart/${productId}/${userId}`, { quantity: 1 })
    axios.get(`/cart/${userId}`).then(({ data }) => setCart(data || {}))
  }

  const handleDecreaseQuantity = async productId => {
    await axios.delete(`/remove-from-cart/${productId}/${userId}`)
    axios.get(`/cart/${userId}`).then(({ data }) => setCart(data || {}))
  }

  const openPurchaseForm = item => {
    setActivePurchase(item)
    setPurchaseData({ state: '', city: '', area: '', street: '', pincode: '' })
  }

  const submitAddress = () => {
    const { quantity } = activePurchase
    const remaining = activePurchase.productId.quantity - (aggregated[activePurchase.productId._id] || 0)
    const { state, city, area, street, pincode } = purchaseData
    if (quantity > remaining) return toast.error(`Only ${remaining} left`)
    if (![state, city, area, street, pincode].every(Boolean)) return toast.error('Fill all address fields')
    setShowPayment(true)
  }

  const handlePayment = async () => {
    const { quantity, productId } = activePurchase
    const { state, city, area, street, pincode } = purchaseData
    const { cardNumber, expiryDate, cvv } = paymentData
    if (![cardNumber, expiryDate, cvv].every(Boolean)) return toast.error('Fill all payment fields')
    const payload = {
      quantity,
      fullAddress: { state, city, area, street, pincode },
      paymentDetails: { cardNumber, expiryDate, cvv }
    }
    try {
      await axios.post(`/create-purchase/${productId._id}/${userId}`, payload)
      toast.success('Order placed successfully')
      await axios.delete(`/remove-all-from-cart/${productId._id}/${userId}`)
      axios.get(`/cart/${userId}`).then(({ data }) => setCart(data || {}))
      axios.get('/get-every-purchases').then(({ data }) => setAllPurchased(data || []))
      setShowPayment(false)
      setActivePurchase(null)
      setPaymentData({ cardNumber: '', expiryDate: '', cvv: '' })
    } catch {
      toast.error('Payment failed')
    }
  }

  if (showPayment && activePurchase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br ">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Payment Details</h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Card Number</label>
            <input
              name="cardNumber"
              value={paymentData.cardNumber}
              onChange={e => setPaymentData(d => ({ ...d, cardNumber: e.target.value }))}
              placeholder="1234 5678 9012 3456"
              className="w-full border p-2 rounded focus:outline-none"
            />
          </div>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Expiry (MM/YY)</label>
              <input
                name="expiryDate"
                value={paymentData.expiryDate}
                onChange={e => setPaymentData(d => ({ ...d, expiryDate: e.target.value }))}
                placeholder="MM/YY"
                className="w-full border p-2 rounded focus:outline-none"
              />
            </div>
            <div className="w-24">
              <label className="block mb-1 font-medium">CVV</label>
              <input
                name="cvv"
                value={paymentData.cvv}
                onChange={e => setPaymentData(d => ({ ...d, cvv: e.target.value }))}
                placeholder="123"
                className="w-full border p-2 rounded focus:outline-none"
              />
            </div>
          </div>
          <div className="text-xl font-semibold mb-6 text-center">
            Total: ${activePurchase.productId.price * activePurchase.quantity}
          </div>
          <button
            onClick={handlePayment}
            className="w-full py-3 rounded bg-gradient-to-r  bg-blue-400 text-white font-medium hover:bg-blue-500 cursor-pointer transition"
          >
            Pay ${activePurchase.productId.price * activePurchase.quantity}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Your Shopping Cart</h1>
      <div className="space-y-6">
        {cart.products?.map(item => {
          const { productId, quantity, _id } = item
          const remaining = productId.quantity - (aggregated[productId._id] || 0)
          return (
            <div key={_id} className="flex bg-white shadow-md rounded-lg p-4">
              <img
                src={productId.image?.[0] || 'https://via.placeholder.com/150'}
                alt={productId.name}
                className="w-32 h-32 object-cover rounded-lg mr-4"
              />
              <div className="flex flex-col justify-between flex‑1">
                <div>
                  <h2 className="text-xl font-semibold">{productId.name}</h2>
                  <p className="text-gray-600"><span className="font-medium">Category:</span> {productId.category}</p>
                  <p className="text-gray-600"><span className="font-medium">Price:</span> ${productId.price}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => handleDecreaseQuantity(productId._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-l"
                    >
                      -
                    </button>
                    <span className="px-4">{quantity}</span>
                    <button
                      onClick={() => handleIncreaseQuantity(productId._id, quantity, productId.quantity)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="font-bold">Total: ${productId.price * quantity}</p>
                  <button
                    onClick={() => openPurchaseForm(item)}
                    disabled={remaining <= 0}
                    className={`py-2 px-6 rounded ${remaining > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-500 cursor-not-allowed'} text-white`}
                  >
                    {remaining > 0 ? 'Buy' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {cart?.products?.length === 0 && <p className="text-center text-gray-600">Your cart is empty.</p>}
      </div>
      {activePurchase && !showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg space-y-4">
            <h3 className="text-xl font-semibold">Enter Shipping Address</h3>
            {['state','city','area','street','pincode'].map(field => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={purchaseData[field]}
                onChange={e => setPurchaseData(d => ({ ...d, [field]: e.target.value }))}
                className="w-full border p-2 rounded focus:outline-none"
              />
            ))}
            <div className="flex justify-end space-x-2">
              <button onClick={() => setActivePurchase(null)} className="px-4 py-2 rounded border">Cancel</button>
              <button onClick={submitAddress} className="px-4 py-2 rounded bg-blue-600 text-white">Continue to Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewCart
