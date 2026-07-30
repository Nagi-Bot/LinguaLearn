import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'
import { Diamond, Heart, Zap, ShoppingCart, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import SEO from '../components/SEO'

const storeItems = [
  { id: 'heart_1', type: 'hearts', amount: 1, price: 15, icon: Heart, color: 'from-red-400 to-red-500', name: '+1 Heart', desc: 'Get 1 extra heart to keep playing' },
  { id: 'heart_3', type: 'hearts', amount: 3, price: 40, icon: Heart, color: 'from-red-400 to-red-600', name: '+3 Hearts', desc: 'Get 3 extra hearts to keep playing' },
  { id: 'heart_5', type: 'hearts', amount: 5, price: 60, icon: Heart, color: 'from-red-500 to-red-700', name: '+5 Hearts', desc: 'Get 5 extra hearts to keep playing' },
  { id: 'xp_100', type: 'xp', diamonds: 10, xpAmount: 50, price: 10, icon: Zap, color: 'from-yellow-400 to-yellow-500', name: '+50 XP', desc: 'Spend 10 diamonds for 50 XP' },
  { id: 'xp_300', type: 'xp', diamonds: 30, xpAmount: 150, price: 30, icon: Zap, color: 'from-yellow-400 to-amber-500', name: '+150 XP', desc: 'Spend 30 diamonds for 150 XP' },
  { id: 'xp_500', type: 'xp', diamonds: 50, xpAmount: 250, price: 50, icon: Zap, color: 'from-amber-400 to-orange-500', name: '+250 XP', desc: 'Spend 50 diamonds for 250 XP' },
  { id: 'refill', type: 'refill', price: 30, icon: Heart, color: 'from-pink-400 to-pink-600', name: 'Refill Hearts', desc: 'Fully refill all 3 hearts' },
]

export default function StorePage() {
  const { user, buyHearts, buyXp, syncUser } = useApp()
  const [buying, setBuying] = useState(null)

  const handleBuy = async (item) => {
    if (buying) return
    setBuying(item.id)
    try {
      if (item.type === 'hearts') {
        await buyHearts(item.amount)
        toast.success(`+${item.amount} Heart${item.amount > 1 ? 's' : ''} added!`)
      } else if (item.type === 'xp') {
        await buyXp(item.diamonds)
        toast.success(`+${item.xpAmount} XP added!`)
      } else if (item.type === 'refill') {
        if ((user.diamonds || 0) < item.price) {
          toast.error('Not enough diamonds!')
          setBuying(null)
          return
        }
        await buyHearts(3)
        toast.success('Hearts fully refilled!')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed')
    }
    setBuying(null)
  }

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const itemAnim = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

  return (
    <>
      <SEO
        title="Store"
        description="Buy hearts, XP and power-ups in the LinguaLearn store. Spend diamonds to boost your English learning progress."
        keywords="english learning store, buy hearts, xp, diamonds"
        url="/store"
        noIndex={true}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

          <motion.div variants={itemAnim} className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold gradient-text flex items-center">
                <ShoppingCart className="w-8 h-8 mr-3" /> Store
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Buy hearts, XP and power-ups</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-900/30">
                <Diamond className="w-5 h-5 text-cyan-500" />
                <span className="font-bold text-lg text-cyan-700 dark:text-cyan-300">{user?.diamonds || 0}</span>
              </div>
              <div className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/30">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-bold text-lg text-red-700 dark:text-red-300">{user?.hearts || 0}/{user?.maxHearts || 3}</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemAnim}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-500" /> Hearts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {storeItems.filter(i => i.type === 'hearts' || i.type === 'refill').map(item => (
                <motion.div key={item.id} variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{item.desc}</p>
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={buying === item.id || (user?.diamonds || 0) < item.price}
                    className="w-full py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {buying === item.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><Diamond className="w-4 h-4 mr-2" /> {item.price} diamonds</>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemAnim}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" /> Buy XP
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {storeItems.filter(i => i.type === 'xp').map(item => (
                <motion.div key={item.id} variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{item.desc}</p>
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={buying === item.id || (user?.diamonds || 0) < item.price}
                    className="w-full py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-yellow-500 to-amber-500 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {buying === item.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><Diamond className="w-4 h-4 mr-2" /> {item.price} diamonds</>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemAnim} className="text-center pt-4 pb-8">
            <Link href="/dashboard" className="btn-secondary inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </div>
    </>
  )
}
