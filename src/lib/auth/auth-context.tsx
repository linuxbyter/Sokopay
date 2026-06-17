import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (phone: string) => Promise<void>
  verifyOtp: (phone: string, otp: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (phone: string) => {
    // Format phone number to ensure it has +254 prefix
    const formattedPhone = phone.startsWith('+') ? phone : `+254${phone.replace(/^0+/, '')}`
    
    try {
      await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        // For development, we can also use email as a fallback
        // In production, you would use a proper SMS provider like Twilio
        options: {
          // In production with SMS provider, you would configure this properly
          // For now, we're relying on the phone-based OTP
        }
      })
    } catch (error) {
      console.error('Error sending OTP:', error)
      throw error
    }
  }

  const verifyOtp = async (phone: string, otp: string) => {
    // Format phone number to ensure it has +254 prefix
    const formattedPhone = phone.startsWith('+') ? phone : `+254${phone.replace(/^0+/, '')}`
    
    try {
      await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms' // This would be 'sms' for phone OTP
      })
    } catch (error) {
      console.error('Error verifying OTP:', error)
      throw error
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}